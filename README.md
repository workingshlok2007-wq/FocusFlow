# Backend API

A robust REST API built with Node.js, Express, TypeScript, and Prisma.

## Features

- 🔐 JWT-based authentication
- 🛡️ Security best practices (Helmet, CORS, Rate Limiting)
- ✅ Request validation with Zod
- 📊 PostgreSQL database with Prisma ORM
- 🎯 TypeScript for type safety
- 🔄 RESTful API design
- 📝 Structured logging
- ⚡ Hot reload in development

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM for database access
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Zod** - Schema validation
- **bcryptjs** - Password hashing

## Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm or yarn

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Update the environment variables in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
JWT_SECRET=your-secret-key-change-this-in-production
```

### 3. Database Setup

Generate Prisma Client:

```bash
npm run prisma:generate
```

Run database migrations:

```bash
npm run prisma:migrate
```

### 4. Run the Application

Development mode with hot reload:

```bash
npm run dev
```

Production mode:

```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user

### Users

- `GET /api/v1/users/me` - Get current user (protected)
- `PATCH /api/v1/users/me` - Update current user (protected)
- `DELETE /api/v1/users/me` - Delete current user (protected)

### Posts

- `GET /api/v1/posts` - Get all posts (with pagination)
- `GET /api/v1/posts/:id` - Get post by ID
- `POST /api/v1/posts` - Create post (protected)
- `PATCH /api/v1/posts/:id` - Update post (protected)
- `DELETE /api/v1/posts/:id` - Delete post (protected)

### Health Check

- `GET /health` - Check API health

## API Usage Examples

### Register User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create Post (Protected)

```bash
curl -X POST http://localhost:3000/api/v1/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my post",
    "published": true
  }'
```

### Get Posts (with pagination)

```bash
curl http://localhost:3000/api/v1/posts?page=1&limit=10&published=true
```

## Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── lib/             # Third-party library configurations
├── middleware/      # Custom middleware
├── routes/          # Route definitions
├── utils/           # Utility functions
├── validators/      # Request validation schemas
└── index.ts         # Application entry point

prisma/
└── schema.prisma    # Database schema
```

## Database Schema

### User

- `id` - Unique identifier
- `email` - User email (unique)
- `password` - Hashed password
- `name` - User name (optional)
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

### Post

- `id` - Unique identifier
- `title` - Post title
- `content` - Post content (optional)
- `published` - Publication status
- `authorId` - Foreign key to User
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Helmet for security headers
- CORS configuration
- Rate limiting
- Input validation
- SQL injection protection (via Prisma)

## Error Handling

The API uses a centralized error handling system with custom `ApiError` class. All errors return a consistent JSON format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## License

MIT
