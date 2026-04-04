# team29-kindergarten-application

## Kindergarten Backend (local setup)

### Prerequisites

- Java 25
- Gradle
- Docker

### Environment Variables

In the backend folder create a `.env.properties` file in resources folder with your local database credentials using 
the `.env.example` file as a template.

### Running the backend application locally
#### Database
In root folder run `docker compose -f docker-compose.dev.yml up -d postgres` to start the database.

_In order to stop the database, run `docker compose -f docker-compose.dev.yml down` in the root folder._

#### Backend
For macOS users, run `gradle bootRun` in `backend` folder to run the project. 

For Windows users, you may need to run `./gradlew bootRun` instead.

or use Run Configurations in your IDE.

---

## Frontend (Next.js)

### Prerequisites

- Node.js (LTS)

### Setup and run

1. Install dependencies: from repo root run `npm install` in the `frontend` folder (or `cd frontend && npm install`).
2. Create a `.env.local` file in the `frontend` folder with the following content:

```NEXT_PUBLIC_API_URL=[your_backend_url]```

3. Start dev server: in `frontend` run `npm run dev`.
3. Open [http://localhost:3000](http://localhost:3000) in the browser.

Build for production: `npm run build` in `frontend`. Start production server: `npm run start`.