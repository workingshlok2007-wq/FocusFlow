# Setup Guide

This guide will help you set up and run the backend API locally or using Docker.

## Prerequisites

### Local Development
- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm or yarn

### Docker Development
- Docker >= 20.x
- Docker Compose >= 2.x

## Quick Start with Docker (Recommended)

This is the easiest way to get started. Docker will handle both the database and API server.

### 1. Clone and Navigate to Project

```bash
cd backend-api
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

The default `.env` file is already configured for Docker. No changes needed for basic setup.

### 3. Start with Docker Compose

```bash
docker-compose up -d
```

This will:
- Start a PostgreSQL database container
- Start the API server container
- Run database migrations automatically

### 4. Check Status

```bash
docker-compose ps
docker-compose logs -f api
```

### 5. Test the API

```bash
curl http://localhost:3000/health
```

You should see: `{"status":"ok","timestamp":"..."}`

### 6. Stop the Services

```bash
docker-compose down
```

To stop and remove all data:

```bash
docker-compose down -v
```

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up PostgreSQL

Install PostgreSQL if you haven't already:

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS:**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### 3. Create Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE mydb;
CREATE USER user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE mydb TO user;
\q
```

### 4. Configure Environment

```bash
cp .env.example .env
```

Update the `.env` file with your database credentials:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### 5. Generate Prisma Client

```bash
npm run prisma:generate
```

### 6. Run Database Migrations

```bash
npm run prisma:migrate
```

### 7. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000` with hot-reload enabled.

## Database Management

### View Database with Prisma Studio

```bash
npm run prisma:studio
```

This opens a visual database editor at `http://localhost:5555`

### Create New Migration

After modifying `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name your_migration_name
```

### Reset Database

⚠️ This will delete all data:

```bash
npx prisma migrate reset
```

## Testing the API

### Using cURL

**Register a user:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Copy the `token` from the response.

**Create a post (protected endpoint):**
```bash
curl -X POST http://localhost:3000/api/v1/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My First Post",
    "content": "This is my first post!",
    "published": true
  }'
```

### Using Postman

1. Import `postman_collection.json` into Postman
2. The collection includes all endpoints with examples
3. Authentication tokens are automatically saved after login/register

## Production Deployment

### Environment Variables

Ensure these are set securely in production:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
JWT_SECRET=very-secure-random-secret-key
CORS_ORIGIN=https://your-frontend-domain.com
```

### Build for Production

```bash
npm run build
```

### Run Production Server

```bash
npm start
```

### Docker Production Build

```bash
docker build -t backend-api:latest .
docker run -p 3000:3000 --env-file .env backend-api:latest
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

1. Change `PORT` in `.env` file
2. Or kill the process using port 3000:

```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database Connection Issues

1. Verify PostgreSQL is running:
```bash
sudo systemctl status postgresql
```

2. Check database credentials in `.env`

3. Test connection:
```bash
psql -h localhost -U user -d mydb
```

### Prisma Issues

If you encounter Prisma-related errors:

```bash
# Regenerate client
npm run prisma:generate

# Reset and reapply migrations
npx prisma migrate reset

# Or create a new migration
npx prisma migrate dev
```

### Docker Issues

```bash
# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up -d --build

# Reset everything
docker-compose down -v
docker system prune -a
```

## Development Tools

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

### Type Checking

TypeScript type checking is done automatically during build:

```bash
npm run build
```

## API Documentation

- Full API documentation: See `API.md`
- Postman collection: Import `postman_collection.json`
- Interactive testing: Use Postman or any REST client

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 3000 |
| API_VERSION | API version prefix | v1 |
| DATABASE_URL | PostgreSQL connection string | - |
| JWT_SECRET | Secret key for JWT tokens | - |
| JWT_EXPIRES_IN | JWT token expiration | 7d |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:3000 |
| RATE_LIMIT_WINDOW_MS | Rate limit window (ms) | 900000 (15 min) |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100 |

## Need Help?

- Check `README.md` for overview
- Check `API.md` for API documentation
- Review code comments in `src/` directory
- Check Prisma documentation: https://www.prisma.io/docs
- Check Express documentation: https://expressjs.com
