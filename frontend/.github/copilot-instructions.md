
# Book Store AI Coding Agent Instructions

This project is a full-stack book management app with a Node.js/Express backend (see `app.js`, `db.js`, `models/`) and an Angular 20+ frontend (`frontend/`). The following conventions, workflows, and patterns are critical for AI agents to be productive and consistent in this codebase.

## Architecture & Data Flow
- **Backend**: REST API using Express, MongoDB via Mongoose, JWT authentication. Entrypoints: `app.js`, `db.js`, `models/Book.js`, `models/User.js`.
- **Frontend**: Angular 20+ app in `frontend/` using standalone components, signals for state, and Angular Router for navigation. API calls proxied via `frontend/proxy.conf.json`.
- **Data Flow**: Frontend communicates with backend via REST endpoints (see `book.service.ts`, `auth.service.ts`).

## Developer Workflows
- **Start backend**: `node app.js` (from repo root)
- **Start frontend**: `npm start` (from `frontend/`)
- **API proxy**: Frontend dev server proxies `/api` to backend (see `proxy.conf.json`)
- **Testing**: Frontend uses Angular/Karma/Jasmine (`ng test` in `frontend/`). Backend: no tests by default.
- **Debugging**: Use `get_errors` tool for error reporting. Add print/log statements as needed. Make small, incremental changes and validate after each.

## Project-Specific Conventions
- **Angular**:
  - Use standalone components (do not set `standalone: true` explicitly)
  - Use signals for state, `computed()` for derived state
  - Prefer `input()`/`output()` functions over decorators
  - Use `host` object for bindings, not `@HostBinding`/`@HostListener`
  - Use `NgOptimizedImage` for static images (not for base64)
  - Prefer inline templates for small components
  - Use `ChangeDetectionStrategy.OnPush`
  - Prefer reactive forms
  - Use `class`/`style` bindings, not `ngClass`/`ngStyle`
- **Services**: Single responsibility, `providedIn: 'root'`, use `inject()`
- **TypeScript**: Strict type checking, avoid `any`, prefer `unknown` if needed

## Integration Points
- **Backend/Frontend**: All data exchange via REST endpoints. See `book.service.ts` and `auth.service.ts` for API usage patterns.
- **Authentication**: JWT-based, tokens stored in frontend (see `auth.service.ts`).
- **Models**: Book and User schemas in `models/` directory.

## File/Directory References
- `app.js`, `db.js`: Backend entrypoints
- `models/Book.js`, `models/User.js`: Mongoose models
- `frontend/src/app/`: Angular components and services
- `frontend/proxy.conf.json`: API proxy config
- `frontend/.github/copilot-instructions.md`: Full coding standards

## Example Patterns
- **Standalone Angular Component**:
  ```ts
  @Component({
    selector: 'app-example',
    standalone: true,
    template: `<div>Example</div>`
  })
  export class ExampleComponent {}
  ```
- **Service with inject()**:
  ```ts
  @Injectable({ providedIn: 'root' })
  export class BookService {
    private http = inject(HttpClient);
    // ...
  }
  ```

## AI Agent Workflow (from `.github/chatmodes/beast-mode.chatmode.md`)
- Always read relevant file contents before editing
- Make small, testable, incremental changes
- Use `get_errors` for diagnostics
- Debug deeply, validate root cause, and iterate until all tests pass
- Use markdown todo lists to track progress

---
For further details, see `README.md` and `.github/chatmodes/beast-mode.chatmode.md`.
