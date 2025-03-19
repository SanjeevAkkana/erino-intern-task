# Mini Expense Tracker Documentation

## Overview

The **Mini Expense Tracker** is a full-stack application that allows users to manage their expenses, track spending insights, and authenticate securely. The frontend is developed with **ReactJS (Vite)**, and the backend is powered by **Node.js, Express, and MongoDB**.

## Features

### 1️⃣ Authentication (JWT + HTTP-only Cookies)

- Users can register with their **first name, last name, email, and password**.
- Secure login using **JWT authentication** stored in HTTP-only cookies.
- Logout functionality to invalidate the session.
- Handles **token expiration gracefully** with refresh tokens.

### 2️⃣ Expense Management (CRUD)

- Users can **add, update, delete, and view** expenses.
- Each expense consists of:
  - **Amount** (numeric, required)
  - **Category** (e.g., Food, Travel, etc.)
  - **Date** (required)
  - **Description** (optional)
- **Pagination:**
  - Expenses are paginated for performance.

### 3️⃣ Frontend (ReactJS + Vite + TailwindCSS)

- **Login/Register Page**: Secure authentication using JWT.
- **Dashboard Page**:
  - Lists expenses with **pagination**.
- **Expense Form**: Users can add or edit expenses.
- **Delete Expense**: Users can remove expenses.
- **Fully responsive** for both mobile & desktop.

## Tech Stack

### 🔹 Frontend

- **ReactJS (Vite)**
- **TailwindCSS** (for styling)
- **React Router** (for navigation)
- **Recharts** (for data visualization)

### 🔹 Backend

- **Node.js + Express**
- **MongoDB (Mongoose ORM)**
- **JWT Authentication (HTTP-only cookies)**

## API Endpoints

### 🔐 Authentication

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| POST   | /api/auth/register | Register a new user |
| POST   | /api/auth/login    | Login & get JWT     |
| POST   | /api/auth/logout   | Logout & clear JWT  |

### 💰 Expense Management

| Method | Endpoint           | Description                  |
| ------ | ------------------ | ---------------------------- |
| POST   | /api/expenses      | Add a new expense            |
| GET    | /api/expenses      | Get all expenses (paginated) |
| PUT    | /api/expenses/:id  | Update an expense            |
| DELETE | /api/expenses/:id  | Delete an expense            |

## Installation & Setup

### 🛠 Backend Setup

```bash
cd backend
npm install
npm start
```

### 🛠 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 🔐 Environment Variables (.env)

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=7d
PORT=5000
```

🚀 **Live Demo:** [https://erino-intern-task-25p6.vercel.app]

