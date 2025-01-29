
# Task Manager API

A **Task Manager** built with **Node.js**, **Express**, **MongoDB**, and **JWT** for authentication, providing a comprehensive set of functionalities including user registration & login, task CRUD operations, filtering, searching, reminders, CSV export, productivity reports, and more.

## Table of Contents

- [Task Manager API](#task-manager-api)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
  - [Project Structure](#project-structure)
  - [API Documentation (Swagger)](#api-documentation-swagger)
  - [Usage](#usage)
    - [1. Register a new user](#1-register-a-new-user)
    - [2. Login](#2-login)
    - [3. Create a Task](#3-create-a-task)
    - [4. List Tasks with Filters](#4-list-tasks-with-filters)
    - [5. Mark Task as Completed](#5-mark-task-as-completed)
    - [6. Export Tasks as CSV](#6-export-tasks-as-csv)
    - [7. Productivity Report](#7-productivity-report)
  - [Testing](#testing)
  - [Deployment](#deployment)
  - [License](#license)

----------

## Features

-   **User Registration and Authentication**  
    Register new users and login via JWT tokens (Bearer Authentication).
-   **CRUD for Tasks**  
    Create, read, update, and delete tasks with mandatory fields like title, description, priority, and due date.
-   **Mark Task as Completed**  
    Easily change a task status to `concluida` (completed).
-   **Filtering and Searching**
    -   Filter tasks by status (`pendente` or `concluida`).
    -   Filter by priority (`baixa`, `media`, `alta`).
    -   Search tasks by keywords in title or description.
-   **Sorting**  
    Sort tasks by due date or priority.
-   **Reminders**  
    Scheduled reminders (via **node-cron**) to send emails when tasks are about to expire within 24 hours.
-   **CSV Export**  
    Export all tasks for a user in CSV format.
-   **Productivity Report**  
    Generate a simple report of how many tasks have been completed within a specified date range.
-   **Swagger Documentation**  
    Interactive API documentation via Swagger UI.
-   **CORS Support**  
    Configurable to allow cross-origin requests.
-   **Secure**  
    Uses **JWT** to protect task routes, and **bcrypt** for password hashing.

----------

## Tech Stack

-   **Node.js** (Express, JavaScript)
-   **MongoDB** (Mongoose) hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
-   **Nodemailer** (Mailtrap example for email reminders)
-   **node-cron** (Scheduling reminders)
-   **JWT** (Authentication)
-   **bcrypt** (Password hashing)
-   **Swagger** (API documentation)
-   **cors** (Cross-origin resource sharing)
-   **dotenv** (Environment variables)
-   **Winston** or similar (for logging, optional)
-   **Jest** + **Supertest** (for automated tests, optional)

----------

## Prerequisites

1.  **Node.js** (preferably LTS version 16+ or 18+).
2.  **npm** or **yarn**.
3.  **MongoDB Atlas** account (or another MongoDB instance).
4.  A **Mailtrap** account (or another SMTP service) if you want to test email reminders.

----------

## Installation

1.  **Clone** this repository:
    
    bash
    
    CopiarEditar
    
    `git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git` 
    
2.  **Enter** the project folder:
    
    bash
    
    CopiarEditar
    
    `cd YOUR-REPO` 
    
3.  **Install dependencies**:
    
    bash
    
    CopiarEditar
    
    `npm install` 
    
    or
    
    bash
    
    CopiarEditar
    
    `yarn install` 
    

----------

## Environment Variables

Create a file named `.env` in the project root. For example:

makefile

CopiarEditar

`PORT=3000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/<DBName>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
MAIL_USER=your_mailtrap_user
MAIL_PASS=your_mailtrap_password` 

> **Note**: Do not commit `.env` to your repository if it contains sensitive credentials.

Common variables:

-   **PORT**: Port on which your Node.js server will run.
-   **MONGO_URI**: Connection string to MongoDB (Atlas or local).
-   **JWT_SECRET**: Secret key for signing JWT tokens.
-   **MAIL_USER**/**MAIL_PASS**: For email sending (SMTP).

----------

## Running Locally

1.  **Start** the server in development:
    
    bash
    
    CopiarEditar
    
    `npm start` 
    
    or
    
    bash
    
    CopiarEditar
    
    `node server.js` 
    
2.  By default, the server will run on:
    
    arduino
    
    CopiarEditar
    
    `http://localhost:3000` 
    
3.  Access the **Swagger Documentation** at:
    
    bash
    
    CopiarEditar
    
    `http://localhost:3000/api-docs` 
    
4.  A **welcome route** (if implemented) is available at:
    
    arduino
    
    CopiarEditar
    
    `http://localhost:3000/` 
    

----------

## Project Structure

Below is a sample structure. Some files may differ depending on your setup:

bash

CopiarEditar

`gerenciador-de-tarefas/
├── server.js               # Entry point: starts the server
├── package.json
├── .env                    # Environment variables (gitignored)
├── src
│   ├── app.js              # Express app configuration
│   ├── config
│   │   ├── db.js           # Database connection (Mongoose)
│   │   ├── mailer.js       # Nodemailer configuration
│   │   └── logger.js       # Winston or other logging config (optional)
│   ├── controllers
│   │   ├── userController.js
│   │   └── taskController.js
│   ├── middlewares
│   │   └── auth.js         # JWT authentication middleware
│   ├── models
│   │   ├── User.js         # User schema
│   │   └── Task.js         # Task schema
│   ├── routes
│   │   ├── userRoutes.js
│   │   └── taskRoutes.js
│   ├── services
│   │   └── reminderService.js   # Cron jobs for reminders
│   └── swagger.js          # Swagger configuration
└── README.md` 

----------

## API Documentation (Swagger)

1.  Access the API docs at:
    
    bash
    
    CopiarEditar
    
    `http://localhost:3000/api-docs` 
    
2.  **Authorize** with Bearer token (JWT) in the **Authorize** button on Swagger UI to access protected routes.
3.  Explore all endpoints:
    -   **User routes**: `/usuarios/register`, `/usuarios/login`
    -   **Task routes**: `/tarefas` (protected with JWT)

----------

## Usage

### 1. Register a new user

-   **Endpoint**: `POST /usuarios/register`
-   **Body**:
    
    json
    
    CopiarEditar
    
    `{
      "nome": "John Doe",
      "email": "john.doe@example.com",
      "senha": "secret123"
    }` 
    

### 2. Login

-   **Endpoint**: `POST /usuarios/login`
-   **Body**:
    
    json
    
    CopiarEditar
    
    `{
      "email": "john.doe@example.com",
      "senha": "secret123"
    }` 
    
-   **Response**:
    
    json
    
    CopiarEditar
    
    `{
      "message": "Login bem-sucedido",
      "token": "Bearer token_here"
    }` 
    

### 3. Create a Task

-   **Endpoint**: `POST /tarefas`
-   **Headers**: `Authorization: Bearer <token>`
-   **Body**:
    
    json
    
    CopiarEditar
    
    `{
      "titulo": "My New Task",
      "descricao": "Description here",
      "prioridade": "alta",
      "dataVencimento": "2025-02-01"
    }` 
    

### 4. List Tasks with Filters

-   **Endpoint**: `GET /tarefas?status=pendente&prioridade=alta&search=keyword&ordenar=dataVencimento`
-   **Headers**: `Authorization: Bearer <token>`

### 5. Mark Task as Completed

-   **Endpoint**: `PATCH /tarefas/{id}/concluir`
-   **Headers**: `Authorization: Bearer <token>`

### 6. Export Tasks as CSV

-   **Endpoint**: `GET /tarefas/export/csv`
-   **Headers**: `Authorization: Bearer <token>`

### 7. Productivity Report

-   **Endpoint**: `GET /tarefas/relatorio/produtividade?dataInicio=2025-01-01&dataFim=2025-02-01`
-   **Headers**: `Authorization: Bearer <token>`

----------

## Testing

If you have **Jest + Supertest** configured, you can run:

bash

CopiarEditar

`npm test` 

Typical tests might include:

-   **User tests**: registering, logging in, invalid credentials, etc.
-   **Task tests**: creating tasks, listing tasks, updating tasks, etc.

----------

## Deployment

1.  **MongoDB Atlas**
    -   Make sure you have a **MongoDB Atlas** database created.
2.  **Render** (or any PaaS)
    -   Point your GitHub repository to Render.
    -   Set environment variables (`MONGO_URI`, `JWT_SECRET`, `MAIL_USER`, `MAIL_PASS`) in Render’s dashboard.
    -   Define your **Build Command** (e.g., `npm install`) and **Start Command** (`node server.js` or `npm start`).
3.  **Custom Domain** (Optional)
    -   You can add a custom domain on Render and enable HTTPS automatically.

----------

## License

This project is licensed under the **MIT License** (or another license of your choice). See the [LICENSE](LICENSE) file for details.

----------

**Enjoy using the Task Manager API!** If you have any questions, feel free to open an issue or reach out. Contributions and suggestions are always welcome.