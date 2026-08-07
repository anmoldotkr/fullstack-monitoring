

# Full-Stack Application with Monitoring & Observability

A production-style full-stack application running completely on Docker containers with a centralized **monitoring, logging, and alerting stack**.

The project consists of a React frontend, Node.js backend, MySQL database, Nginx reverse proxy, Prometheus for metrics collection, Grafana for visualization, Loki for centralized logging, and Alertmanager for notifications.

---

## Architecture

```text
                                      ┌─────────────────────┐
                                      │       User          │
                                      │     Browser         │
                                      └──────────┬──────────┘
                                                 │
                                                 │ HTTP/HTTPS
                                                 ▼
                                      ┌─────────────────────┐
                                      │        Nginx        │
                                      │   Reverse Proxy     │
                                      └──────────┬──────────┘
                                                 │
                              ┌──────────────────┴──────────────────┐
                              │                                     │
                              ▼                                     ▼
                   ┌───────────────────┐                 ┌───────────────────┐
                   │     Frontend      │                 │      Backend      │
                   │      React        │                 │    Node.js API    │
                   │    Container      │                 │     Container     │
                   └───────────────────┘                 └─────────┬─────────┘
                                                                   │
                                                                   │ MySQL
                                                                   ▼
                                                        ┌────────────────────┐
                                                        │       MySQL        │
                                                        │     Database       │
                                                        │     Container      │
                                                        └────────────────────┘


                    ┌─────────────────────────────────────────────────────┐
                    │                  MONITORING STACK                   │
                    │                                                     │
                    │  ┌───────────────┐       ┌──────────────────────┐   │
                    │  │ Node Exporter │──────▶│                      │   │
                    │  └───────────────┘       │                      │   │
                    │                          │     Prometheus       │   │
                    │  ┌───────────────┐       │   Metrics Storage    │   │
                    │  │    cAdvisor   │──────▶│                      │   │
                    │  └───────────────┘       │                      │   │
                    │                          └──────────┬───────────┘   │
                    │  ┌────────────────┐                 │               │
                    │  │ MySQL Exporter │────────────────┘                │
                    │  └────────────────┘                                 │
                    │                                                     │
                    │  ┌────────────────┐                                 │
                    │  │ Backend /metrics│───────────────────────────────┘
                    │  └────────────────┘                                 │
                    │                                                     │
                    │                    ┌──────────────────┐             │
                    │                    │     Grafana      │             │
                    │                    │    Dashboards    │             │
                    │                    └──────────────────┘             │
                    └─────────────────────────────────────────────────────┘


                    ┌─────────────────────────────────────────────────────┐
                    │                    LOGGING STACK                    │
                    │                                                     │
                    │ Containers ──────▶ Promtail ──────▶ Loki            │
                    │                                         │           │
                    │                                         ▼           │
                    │                                      Grafana        │
                    └─────────────────────────────────────────────────────┘


                    ┌─────────────────────────────────────────────────────┐
                    │                    ALERTING                         │
                    │                                                     │
                    │ Prometheus ──────▶ Alertmanager ──────▶ Slack       │
                    │                                      └──▶ Email     │
                    └─────────────────────────────────────────────────────┘
```

---

# Architecture Overview

The application is divided into three major layers:

### Application Layer

* React frontend
* Node.js backend
* MySQL database
* Nginx reverse proxy

### Monitoring Layer

* Prometheus
* Grafana
* Node Exporter
* cAdvisor
* MySQL Exporter

### Logging & Alerting Layer

* Loki
* Promtail
* Alertmanager

---

# Technology Stack

| Component               | Technology        |
| ----------------------- | ----------------- |
| Frontend                | React             |
| Backend                 | Node.js / Express |
| Database                | MySQL 8           |
| Reverse Proxy           | Nginx             |
| Containerization        | Docker            |
| Container Orchestration | Docker Compose    |
| Metrics Collection      | Prometheus        |
| Visualization           | Grafana           |
| Host Monitoring         | Node Exporter     |
| Container Monitoring    | cAdvisor          |
| MySQL Monitoring        | mysqld_exporter   |
| Log Collection          | Promtail          |
| Log Storage             | Loki              |
| Alerting                | Alertmanager      |
| Notification            | Slack / Email     |

