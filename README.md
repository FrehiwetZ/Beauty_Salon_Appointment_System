# Beauty Salon Appointment System - Full Stack Application

Welcome to the full-stack Beauty Salon Appointment System! This project consists of a React frontend and a Node.js/Express/Prisma backend, connected to a Neon PostgreSQL database.

## System Architecture

The application is divided into two main parts:

### 1. Backend (`/backend`)
- **Framework:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (Neon) via Prisma ORM
- **Features:** 
  - JWT Authentication (USER, STAFF, ADMIN roles)
  - Appointment scheduling with strict double-booking prevention and working hours validation
  - Staff management, service catalogs, reviews, and news posting.
  - Complete REST API.

### 2. Frontend (`/frontend`)
- **Framework:** React 19, Vite, TypeScript, TailwindCSS v4
- **Features:**
  - Role-based routing and context (Admin dashboards vs User dashboards)
  - Dynamic API integration via Axios with request interceptors for JWT.
  - Fully responsive appointment booking flow.

---

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

---

## How to Run the System Locally

### Step 1: Start the Backend Server

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Ensure dependencies are installed:
   ```bash
   npm install
   ```
3. Make sure your `.env` file exists and has the correct `DATABASE_URL` (Neon) and `JWT_SECRET`.
4. Start the development server:
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:5000`*

### Step 2: Start the Frontend Application

1. Open a **new, separate terminal** and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies (including `axios` which handles the API calls):
   ```bash
   npm install
   ```
3. Create a `.env` file in the frontend folder (already done) containing:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The frontend will typically run on `http://localhost:5173`*

### Step 3: Access the Application

- Open your browser and navigate to `http://localhost:5173`
- **Default Admin Account:** 
  - Username: `admin` (or `admin@system.local`)
  - Password: `Admin@12345`
  
*Note: You can register a new normal user directly from the Sign Up page.*

---

## Integration Details
The frontend is fully connected to the backend API.
- All HTTP requests route through the centralized `api.ts` Axios instance located at `frontend/src/services/api.ts`.
- Mock data instances have been replaced in `DataContext` and core pages (`DashboardPage`, `AppointmentsPage`) to fetch live data asynchronously on component mount.
