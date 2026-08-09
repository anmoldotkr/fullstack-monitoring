```
🌐 INTERNET / BROWSER
                         (http://localhost)
                                │
                                ▼
                   ┌──────────────────────────┐
                   │   Nginx Reverse Proxy    │  <-- Exposed on Port 80
                   │    (taskflow_proxy)      │
                   └────────────┬─────────────┘
                                │
          ┌─────────────────────┴─────────────────────┐
          │ (Request path: /)                         │ (Request path: /api/*)
          ▼                                           ▼
┌───────────────────┐                       ┌───────────────────┐
│  React Frontend   │                       │  Node.js Backend  │
│(taskflow_frontend)│                       │(taskflow_backend) │
│     Port 80       │                       │     Port 5000     │
└───────────────────┘                       └─────────┬─────────┘
  (Serves JS/HTML)                                    │
                                                      │ (Docker Network: "db:3306")
                                                      ▼
                                            ┌───────────────────┐
                                            │  MySQL Database   │
                                            │ (taskflow_mysql)  │
                                            └─────────┬─────────┘
                                                      │
                                                      ▼
                                            ┌───────────────────┐
                                            │ Persistent Volume │
                                            │  (mysql_data)     │
                                            └───────────────────┘
```


## Traffic Flow Example
1. User Visits Login Page

```

Browser → http://localhost/login
  ↓
Nginx (Port 80) checks URL
  ↓
Not /api/ → Forward to Frontend
  ↓
Frontend serves login page
```

2. User Submits Login Form
```
Browser → http://localhost/api/auth/login
  ↓
Nginx (Port 80) checks URL
  ↓
Starts with /api/ → Forward to Backend
  ↓
Backend processes authentication
  ↓
Response sent back to browser
```

## Interview Question's

### 1. The Core Conceptual Question

> **Interviewer:** *"Inside your Nginx configuration, you wrote `proxy_pass http://backend:5000`. Where does `backend` come from, and how does Nginx know which IP address that resolves to?"*

**Your Answer:**

> "In Docker Compose, `backend` is the **Service Name** defined in the `docker-compose.yml` file. When containers share a bridge network, Docker runs an internal embedded DNS server at `127.0.0.11`. When Nginx makes a request to `backend`, Docker's DNS intercepts that hostname and dynamically resolves it to the private IP address assigned to the `taskflow_backend` container."

---

### 2. Service Name vs. Container Name Question

> **Interviewer:** *"I see your container name in `docker ps` is `taskflow_backend`, but in Nginx you wrote `proxy_pass http://backend:5000`. Would `proxy_pass http://taskflow_backend:5000` work as well? Which one should you prefer and why?"*

**Your Answer:**

> "Yes, both work because Docker DNS registers both the service name and the explicit `container_name`. However, using the **Service Name** (`http://backend:5000`) is best practice. It decouples Nginx configuration from individual container instances. If we ever scale the backend service using `docker-compose up --scale backend=3`, Docker DNS will automatically round-robin load balance requests across all backend replicas using the service name `backend`."

---

### 3. Architecture & Security Question

> **Interviewer:** *"Why did you put Nginx in front of React and Node.js instead of having the browser call the backend directly on port 5000?"*

**Your Answer:**

> "Two main reasons: **Security** and **CORS**.
> 1. **Security & Isolation:** We don't need to expose Port 5000 or Port 3306 to the public internet. Only Nginx listens on Port 80, keeping Node.js and MySQL hidden inside Docker's internal network.
> 2. **No CORS Issues:** By using Nginx as a reverse proxy, both the React UI assets (`/`) and API requests (`/api/`) originate from the same host and port (`http://localhost`). The browser sees it as a single origin, completely eliminating CORS errors without extra backend headers."
> 
> 

---

### 4. Troubleshooting Question

> **Interviewer:** *"What happens if the `backend` container crashes or isn't running when Nginx starts up?"*

**Your Answer:**

> "By default, Nginx checks and resolves hostnames listed in `proxy_pass` at startup. If the `backend` container isn't reachable or DNS fails, Nginx will fail to start and throw an `[emerg] host not found in upstream "backend"` error. We prevent this in Docker Compose by using `depends_on` so Nginx only starts after backend is up, or by defining an Nginx `resolver` directive with dynamic variables if we need soft dependencies."