---

# Project Structure

```text
monitoring-project/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── Dockerfile
│   └── package.json
│
├── mysql/
│   └── init/
│       └── init.sql
│
├── nginx/
│   └── nginx.conf
│
├── monitoring/
│   │
│   ├── prometheus/
│   │   ├── prometheus.yml
│   │   └── rules/
│   │       └── alerts.yml
│   │
│   ├── grafana/
│   │   ├── dashboards/
│   │   └── provisioning/
│   │
│   ├── alertmanager/
│   │   └── alertmanager.yml
│   │
│   └── exporters/
│       ├── node-exporter/
│       ├── cadvisor/
│       └── mysql-exporter/
│
├── logging/
│   ├── loki/
│   │   └── loki-config.yml
│   │
│   └── promtail/
│       └── promtail-config.yml
│
├── docker-compose.yml
│
├── .env.example
├── .gitignore
└── README.md
```

---

# Application Flow

The request flow is:

```text
User
  │
  ▼
Nginx
  │
  ├───────────────▶ React Frontend
  │
  └───────────────▶ Node.js Backend
                          │
                          ▼
                       MySQL
```

### Example API Request

```text
Browser
   │
   │ GET /api/users
   ▼
Nginx
   │
   │ Proxy
   ▼
Node.js Backend
   │
   │ SQL Query
   ▼
MySQL
   │
   │ Result
   ▼
Node.js
   │
   ▼
Nginx
   │
   ▼
Browser
```

---

# Monitoring Architecture

Prometheus is responsible for collecting metrics from different exporters and application endpoints.

```text
                    ┌─────────────────────┐
                    │      Prometheus     │
                    │                     │
                    │  Metrics Database   │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
      Node Exporter       cAdvisor       MySQL Exporter
             │                 │                 │
             ▼                 ▼                 ▼
           Host             Docker            MySQL
          Metrics           Metrics           Metrics


                       Backend
                          │
                          │ /metrics
                          ▼
                     Prometheus
```

---

# What Will Be Monitored?

## Host Monitoring

Node Exporter will collect system-level metrics.

Metrics include:

* CPU utilization
* Memory utilization
* Disk utilization
* Disk I/O
* Network traffic
* System load
* System uptime
* Filesystem usage

---

# Container Monitoring

cAdvisor will collect Docker container metrics.

Metrics include:

* Container CPU usage
* Container memory usage
* Container network traffic
* Container disk I/O
* Container restarts
* Container resource consumption
* Container health

Example:

```text
Container
   │
   ├── CPU
   ├── Memory
   ├── Network
   ├── Disk
   └── Restart Count
```

---

# Backend Monitoring

The Node.js backend will expose a Prometheus-compatible `/metrics` endpoint.

Example:

```text
GET /metrics
```

The application will expose metrics such as:

* Total HTTP requests
* Requests per second
* HTTP response status
* API latency
* Error count
* Active requests
* Request duration
* Endpoint-level request count

Example metrics:

```text
http_requests_total
http_request_duration_seconds
http_requests_in_progress
```

---

# MySQL Monitoring

MySQL will be monitored using `mysqld_exporter`.

The exporter connects to MySQL and exposes MySQL metrics to Prometheus.

Metrics include:

* Active connections
* Total queries
* Queries per second
* Slow queries
* Threads connected
* Threads running
* InnoDB buffer pool
* Table locks
* Temporary tables
* Open files
* MySQL uptime

---

# Logging Architecture

Application and container logs will be centralized using **Promtail and Loki**.

```text
┌──────────────┐
│   Frontend   │
└──────┬───────┘
       │
┌──────▼───────┐
│   Backend    │
└──────┬───────┘
       │
┌──────▼───────┐
│    Nginx     │
└──────┬───────┘
       │
┌──────▼───────┐
│    MySQL     │
└──────┬───────┘
       │
       ▼
   Promtail
       │
       ▼
     Loki
       │
       ▼
    Grafana
```

