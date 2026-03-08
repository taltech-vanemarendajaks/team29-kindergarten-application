# team29-kindergarten-application

## Kindergarten Backend (local setup)

### Prerequisites

- Java 25
- Gradle
- Docker

### Environment Variables

In the backend folder create a `.env` file with your local database credentials using the `.env.example` file as a template.

### Running the backend application
In root folder run `docker compose up` to start the database.

Run `gradle bootRun` in `backend` folder to run the project.

---

## Frontend (Next.js)

### Prerequisites

- Node.js (LTS)

### Setup and run

1. Install dependencies: from repo root run `npm install` in the `frontend` folder (or `cd frontend && npm install`).
2. Start dev server: in `frontend` run `npm run dev`.
3. Open [http://localhost:3000](http://localhost:3000) in the browser.

Build for production: `npm run build` in `frontend`. Start production server: `npm run start`.