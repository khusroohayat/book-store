# Book Store (complete-mongo)

A full-stack web application for managing books and users, featuring authentication, CRUD operations, and pagination. The backend is built with Node.js/Express and MongoDB, while the frontend is a modern Angular 20+ SPA.

---

## Technology Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose, mongodb drivers)
- **Frontend:** Angular 20+ (TypeScript)
- **Authentication:** JWT (jsonwebtoken), bcrypt
- **Utilities:** dotenv, cors

**Versions:**
- Angular: ~20.2
- mongoose: ^8
- mongodb: ^6
- jsonwebtoken: ^9

---

## Project Architecture

- **2-tier architecture:**
  - **Client:** Angular SPA, served separately in development via `ng serve` (uses proxy to API)
  - **Server:** Express REST API under `/api/*` with JWT authentication
  - **Database:** MongoDB for `Book` and `User` documents (see `models/Book.js`, `models/User.js`)
- **Key flows:**
  - Register: `POST /api/register` → creates user
  - Login: `POST /api/login` → returns JWT
  - CRUD Books: `/api/books` (protected by JWT middleware)

---

## Getting Started

### Prerequisites
- Node.js (LTS)
- MongoDB (local or Atlas)
- npm

### Backend Setup
1. Copy or create a `.env` file in the project root with:
   ```
   MONGODB_URI=mongodb://localhost:27017/bookstore
   PORT=3000
   JWT_SECRET=your_jwt_secret
   ```
2. Install dependencies and start backend:
   ```bash
   npm install
   node app.js
   ```

### Frontend Setup
1. Install dependencies and start Angular app:
   ```bash
   cd frontend
   npm install
   npm start
   ```
2. The frontend uses `frontend/proxy.conf.json` to forward API requests to the backend during development.

---

## Project Structure

- `app.js` – Express server, routes, and auth middleware
- `db.js` – MongoDB connection helper
- `models/Book.js`, `models/User.js` – Mongoose models
- `frontend/` – Angular application
  - `src/app/` – Angular components and services
  - `proxy.conf.json` – API proxy config
  - `.github/copilot-instructions.md` – Coding standards and agent instructions

---

## Key Features

- User registration and login with JWT authentication
- Protected CRUD endpoints for books with pagination
- Basic input validation and error handling

---

## Development Workflow

- Backend and frontend are developed and run separately.
- Start backend: `node app.js` (from repo root)
- Start frontend: `npm start` (from `frontend/`)
- Use the Angular proxy to route API calls to the backend.
- Frontend testing: `ng test` (Karma/Jasmine)
- Backend: no automated tests by default
- See `.github/chatmodes/beast-mode.chatmode.md` for agent workflow details

---

## Coding Standards

- **TypeScript:** Strict checking, avoid `any`, prefer `unknown` if needed
- **Angular:**
  - Use standalone components (do not set `standalone: true` explicitly)
  - Use signals for state, `computed()` for derived state
  - Prefer `input()`/`output()` functions over decorators
  - Use `host` object for bindings, not `@HostBinding`/`@HostListener`
  - Use `NgOptimizedImage` for static images (not for base64)
  - Prefer inline templates for small components
  - Use `ChangeDetectionStrategy.OnPush`
  - Prefer reactive forms
  - Use `class`/`style` bindings, not `ngClass`/`ngStyle`
- **Services:** Single responsibility, `providedIn: 'root'`, use `inject()`

See [`frontend/.github/copilot-instructions.md`](frontend/.github/copilot-instructions.md) for full guidance.

---

## Testing

- **Frontend:**
  - Unit tests: `ng test` (Karma/Jasmine)
  - End-to-end: `ng e2e` (choose your preferred e2e framework)
- **Backend:**
  - No automated tests included by default. Consider adding Jest or Mocha/Chai for API tests and supertest for endpoint testing.

---

## Contributing

- Follow the coding standards in [`frontend/.github/copilot-instructions.md`](frontend/.github/copilot-instructions.md)
- Open issues or PRs against the `main` branch with clear descriptions and repro steps
- Reference code exemplars and patterns in the instructions file

---

## License

This repository does not include an explicit license file. Add a `LICENSE` to clarify reuse rights.

---

**Key files:**
- `app.js`, `db.js` – backend entrypoints
- `models/Book.js`, `models/User.js` – data models
- `frontend/` – Angular project
- `frontend/.github/copilot-instructions.md` – coding standards and agent instructions
- `.github/chatmodes/beast-mode.chatmode.md` – agent workflow

