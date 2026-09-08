# =============================================================
# Frontend Utilities Reference - Beauty Salon
# =============================================================
#
# Shared utility functions used across the React frontend.
#
# =============================================================

## Utility Modules

### currency.ts — Currency Formatting

| Export            | Type     | Value/Signature                                             | Description                          |
|-------------------|----------|-------------------------------------------------------------|--------------------------------------|
| `CURRENCY`        | constant | `'ETB'`                                                     | Currency code (Ethiopian Birr)       |
| `CURRENCY_SYMBOL` | constant | `'ETB'`                                                     | Currency display symbol              |
| `formatCurrency`  | function | `(amount: number \| string \| null \| undefined) => string` | Formats a value as "X,XXX ETB"       |

**Usage Example:**
```typescript
import { formatCurrency } from '../utils/currency';

formatCurrency(800);       // "800 ETB"
formatCurrency(45200);     // "45,200 ETB"
formatCurrency(null);      // "0 ETB"
formatCurrency('invalid'); // "0 ETB"
```

## Notes

- All currency values in the system are denominated in **Ethiopian Birr (ETB)**
- The `formatCurrency` function handles null, undefined, empty strings, and invalid numbers gracefully
- Currency configuration is tied to the `SiteSetting.currency` field in the database
