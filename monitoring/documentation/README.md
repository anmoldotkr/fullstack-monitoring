At this point you have completed the **application and deployment layer**:

* ✅ React frontend
* ✅ Node.js backend
* ✅ MySQL
* ✅ Frontend ↔ Backend integration
* ✅ Dockerfiles
* ✅ Docker Compose
* ✅ Nginx reverse proxy
* ✅ Application working through Nginx

Now we should start the **actual monitoring/observability layer**.

## Monitoring project roadmap
```
Frontend
   │
Backend
   │
MySQL
   │
Nginx
   │
   ▼
Docker
   │
   ├── Node Exporter ──► Host metrics
   │
   ├── cAdvisor ───────► Container metrics
   │
   └── MySQL Exporter ─► MySQL metrics
              │
              ▼
          Prometheus
              │
              ▼
           Grafana
              │
              ▼
        Dashboards + Alerts
```
## Next: Prometheus

I recommend building the monitoring stack in this order:

```text
                    Nginx
                      │
                ┌─────┴─────┐
                │            │
                ▼            ▼
            Frontend      Backend
                              │
                              ▼
                            MySQL
                              │
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
                Metrics                Logs
                    │                   │
                    ▼                   ▼
                Prometheus            Loki
                    │                   ▲
                    ▼                   │
                 Grafana             Promtail
                    │
                    ▼
               Alertmanager
                    │
                    ▼
                  Slack
```

### Phase 1 — Metrics

Start with:

1. **Prometheus**
2. **Node.js metrics**
3. **Nginx metrics**
4. **MySQL metrics**
5. **cAdvisor**
6. **Node Exporter**

### Phase 2 — Visualization

7. **Grafana**
8. Create application dashboard

### Phase 3 — Logs

9. **Loki**
10. **Promtail**
11. Send Nginx + Node.js + container logs to Loki

### Phase 4 — Alerting

12. **Alertmanager**
13. Slack integration
14. Create alert rules

---

# What should we monitor?

Since this is a monitoring project, don't just install Prometheus and Grafana. We should define what we're actually trying to observe.

## 1. Container monitoring

Using **cAdvisor**:

```text
Frontend container
 ├── CPU
 ├── Memory
 ├── Network
 └── Container status

Backend container
 ├── CPU
 ├── Memory
 ├── Network
 └── Container status

MySQL container
 ├── CPU
 ├── Memory
 ├── Network
 └── Container status

Nginx container
 ├── CPU
 ├── Memory
 └── Network
```

---

## 2. Host monitoring

Using **Node Exporter**:

```text
Docker Host
 ├── CPU utilization
 ├── Memory utilization
 ├── Disk utilization
 ├── Disk I/O
 ├── Network traffic
 └── System load
```

---

## 3. Backend monitoring

For Node.js, we'll add application-level metrics.

For example:

```text
HTTP Requests
 ├── Total requests
 ├── Requests/sec
 ├── 2xx
 ├── 4xx
 └── 5xx

Latency
 ├── Average
 ├── P95
 └── P99

Application
 ├── Active requests
 ├── Event-loop lag
 ├── Heap usage
 └── Process memory
```

This is much more useful than only monitoring CPU and memory.

---

## 4. MySQL monitoring

We'll use **MySQL Exporter**:

```text
MySQL
  │
  ▼
MySQL Exporter
  │
  ▼
Prometheus
  │
  ▼
Grafana
```

Monitor:

```text
Database availability
Connections
Threads
Queries
Slow queries
InnoDB metrics
Buffer pool
Table locks
```

---

## 5. Nginx monitoring

We'll monitor:

```text
Requests
Active connections
4xx
5xx
Request rate
Response latency
```

For example:

```text
                    Nginx
                      │
              ┌───────┴────────┐
              ▼                ▼
          Access logs       Metrics
              │                │
              ▼                ▼
             Loki          Prometheus
```

---

# First implementation: Prometheus

Your project could now look like:

```text
task-management/
│
├── frontend/
├── backend/
├── mysql/
├── nginx/
│
├── monitoring/
│   └── prometheus/
│       └── prometheus.yml
│
└── docker-compose.yml
```

