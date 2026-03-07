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

Run `gradle bootRun` in `backend` folder to run the project