---

# Log Types

The logging stack will collect:

### Nginx

* Access logs
* Error logs

### Backend

* Application logs
* API request logs
* Error logs
* Database errors

### MySQL

* Error logs
* General logs (if enabled)
* Slow query logs

### Docker

* Container logs
* Container lifecycle events

---

# Grafana

Grafana will be used as the central visualization platform.

The following dashboards will be created.

## 1. Infrastructure Dashboard

Panels:

* CPU Usage
* Memory Usage
* Disk Usage
* Network Traffic
* System Load
* Host Uptime

---

## 2. Docker Dashboard

Panels:

* Running Containers
* Container CPU
* Container Memory
* Container Network
* Container Disk I/O
* Container Restarts

---

## 3. Backend Dashboard

Panels:

* Requests/sec
* Total Requests
* HTTP 2xx
* HTTP 4xx
* HTTP 5xx
* Average Response Time
* P95 Latency
* P99 Latency
* Error Rate
* Top APIs

---

## 4. MySQL Dashboard

Panels:

* Active Connections
* Queries/sec
* Slow Queries
* Threads Connected
* Threads Running
* InnoDB Buffer Pool
* Table Locks
* Temporary Tables
* MySQL Uptime

---

## 5. Logs Dashboard

Grafana will also provide centralized log visualization using Loki.

Users will be able to:

* Search logs
* Filter by container
* Filter by log level
* Search error messages
* View backend errors
* View Nginx errors
* Correlate logs with timestamps

---

# Alerting

Prometheus will evaluate alert rules and send alerts to Alertmanager.

```text
Prometheus
     │
     │ Alert Rule
     ▼
Alertmanager
     │
     ├──────────▶ Slack
     │
     └──────────▶ Email
```

---

# Alert Rules

## Infrastructure Alerts

### High CPU

```text
CPU > 80% for 5 minutes
```

### High Memory

```text
Memory > 85% for 5 minutes
```

### High Disk Usage

```text
Disk > 90%
```

---

## Container Alerts

### Container Down

Trigger when an expected container is unavailable.

### Container Restart

Trigger when a container unexpectedly restarts.

### High Container CPU

```text
Container CPU > 80%
```

### High Container Memory

```text
Container Memory > 85%
```

---

## Backend Alerts

### Backend Down

Trigger when the backend becomes unavailable.

### High Error Rate

```text
HTTP 5xx > 5%
```

### High API Latency

```text
API latency > 1 second
```

---

## MySQL Alerts

### MySQL Down

Trigger when MySQL becomes unavailable.

### High Connections

Trigger when database connections exceed the configured threshold.

### Slow Queries

Trigger when slow query rate exceeds the configured threshold.

---

# Alert Severity

Alerts can be classified into:

```text
CRITICAL
WARNING
INFO
```

Example:

```text
CRITICAL
Backend service is DOWN

WARNING
Backend API error rate is above 5%

WARNING
Host CPU utilization is above 80%
```

---

# Docker Compose

The complete application and monitoring stack will be managed using Docker Compose.

Example services:

```yaml
services:

  frontend:
    ...

  backend:
    ...

  mysql:
    ...

  nginx:
    ...

  prometheus:
    ...

  grafana:
    ...

  alertmanager:
    ...

  loki:
    ...

  promtail:
    ...

  node-exporter:
    ...

  cadvisor:
    ...

  mysql-exporter:
    ...
```

---

# Docker Networks

The project can use separate Docker networks.

### Application Network

```text
frontend
backend
mysql
nginx
```

### Monitoring Network

```text
prometheus
grafana
alertmanager
node-exporter
cadvisor
mysql-exporter
```

### Logging Network

```text
promtail
loki
grafana
```

This provides logical separation between application traffic and monitoring traffic.

---

# Persistent Storage

Persistent Docker volumes will be used for stateful services.

