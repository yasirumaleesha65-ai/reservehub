# ReserveHub — Resource Reservation Management System

ReserveHub is a web-based resource reservation management system designed to help an organization manage shared resources, check availability, and prevent conflicting reservations.

This project was developed as a Software Engineering Internship Technical Assessment for PrimeWave Lab (Pvt) Ltd.

## Features

### Authentication and Authorization

- User registration, login, and logout.
- Secure password hashing using bcrypt.
- Session-based authentication using JWT stored in a cookie.
- Role-based access control for employees and administrators.

### Resource Management

- View available resources and their details.
- Create, update, activate, and deactivate resources (administrator access).
- Organize resources by category.
- Prevent deactivation when a resource has an upcoming or current confirmed reservation.

### Reservation Management

- Create reservations for resources.
- Check resource availability before booking.
- Prevent overlapping reservations.
- Cancel reservations according to ownership and administrator permissions.
- Allow employees to view their own reservations and administrators to manage reservations across the system.

### Dashboard and User Experience

- Dashboard for reservation and resource management.
- Search and browse resources.
- Forms and status feedback for common operations.
- Shared authentication state managed using React Context API.

## Technology Stack

| Technology               | Purpose                            |
| ------------------------ | ---------------------------------- |
| Next.js App Router       | Application framework and routing  |
| React                    | User interface                     |
| TypeScript               | Type-safe development              |
| PostgreSQL               | Relational database                |
| Prisma ORM               | Database access and migrations     |
| Tailwind CSS             | Styling                            |
| Base UI and Lucide React | UI components and icons            |
| bcryptjs                 | Password hashing                   |
| jose                     | JWT handling                       |
| Git and GitHub           | Version control and source hosting |

## Prerequisites

Install the following before running the project:

- Node.js (a version compatible with the installed Next.js release)
- npm
- PostgreSQL
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/yasirumaleesha65-ai/reservehub.git
cd reservehub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root. Do not commit this file or publish real credentials.

Configure the variables required by the application and Prisma:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/reservehub?schema=public"
SESSION_SECRET="replace-with-a-long-random-secret"
```

Replace `USER` and `PASSWORD` with your local PostgreSQL credentials. Create the `reservehub` database before running migrations.

Generate a strong, random session secret for your local environment. Never use the example value above in a real deployment.

### 4. Set up the database

Apply the existing Prisma migrations to create the database tables:

```bash
npx prisma migrate deploy
```

Generate the Prisma Client:

```bash
npx prisma generate
```

Populate the database with sample resources and a demo employee record:

```bash
npx prisma db seed
```

**Note:** The seeded demo employee account is not configured for login. Register a user through the application to sign in.

For development, use the appropriate Prisma migration workflow when making changes to the database schema.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command         | Description                                |
| --------------- | ------------------------------------------ |
| `npm run dev`   | Start the development server               |
| `npm run build` | Build the application for production       |
| `npm run start` | Start the production server after building |
| `npm run lint`  | Run ESLint                                 |

## Project Structure

```text
reservehub/
├── prisma/
│   ├── migrations/       # Database migration history
│   ├── schema.prisma     # Database models and relations
│   └── seed.ts           # Database seed logic
├── src/
│   ├── app/              # Next.js pages, layouts, API routes, context
│   ├── components/       # Reusable UI components
│   ├── generated/        # Generated Prisma Client (if generated locally)
│   ├── lib/              # Shared utilities and server-side logic
│   └── types/            # Shared TypeScript types
├── prisma7.config.ts     # Prisma configuration
├── package.json
└── README.md
```

## Data Model

The core data model consists of three entities:

- **User** — stores user details, password hashes, and access roles.
- **Resource** — represents a reservable resource and its availability status.
- **Reservation** — records bookings, their time ranges, status, and relationships to users and resources.

A reservation belongs to a user and a resource. The application checks time overlaps to prevent conflicting bookings.

An ER diagram will be provided as part of the assessment submission.

## Security and Reliability Considerations

- Passwords are hashed instead of being stored in plain text.
- Protected operations enforce authentication and role-based authorization.
- Reservation ownership is checked when cancelling a booking.
- Availability checks prevent overlapping reservations.
- Reservation creation uses transaction and conflict-handling logic to reduce race-condition issues.
- Environment files and generated or local development artifacts should not be committed.

## Limitations and Future Improvements

Potential future enhancements include automated integration tests, email notifications, recurring reservations, audit logs, and deployment to a production hosting environment.

## Author

**Yasiru Maleesha**

GitHub: [yasirumaleesha65-ai](https://github.com/yasirumaleesha65-ai)

## Repository

[ReserveHub on GitHub](https://github.com/yasirumaleesha65-ai/reservehub)
