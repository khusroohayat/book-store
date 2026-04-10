# GEMINI.md

## Project Overview
**Book Store** is a full-stack web application for managing a personal book inventory. It features secure user authentication, private book collections, and a modern reactive frontend.

- **Stack:** Node.js, Express, MongoDB (Mongoose), Angular 20+, JWT.
- **Architecture:** 2-tier SPA with a RESTful API backend.
- **Key Files:**
  - `app.js`: Express server and API routes.
  - `models/`: Mongoose schemas for `Book` and `User`.
  - `frontend/`: Angular application.
  - `test/`: Backend integration tests.

---

## Building and Running

### Prerequisites
- Node.js (LTS)
- MongoDB (Local, Atlas, or via `docker compose -f mongodb.yaml up -d`)

### Backend Setup
1. **Environment:** Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/bookstore
   PORT=3000
   JWT_SECRET=your_jwt_secret
   ```
2. **Install & Run:**
   ```bash
   npm install
   node app.js
   ```

### Frontend Setup
1. **Install & Run:**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   *Note: `npm start` uses `proxy.conf.json` to route `/api` calls to the backend.*

---

## Testing

### Backend (Jest/Supertest)
Verify API ownership and CRUD logic:
```bash
npx jest test/book-ownership.test.js
```

### Frontend (Karma/Jasmine)
Run Angular unit tests:
```bash
cd frontend
npx ng test --watch=false
```

---

## Development Conventions

### Backend (Node.js/Express)
- **API Prefix:** All API routes must start with `/api/`.
- **Authentication:** Use `authenticateToken` middleware for protected routes.
- **Data Integrity:** Enforce ownership checks (`book.userId === req.user.id`) for all CRUD operations.
- **Models:** Use Mongoose models in `models/`. Use `bcrypt` for password hashing in `User` model.

### Frontend (Angular 20+)
- **Components:** Use **standalone components**.
- **State Management:** Use **Signals** for reactive state and `computed()` for derived state.
- **Data Flow:** Prefer `input()` and `output()` functions over decorators.
- **Performance:** Use `ChangeDetectionStrategy.OnPush` and `NgOptimizedImage`.
- **Styling:** Prefer **Vanilla CSS** and host object bindings. Avoid `ngClass`/`ngStyle`.
- **Forms:** Use **Reactive Forms**.
- **DI:** Use the `inject()` function instead of constructor injection.

### General
- **TypeScript:** Strict type checking is mandatory. Avoid `any`; use `unknown` if a type is truly dynamic.
- **Security:** Never commit `.env` or sensitive credentials.
- **SPA Fallback:** The backend serves the Angular `dist` folder and redirects non-API routes to `index.html`.

---

## Key Directories
- `models/`: Database schemas.
- `frontend/src/app/`: Angular components, services, and routes.
- `test/`: Automated test suites.
- `.github/`: CI/CD and agent-specific instructions (`copilot-instructions.md`).
