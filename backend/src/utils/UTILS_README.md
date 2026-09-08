# =============================================================
# Utilities Reference - Beauty Salon Backend
# =============================================================
#
# Shared utility functions used across the backend application.
# Each utility module focuses on a single concern.
#
# =============================================================

## Utility Modules

### date.ts — Date & Time Helpers

| Function             | Signature                                                        | Description                                       |
|----------------------|------------------------------------------------------------------|---------------------------------------------------|
| `calculateEndTime`   | `(startTime: string, durationMinutes: number) => string`         | Adds duration to a start time (HH:mm) and returns end time in HH:mm format |
| `isTimeOverlapping`  | `(start1, end1, start2, end2: string) => boolean`                | Checks if two HH:mm time ranges overlap           |
| `getDayOfWeek`       | `(dateString: string) => number`                                 | Returns 0-6 day of week from a YYYY-MM-DD string  |

**Usage Example:**
```typescript
import { calculateEndTime, isTimeOverlapping, getDayOfWeek } from '../utils/date';

const endTime = calculateEndTime('09:00', 60); // "10:00"
const overlaps = isTimeOverlapping('09:00', '10:00', '09:30', '11:00'); // true
const day = getDayOfWeek('2024-01-15'); // 1 (Monday)
```

---

### jwt.ts — JWT Token Management

| Function        | Signature                                    | Description                              |
|-----------------|----------------------------------------------|------------------------------------------|
| `generateToken` | `(payload: JwtPayload) => string`            | Signs a JWT with id and role             |
| `verifyToken`   | `(token: string) => JwtPayload`              | Verifies and decodes a JWT               |

**JwtPayload Interface:**
```typescript
interface JwtPayload {
  id: string;
  role: string;
}
```

---

### password.ts — Password Hashing

| Function          | Signature                                              | Description                          |
|-------------------|--------------------------------------------------------|--------------------------------------|
| `hashPassword`    | `(password: string) => Promise<string>`                | Hashes a password with bcrypt (10 salt rounds) |
| `comparePassword` | `(password: string, hash: string) => Promise<boolean>` | Compares a plain password against a bcrypt hash |

---

### response.ts — Standardized API Responses

| Function      | Signature                                                              | Description                           |
|---------------|------------------------------------------------------------------------|---------------------------------------|
| `sendSuccess` | `(res, statusCode, message, data?, pagination?) => Response`           | Sends `{ success: true, message, data, pagination? }` |
| `sendError`   | `(res, statusCode, message) => Response`                               | Sends `{ success: false, message }`   |

**Response Format:**
```json
// Success
{
  "success": true,
  "message": "Resource fetched successfully",
  "data": { ... },
  "pagination": { "page": 1, "total": 50 }
}

// Error
{
  "success": false,
  "message": "Validation Error: email: Invalid email address"
}
```
