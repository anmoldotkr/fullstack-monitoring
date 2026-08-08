
# ⚡ TaskFlow - React Task Management App (Frontend)

TaskFlow is a responsive, component-driven task management application built with **React**, **JavaScript**, and **custom CSS**. This repository contains the complete frontend UI implementation along with route protection and backend integration readiness.

---

## 📌 Project Scope

-  **User Authentication UI**: Registration and Login pages with interactive state controls.
-  **Protected Navigation**: Route protection directing unauthenticated traffic to `/login`.
- **Dashboard Overview**: Summary statistics tracking total, in-progress, and completed tasks.
- **Task Management (CRUD)**:
  - Add new tasks with title, description, priority, and deadline.
  - View task lists organized in a responsive grid layout.
  - Dynamically change task status (`Pending`, `In Progress`, `Completed`).
  - Delete tasks from state.
  - Edit task functionality readiness.
- **Custom Styling**: Pure CSS with responsive layouts (Flexbox & Grid).
- **API Service Layer**: Prepared architecture for easy backend connection (Express/Node.js or AWS API Gateway).


```markdown
## 🏗️ Component Architecture

src/
├── App.jsx                       # React Router v6 & Auth State Management
├── index.js                      # React DOM Entry Point
│
├── pages/
│   ├── Register.jsx              # User Registration Page
│   ├── Register.css
│   ├── Login.jsx                 # User Login Page
│   ├── Login.css
│   ├── Dashboard.jsx             # Main App Shell & State Container
│   └── Dashboard.css
│
└── components/
    ├── Navbar.jsx                # Header Branding, Profile Avatar & Logout
    ├── Navbar.css
    ├── TaskForm.jsx              # Create Task Input Form
    ├── TaskForm.css
    ├── TaskCard.jsx              # Task Details & Action Card
    ├── TaskCard.css
    ├── StatusBadge.jsx           # Dynamic Task Status Visual Indicator
    └── StatusBadge.css

```

---

## ✨ Component Breakdown

### 1. Authentication

* **`Register.jsx` / `Register.css**`: Form featuring Full Name, Email, Password, Confirm Password, Show/Hide Password toggle, Terms & Conditions consent, and Google OAuth UI trigger.
* **`Login.jsx` / `Login.css**`: Form featuring Email, Password, Show/Hide Password toggle, "Remember me" selection, and redirect link to Registration.

### 2. Router & Security

* **`App.jsx`**: Controls application routes with `react-router-dom` v6. Restricts access to `/dashboard` via state-based auth logic (`isAuthenticated`) and handles dynamic fallback redirects.

### 3. Dashboard System

* **`Dashboard.jsx`**: Serves as the primary data orchestrator. Displays live metric cards (Total, In Progress, Completed) and manages top-level task arrays.
* **`Navbar.jsx`**: Sticky header containing application branding, user information, avatar display, and session termination trigger.
* **`TaskForm.jsx`**: Responsive form for task payload generation with title, detailed notes, priority (`Low`, `Medium`, `High`), and target due date.
* **`TaskCard.jsx`**: Modular container displaying task information, due dates, state mutation selectors, and deletion logic.
* **`StatusBadge.jsx`**: Utility component delivering dynamic color-coded visual feedback based on status string values.

---

## 🛠️ Tech Stack

* **Library**: React 18+ (JavaScript ES6+)
* **Routing**: React Router v6
* **Styling**: Standard Modular CSS3 (Flexbox & CSS Grid)
* **Icons**: Inline SVG

---

## 🔌 API Service Layer (Backend Ready)

The application state structures are normalized to consume standard JSON APIs.

#### Expected Task Data Structure:

```json
{
  "id": "1691438789000",
  "title": "Configure AWS VPC Peering",
  "description": "Set up cross-account routing tables and auto-approve rules.",
  "priority": "High",
  "dueDate": "2026-08-15",
  "status": "In Progress"
}

```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have **Node.js** and **npm** installed on your machine.

### Installation

1. **Clone the repository**
```bash
git clone [https://github.com/your-username/taskflow-frontend.git](https://github.com/your-username/taskflow-frontend.git)
cd taskflow-frontend

```


2. **Install dependencies**
```bash
npm install react-router-dom

```


3. **Start the development server**
```bash
npm start

```


4. **Access the application**
Open your browser and navigate to `http://localhost:3000`.