We'll add Prometheus to the existing `docker-compose.yml`.

The first milestone should simply be:

```text
Docker containers
       │
       ▼
   Prometheus
       │
       ▼
Prometheus UI
       │
       ▼
Can query metrics
```

Then we'll add exporters one by one rather than adding everything at once.

### Recommended order from here

**Prometheus → Node Exporter → cAdvisor → MySQL Exporter → Node.js metrics → Nginx metrics → Grafana → Loki/Promtail → Alertmanager/Slack.**


### ----------- cadvisor promql works --------------

# This will print cpu utilization the only container which are running 
rate(
  container_cpu_usage_seconds_total{
    job="cadvisor",
    id=~"/system.slice/docker-.*\\.scope"
  }[5m]
)

# This gives the memory utilization
container_memory_usage_bytes{
  job="cadvisor",
  id=~"/system.slice/docker-.*\\.scope"
}

# This gives all things 
container_memory_working_set_bytes


## ------ MySql_exporter gives Error ----------------

mysqld_exporter needs database access because it is essential, it should must log into
the databse and check mysql health statistics

```
time=2026-08-14T05:49:48.914Z level=ERROR source=exporter.go:154 msg="Error opening connection to database" err="Error 1045 (28000): Access denied for user 'exporter_user'@'172.22.0.8' (using password: YES)"

Reason: There are three reason's
1. wrong password
2. missing mysql_exporter users
3. Ip address Mismatch (MySQL tracks users by both their name and where they are connecting from. Your exporter is coming from the internal Docker IP 172.22.0.8. If the user inside MySQL was created as 'exporter_user'@'localhost', MySQL will block any connection coming from 172.22.0.8)

```

### mysql_exporter configuration for above error

```
mysql/init-exporter.sh

# This script i have created for creation mysql-exporter user.
#!/bin/bash
set -e

# Uses environment variables set in docker-compose or runtime
mysql -u root -p"$MYSQL_ROOT_PASSWORD" <<-EOSQL
    CREATE USER IF NOT EXISTS '${MYSQL_EXPORTER_USER}'@'%' IDENTIFIED BY '${MYSQL_EXPORTER_PASSWORD}';
    GRANT PROCESS, REPLICATION CLIENT, SELECT ON *.* TO '${MYSQL_EXPORTER_USER}'@'%';
    FLUSH PRIVILEGES;
EOSQL
```
## Configuration inside the docker-compose 

```
This is mounting this script inside the container 
/docker-entrypoint-initdb.d/init-exporter.sh (Container Path)
The destination path inside the MySQL container.

Why this specific folder? Official MySQL and MariaDB Docker images are programmed to look inside /docker-entrypoint-initdb.d/ when starting up for the very first time. Any .sql, .sh, or .sql.gz file placed here will automatically execute before the database opens for external connections.

volumes:
  - ./init-exporter.sh:/docker-entrypoint-initdb.d/init-exporter.sh:ro
```

## When Bash executes init-exporter.sh inside the MySQL container, it looks for environment variables inside that specific container's process environment.
```

If you do not pass them to the mysql service in docker-compose.yml:

${MYSQL_EXPORTER_USER} evaluates to an empty string ("").

${MYSQL_EXPORTER_PASSWORD} evaluates to an empty string ("").

```

## Flow Dairgram

```
[ .env File on Host ]
  MYSQL_EXPORTER_USER=exporter_user
  MYSQL_EXPORTER_PASSWORD=secret_pass
           │
           ▼
[ docker-compose.yml ]
  mysql:
    environment:
      MYSQL_EXPORTER_USER: ${MYSQL_EXPORTER_USER}        <-- Reads from host .env
      MYSQL_EXPORTER_PASSWORD: ${MYSQL_EXPORTER_PASSWORD}  <-- Injects into MySQL container
           │
           ▼
[ MySQL Container Environment ]
  (Variables are now available to Bash scripts running inside)
           │
           ▼
[ init-exporter.sh ]
  Executes with actual values: 'exporter_user' and 'secret_pass'

```