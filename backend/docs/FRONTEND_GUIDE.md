# Beauty Salon Appointment System - Frontend Integration Guide

Welcome to the frontend integration guide for the Beauty Salon Appointment System API. This backend is built with Node.js, Express, TypeScript, and Prisma (PostgreSQL).

## Base URL
The API is served at `/api/v1`. During local development, this usually means `http://localhost:5000/api/v1`.

## Authentication

All protected routes require a JWT token passed in the `Authorization` header as a Bearer token:

```http
Authorization: Bearer <your_token_here>
```

Tokens are obtained by calling the login endpoint and are valid for the duration specified in the `.env` file (default is 7 days).

## Response Format

All responses follow a consistent format:

**Success Response (2xx):**
```json
{
  "success": true,
  "message": "Human readable message",
  "data": { ... }, // The actual payload
  "pagination": {  // Included only for list endpoints
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

**Error Response (4xx, 5xx):**
```json
{
  "success": false,
  "message": "Error description (e.g., 'Validation Error' or 'Unauthorized')"
}
```

---

## Endpoint Overview

### 1. Authentication
* `POST /auth/register` - Register a new USER. Payload: `email`, `username`, `password`, `firstName`, `lastName`.
* `POST /auth/login` - Login with `username` and `password`. Returns `token` and `user` data.
* `GET /auth/me` - Get current authenticated user details. (Requires Token).

### 2. Users
* `GET /users/profile` - Get current user profile. (Requires Token).
* `PATCH /users/profile` - Update user profile. Payload: `firstName`, `lastName`, `password`.

### 3. Staff (Hairdressers, Barbers, etc.)
* `GET /staff` - Get paginated list of staff. Query: `?page=1&limit=10&search=John`. Includes `averageRating`.
* `GET /staff/:id` - Get specific staff member, their assigned services, and working hours.
* `POST /staff` - [ADMIN ONLY] Create a new staff account.
* `PATCH /staff/:id` - [ADMIN ONLY] Update a staff account.

### 4. Services (Haircut, Coloring, etc.)
* `GET /services` - Get paginated list of all offered services. Includes `averageRating`.
* `GET /services/:id` - Get specific service details.
* `POST /services` - [ADMIN ONLY] Create a new service.
* `PATCH /services/:id` - [ADMIN ONLY] Update a service.

### 5. Appointments (Core Feature)
* `POST /appointments` - Book an appointment. Payload: `staffId`, `serviceId`, `date` (YYYY-MM-DD), `startTime` (HH:mm). **Handles double-booking protection and working hours validation automatically.**
* `GET /appointments/my-appointments` - Get user's appointments (if USER role) or staff's appointments (if STAFF role).
* `GET /appointments` - [ADMIN ONLY] View all appointments.
* `PATCH /appointments/:id/status` - Update status (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`). Users can only `CANCEL` their own appointments. Staff can update their own appointments.

### 6. Ratings
* `GET /ratings/staff/:staffId` - View ratings for a specific staff member.
* `GET /ratings/service/:serviceId` - View ratings for a specific service.
* `POST /ratings` - Rate a COMPLETED appointment. Payload: `appointmentId`, `score` (1-5), `comment`. (Requires Token, USER only).

### 7. Posts (Blog / News)
* `GET /posts` - Get posts. Users only see published posts. Staff/Admin see all.
* `GET /posts/:id` - Get a specific post.
* `POST /posts` - [ADMIN/STAFF ONLY] Create a post.
* `PATCH /posts/:id` - [ADMIN/STAFF ONLY] Update a post.
* `DELETE /posts/:id` - [ADMIN/STAFF ONLY] Delete a post.

### 8. Notifications
* `GET /notifications` - Get your notifications.
* `PATCH /notifications/:id/read` - Mark a specific notification as read.
* `PATCH /notifications/mark-all-read` - Mark all notifications as read.

### 9. Dashboard (Role-based analytics)
* `GET /dashboard` - Get dashboard metrics based on the current user's role.
  * **ADMIN:** Returns total users, staff, appointments, revenue, recent appointments.
  * **STAFF:** Returns upcoming/completed/todays appointments, average rating.
  * **USER:** Returns upcoming/recent appointments.

---

## Common Workflows for Frontend

### Booking an Appointment
1. Fetch all services: `GET /services`. User selects a service (`serviceId`).
2. Fetch staff members: `GET /staff`. User selects a staff member (`staffId`).
3. Frontend shows a calendar. User selects a `date` (YYYY-MM-DD) and a `startTime` (e.g., "14:30").
4. Submit booking: `POST /appointments` with the above data.
5. If the time is taken or outside working hours, the backend will return a `409 Conflict` error, which the frontend should display ("Staff is already booked at this time").

### Displaying Staff Ratings
The `GET /staff` list endpoint already calculates and includes the `averageRating` for every staff member. To show individual reviews, call `GET /ratings/staff/:staffId`.

## Technical Implementation Details
* **Validation:** All incoming requests are strictly validated using `Zod`. Ensure you send the exact correct data types (e.g. `durationMinutes` must be a Number, not a String).
* **Time Format:** Time is always stored and sent in 24-hour string format `HH:mm` (e.g., `"09:00"`, `"14:30"`).
* **Date Format:** Dates are always stored in ISO format `YYYY-MM-DD` string.
