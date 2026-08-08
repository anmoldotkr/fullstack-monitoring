
## Backend code file
```
backend/
├── config/
│   └── db.js            # MySQL Database connection configuration
├── controllers/
│   ├── authController.js # Handles Login & Register logic
│   └── taskController.js # Handles Task CRUD logic
├── middleware/
│   └── authMiddleware.js # Verifies JWT token for protected routes
├── models/
│   ├── User.js          # User table schema
│   ├── Task.js          # Task table schema
│   └── index.js         # Model relationships & sync setup
├── routes/
│   ├── authRoutes.js    # Auth endpoints
│   └── taskRoutes.js    # Task endpoints
├── .env                 # Environment variables
├── package.json
└── server.js            # Express app entry point
```

## The Full Request-Response Cycle
When a user interacts with your React app (for example, creating a new task), the following sequence takes place behind the scenes:

```
[ React UI ] ──(1) User submits task──> [ taskService.createTask() ]
                                                 │
                                                 ▼ (2) HTTP POST /api/tasks
[ Express API ] <────── Network Network ─────────┘
       │
       ├─► (3) Validates JWT Token via middleware
       ├─► (4) Executes SQL query via Sequelize -> MySQL DB
       │
       └─► (5) Sends HTTP Response (Status 201 + JSON Task Data)
                                                 │
[ React UI ] <────── Network Response ───────────┘
       │
       └─► (6) Updates state with `setTasks()` -> UI automatically updates
```

## Step-by-Step Breakdown:

1. User Action: The user fills out TaskForm.jsx and clicks Create Task.

2. Service Layer Execution: React calls taskService.createTask(), which invokes the browser's built-in fetch() API

3. Network Transport: The browser packages this data into an HTTP request packet and sends it across your computer's network interface to TCP port 5000.

4. Express Routing: Express listens on port 5000, receives the HTTP packet, matches the /api/tasks endpoint route, verifies the JWT token, and writes the record to MySQL via Sequelize.

5. JSON Response: Express formats the database result into JSON and sends back an HTTP Response payload (e.g., status code 201 Created).

6. React State Mutation: The fetch() promise resolves inside React. React takes the returned JSON task object, passes it to setTasks(), and updates the browser DOM.


Here's a formatted version for your `README.md` file:

---

## The Three Crucial "Glue" Elements

### 1. JSON (The Universal Language)

JavaScript objects cannot travel through network wires directly.

- **Frontend** converts JS objects into JSON text strings using `JSON.stringify()`
- **Backend** uses `app.use(express.json())` middleware to parse incoming JSON strings back into JavaScript objects (`req.body`)

```javascript
// Frontend: Sending data
const userData = { name: "John", age: 30 };
fetch('/api/user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userData) // JS object → JSON string
});

// Backend: Receiving data
app.use(express.json()); // Parses JSON string → JS object
app.post('/api/user', (req, res) => {
  console.log(req.body.name); // "John" - now accessible as JS object
});
```

---

### 2. CORS (Cross-Origin Resource Sharing)

By default, web browsers block web pages loaded at one origin (`localhost:3000`) from making API calls to a different origin (`localhost:5000`) for security reasons.

When you added `app.use(cors())` in Express, your backend sent headers back to the browser saying: *"I allow requests originating from other ports."*

**Without CORS:** Browser rejects the response ❌
**With CORS:** Browser accepts the response ✅

```javascript
// Backend: Enable CORS
const cors = require('cors');
app.use(cors()); // Allows cross-origin requests
```

---

### 3. JWT (Stateless Context)

HTTP is **stateless**—port 5000 has no memory of previous requests. Each request is independent.

To prove who is logged in on subsequent calls:

1. React saves the JWT token from `localStorage`
2. React attaches the token to the `Authorization` header on **every** request
3. Express reads this header to identify which user ID owns the incoming data

```javascript
// Frontend: Attaching JWT to requests
const token = localStorage.getItem('token');
fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${token}` // Attach token
  }
});

// Backend: Verifying JWT
app.get('/api/protected', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded.userId); // Identifies the logged-in user
});
```

---

### Summary Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (Port 3000)                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  1. JSON.stringify() → Convert JS object to JSON    │   │
│  │  2. localStorage.getItem('token') → Retrieve JWT    │   │
│  │  3. Attach JWT to Authorization header              │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│                          ▼                                  │
│              [HTTP Request with JSON + JWT]                │
│                          │                                  │
│                          ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  1. CORS middleware → Allows cross-origin requests  │   │
│  │  2. express.json() → Parse JSON to JS object        │   │
│  │  3. JWT verification → Identify user from token     │   │
│  └─────────────────────────────────────────────────────┘   │
│                   BACKEND (Port 5000)                      │
└─────────────────────────────────────────────────────────────┘
```

---

### Key Takeaways

| Element | Problem Solved | Solution |
|---------|---------------|----------|
| **JSON** | JS objects can't travel over network | `JSON.stringify()` & `express.json()` |
| **CORS** | Browser blocks cross-origin requests | `app.use(cors())` middleware |
| **JWT** | HTTP has no memory (stateless) | Token stored & sent with every request |

---