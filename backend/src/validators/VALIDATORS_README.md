# =============================================================
# Validators Reference - Beauty Salon Appointment System
# =============================================================
#
# All request validators use Zod schemas for type-safe input
# validation. Validators are applied via the validateRequest()
# middleware defined in validation.middleware.ts.
#
# =============================================================

## Architecture

```
Request → validateRequest(schema) → Controller
              │
              ├─ Parses req.body, req.query, req.params
              ├─ Returns 400 with detailed error on failure
              └─ Passes parsed & typed data to next handler
```

## Validator Files

### auth.validator.ts
Handles authentication-related input validation.

| Schema           | Endpoint       | Fields                                           |
|------------------|----------------|--------------------------------------------------|
| `registerSchema` | POST /register | email, username (3-30 chars), password (6+ chars), firstName?, lastName? |
| `loginSchema`    | POST /login    | username (required), password (required)         |

---

### appointment.validator.ts
Handles appointment booking, availability, and status updates.

| Schema                          | Endpoint                 | Fields                                              |
|---------------------------------|--------------------------|-----------------------------------------------------|
| `createAppointmentSchema`       | POST /appointments       | staffId? (uuid), serviceId (uuid), date (YYYY-MM-DD), startTime (HH:mm), notes?, customerName (2+ chars), customerPhone (5+ chars) |
| `getAvailabilitySchema`         | GET /availability        | serviceId (uuid), date (YYYY-MM-DD), staffId? (uuid)|
| `updateAppointmentStatusSchema` | PATCH /appointments/:id  | status (enum), cancellationReason?                  |
| `rescheduleAppointmentSchema`   | PUT /appointments/:id    | date (YYYY-MM-DD), startTime (HH:mm), staffId?     |

---

### service.validator.ts
Handles salon service CRUD operations.

| Schema                | Endpoint           | Fields                                                     |
|-----------------------|--------------------|------------------------------------------------------------|
| `createServiceSchema` | POST /services     | name (2+ chars), nameAm?, nameOm?, description?, descriptionAm?, descriptionOm?, durationMinutes (int), price (positive), category?, categoryAm?, categoryOm?, imageUrl? |
| `updateServiceSchema` | PUT /services/:id  | All fields optional, same types as create                  |

---

### staff.validator.ts
Handles staff management including working hours and blocked periods.

| Schema                       | Endpoint                     | Fields                                             |
|------------------------------|------------------------------|----------------------------------------------------|
| `createStaffSchema`          | POST /staff                  | email, username (3-30), password (6+), firstName, lastName, bio?, bioAm?, bioOm?, position?, positionAm?, positionOm?, imageUrl?, serviceIds (1+ required) |
| `updateStaffSchema`          | PUT /staff/:id               | firstName?, lastName?, bio?, position?, isActive?  |
| `assignServicesSchema`       | PUT /staff/:id/services      | serviceIds (string array)                          |
| `createBlockedPeriodSchema`  | POST /staff/:id/blocked      | date (YYYY-MM-DD), startTime? (HH:mm), endTime?, reason? |
| `updateWorkingHoursSchema`   | PUT /staff/:id/working-hours | workingHours[] with dayOfWeek (0-6), startTime, endTime, isDayOff? |

---

### post.validator.ts
Handles news/announcement posts.

| Schema             | Endpoint        | Fields                                                     |
|--------------------|-----------------|-----------------------------------------------------------|
| `createPostSchema` | POST /posts     | title (1-200), titleAm?, titleOm?, content (required), contentAm?, contentOm?, imageUrl?, status? |
| `updatePostSchema` | PUT /posts/:id  | All fields optional                                        |

---

### rating.validator.ts
Handles customer reviews for completed appointments.

| Schema              | Endpoint       | Fields                                             |
|---------------------|----------------|----------------------------------------------------|
| `createRatingSchema`| POST /ratings  | appointmentId (uuid), score (1-5), comment?, satisfaction (Satisfied/Medium/Not Satisfied) |

---

### user.validator.ts
Handles user profile updates.

| Schema             | Endpoint        | Fields                              |
|--------------------|-----------------|-------------------------------------|
| `updateUserSchema` | PUT /users/:id  | firstName?, lastName?, password? (6+)|

## Multi-language Support

Most content fields support three languages:
- **English** (default): `name`, `description`, `bio`, `title`, etc.
- **Amharic**: `nameAm`, `descriptionAm`, `bioAm`, `titleAm`, etc.
- **Oromo**: `nameOm`, `descriptionOm`, `bioOm`, `titleOm`, etc.

All translation fields are optional and accept empty strings.
