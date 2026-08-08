
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