```text
mysql-data
     │
     ▼
   MySQL

prometheus-data
     │
     ▼
 Prometheus

grafana-data
     │
     ▼
  Grafana

loki-data
     │
     ▼
    Loki
```

This ensures that restarting a container does not automatically remove stored data.

---

# Environment Variables

Sensitive configuration should not be hardcoded.

Example `.env`:

```env
MYSQL_DATABASE=application
MYSQL_USER=appuser
MYSQL_PASSWORD=********
MYSQL_ROOT_PASSWORD=********

BACKEND_PORT=3000
FRONTEND_PORT=80

GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=********
```

A `.env.example` file should be committed to Git instead of the actual `.env`.

---

# Application Health Checks

Each important service should expose a health check.

### Backend

```text
GET /health
```

Expected response:

```json
{
  "status": "healthy"
}
```

### MySQL

Docker health check can verify that MySQL is accepting connections.

### Frontend

Nginx can provide:

```text
GET /health
```

---

# Service Dependencies

The startup dependency flow is:

```text
MySQL
  │
  ▼
Backend
  │
  ▼
Nginx
  │
  ▼
Frontend
```

Monitoring services can start independently:

```text
Prometheus
   │
   ├── Node Exporter
   ├── cAdvisor
   ├── MySQL Exporter
   └── Backend /metrics

Grafana
   │
   ├── Prometheus
   └── Loki

Alertmanager
   │
   └── Slack / Email
```

---

# How to Run the Project

## Prerequisites

Install:

* Docker
* Docker Compose
* Git

Verify:

```bash
docker --version
```

```bash
docker compose version
```

---

## Clone Repository

```bash
git clone <repository-url>
```

```bash
cd monitoring-project
```

---

## Configure Environment

```bash
cp .env.example .env
```

Update the required values:

```env
MYSQL_DATABASE=application
MYSQL_USER=appuser
MYSQL_PASSWORD=your-password
MYSQL_ROOT_PASSWORD=your-root-password
```

---

# Start the Application

```bash
docker compose up -d
```

Check running containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f
```

---

# Stop the Application

```bash
docker compose down
```

To remove volumes as well:

```bash
docker compose down -v
```

> Be careful with `-v` because it removes persistent volumes, including MySQL data.

---

# Access Services

After starting the stack:

| Service         | URL                        |
| --------------- | -------------------------- |
| Application     | `http://localhost`         |
| Backend         | `http://localhost/api`     |
| Backend Health  | `http://localhost/health`  |
| Backend Metrics | `http://localhost/metrics` |
| Prometheus      | `http://localhost:9090`    |
| Grafana         | `http://localhost:3000`    |
| Alertmanager    | `http://localhost:9093`    |

The exact ports can be changed in `docker-compose.yml`.

---

# Prometheus Targets

Prometheus will scrape metrics from:

```text
Prometheus
    │
    ├── Backend
    │     └── /metrics
    │
    ├── Node Exporter
    │
    ├── cAdvisor
    │
    └── MySQL Exporter
```

Prometheus target status can be checked from:

```text
http://localhost:9090/targets
```

All expected targets should show:

```text
UP
```

---

# Monitoring Validation

The project should include failure testing to verify that monitoring and alerting actually work.

## Test 1 – Stop Backend

```bash
docker compose stop backend
```

Expected:

```text
Backend becomes unavailable
        ↓
Prometheus detects failure
        ↓
Alertmanager receives alert
        ↓
Slack notification
```

---

## Test 2 – High CPU

Generate CPU load on the host/container and verify:

```text
Node Exporter
      ↓
Prometheus
      ↓
Grafana
      ↓
CPU Alert
      ↓
Alertmanager
```

---

## Test 3 – Stop MySQL

```bash
docker compose stop mysql
```

Expected:

```text
Backend DB connection failure
        ↓
MySQL exporter unavailable
        ↓
Prometheus alert
        ↓
Alertmanager
        ↓
Slack
```

---

## Test 4 – Generate API Errors

Call an invalid endpoint repeatedly:

```bash
curl http://localhost/api/invalid
```

Expected:

```text
HTTP 404
   ↓
Backend metrics
   ↓
Prometheus
   ↓
Grafana
```

---

# Observability Model

This project follows the three major pillars of observability:

```text
              Observability
                   │
       ┌───────────┼───────────┐
       │           │           │
       ▼           ▼           ▼
     Metrics      Logs       Traces
       │           │           │
 Prometheus       Loki     OpenTelemetry
       │           │           │
       └───────────┼───────────┘
                   │
                Grafana
```

The initial implementation focuses on:

* **Metrics**
* **Logs**
* **Alerting**

Distributed tracing using OpenTelemetry can be added as a future enhancement.

---

# Future Enhancements

The project can be extended with:

* OpenTelemetry
* Jaeger distributed tracing
* HTTPS
* TLS certificates
* CI/CD using Jenkins or GitHub Actions
* Docker image scanning
* Trivy security scanning
* Terraform infrastructure
* Kubernetes deployment
* Kubernetes monitoring
* Helm charts
* Horizontal Pod Autoscaling
* Secrets management
* AWS deployment
* CloudWatch integration
* S3 log archival
* Remote Prometheus storage

---

# Learning Objectives

This project is designed to provide practical experience with:

### Docker

* Dockerfiles
* Docker Compose
* Networks
* Volumes
* Container health checks
* Resource limits

### Monitoring

* Prometheus
* Grafana
* Exporters
* PromQL
* Metrics collection
* Dashboard creation

### Logging

* Loki
* Promtail
* Centralized logging
* Log querying

### Alerting

* Prometheus alert rules
* Alertmanager
* Slack notifications
* Incident detection

### Application Observability

* API metrics
* Error rate
* Latency
* Database metrics
* Container metrics
* Infrastructure metrics

---

# Final Architecture

```text
                                USERS
                                  │
                                  ▼
                         ┌─────────────────┐
                         │      NGINX      │
                         │ Reverse Proxy   │
                         └────────┬────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
             ┌─────────────┐             ┌─────────────┐
             │   REACT     │             │   NODE.JS   │
             │  FRONTEND   │             │   BACKEND   │
             └─────────────┘             └──────┬──────┘
                                                │
                                                │ SQL
                                                ▼
                                         ┌─────────────┐
                                         │    MYSQL    │
                                         │  DATABASE   │
                                         └─────────────┘


                    ╔══════════════════════════════════╗
                    ║         MONITORING               ║
                    ║                                  ║
                    ║  Node Exporter ─────┐            ║
                    ║                     │            ║
                    ║  cAdvisor ─────────┼──▶          ║
                    ║                     │  PROMETHEUS║
                    ║  MySQL Exporter ────┤            ║
                    ║                     │            ║
                    ║  Backend /metrics ──┘            ║
                    ║                         │        ║
                    ║                         ▼        ║
                    ║                      GRAFANA     ║
                    ╚══════════════════════════════════╝


                    ╔══════════════════════════════════╗
                    ║           LOGGING                ║
                    ║                                  ║
                    ║ Containers                       ║
                    ║      │                           ║
                    ║      ▼                           ║
                    ║   PROMTAIL                       ║
                    ║      │                           ║
                    ║      ▼                           ║
                    ║     LOKI                         ║
                    ║      │                           ║
                    ║      ▼                           ║
                    ║   GRAFANA                        ║
                    ╚══════════════════════════════════╝


                    ╔══════════════════════════════════╗
                    ║           ALERTING               ║
                    ║                                  ║
                    ║  PROMETHEUS                      ║
                    ║       │                          ║
                    ║       ▼                          ║
                    ║  ALERTMANAGER                    ║
                    ║       │                          ║
                    ║    ┌──┴──────┐                   ║
                    ║    ▼         ▼                   ║
                    ║  SLACK      EMAIL                ║
                    ╚══════════════════════════════════╝
```

## Project Goal

The goal of this project is to build a **production-like containerized application with complete monitoring, centralized logging, and automated alerting**, demonstrating how an application can be monitored from the **user request → frontend → backend → database → infrastructure** level.

