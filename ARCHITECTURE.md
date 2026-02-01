# Backend Architecture

This document describes the architecture and design decisions of this backend API.

## Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Security**: Helmet, CORS, bcryptjs
- **Rate Limiting**: express-rate-limit

## Project Structure

```
src/
├── config/              # Configuration management
│   └── index.ts        # Centralized config from env vars
│
├── controllers/         # Request handlers (business logic)
│   ├── auth.controller.ts    # Authentication logic
│   ├── user.controller.ts    # User management
│   └── post.controller.ts    # Post CRUD operations
│
├── lib/                # Third-party library setup
│   └── prisma.ts       # Prisma client instance
│
├── middleware/         # Express middleware
│   ├── index.ts        # Middleware setup (cors, helmet, etc.)
│   ├── auth.ts         # JWT authentication middleware
│   ├── validate.ts     # Request validation middleware
│   ├── errorHandler.ts # Global error handler
│   └── notFoundHandler.ts # 404 handler
│
├── routes/             # API route definitions
│   ├── index.ts        # Route aggregator
│   ├── auth.routes.ts  # Auth endpoints
│   ├── user.routes.ts  # User endpoints
│   └── post.routes.ts  # Post endpoints
│
├── utils/              # Utility functions
│   ├── ApiError.ts     # Custom error class
│   ├── asyncHandler.ts # Async error wrapper
│   ├── jwt.ts          # JWT utilities
│   └── logger.ts       # Logging utilities
│
├── validators/         # Request validation schemas
│   ├── auth.validator.ts
│   ├── user.validator.ts
│   └── post.validator.ts
│
└── index.ts           # Application entry point
```

## Architecture Patterns

### 1. Layered Architecture

The application follows a clean layered architecture:

```
Routes → Middleware → Controllers → Services/ORM → Database
```

- **Routes**: Define API endpoints and HTTP methods
- **Middleware**: Handle cross-cutting concerns (auth, validation)
- **Controllers**: Process requests and coordinate responses
- **Prisma ORM**: Handle database operations
- **Database**: PostgreSQL data store

### 2. Controller Pattern

Controllers are implemented as classes with methods for each action:

```typescript
export class AuthController {
  register = asyncHandler(async (req, res) => {
    // Handle registration
  });
  
  login = asyncHandler(async (req, res) => {
    // Handle login
  });
}
```

Benefits:
- Clear separation of concerns
- Easy to test
- Reusable logic

### 3. Error Handling

Centralized error handling using custom `ApiError` class:

```typescript
throw new ApiError(404, 'Resource not found');
```

All errors are caught by the global error handler middleware.

### 4. Async/Await with Error Wrapper

The `asyncHandler` wrapper eliminates try-catch boilerplate:

```typescript
export const asyncHandler = (fn: AsyncFunction) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

### 5. Request Validation

Zod schemas validate all incoming requests:

```typescript
const schema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});
```

## Security Features

### 1. Authentication & Authorization

- **JWT tokens** for stateless authentication
- **bcrypt** for password hashing (10 salt rounds)
- Bearer token authentication scheme
- Token verification on protected routes

### 2. Security Headers

**Helmet** adds security headers:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Strict-Transport-Security

### 3. CORS Protection

Configurable CORS with:
- Origin whitelist
- Credentials support
- Preflight handling

### 4. Rate Limiting

Prevents abuse with:
- 100 requests per 15 minutes per IP
- Configurable via environment variables
- Applied to all `/api` routes

### 5. Input Validation

- All inputs validated with Zod
- SQL injection prevention via Prisma
- XSS prevention via validation

## Database Design

### Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Design Decisions

- **CUID** for primary keys (better than UUID for distributed systems)
- **Timestamps** on all models for auditing
- **Cascade delete** on user deletion removes their posts
- **Indexed fields** on unique columns for performance

## API Design

### RESTful Principles

Following REST conventions:
- `GET /posts` - List resources
- `GET /posts/:id` - Get single resource
- `POST /posts` - Create resource
- `PATCH /posts/:id` - Update resource
- `DELETE /posts/:id` - Delete resource

### Response Format

Consistent JSON responses:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

### Pagination

List endpoints support pagination:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- Returns total count and page info

## Environment Configuration

All configuration centralized in `src/config/index.ts`:

```typescript
export const config = {
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT),
  jwt: { ... },
  cors: { ... },
  rateLimit: { ... },
};
```

Benefits:
- Single source of truth
- Type-safe configuration
- Easy to test with different configs

## Development Workflow

### 1. Database Changes

```bash
# Edit prisma/schema.prisma
npx prisma migrate dev --name description
```

### 2. Add New Endpoint

1. Create validator schema
2. Add controller method
3. Define route with middleware
4. Test with Postman

### 3. Hot Reload

Development server uses `tsx watch` for instant reload on file changes.

## Testing Strategy (Not Implemented)

Recommended testing approach:

- **Unit Tests**: Controllers, utilities
- **Integration Tests**: API endpoints
- **E2E Tests**: Complete user flows
- **Tools**: Jest, Supertest

## Performance Considerations

### Database

- Prisma connection pooling
- Indexed columns (email, id)
- Select only needed fields
- Pagination for large datasets

### Caching

Not implemented but recommended:
- Redis for session storage
- Query result caching
- Rate limit data storage

### Scalability

- Stateless design (JWT)
- Horizontal scaling ready
- Database connection pooling
- Environment-based config

## Deployment

### Docker Deployment

```bash
docker-compose up -d
```

Includes:
- PostgreSQL container
- API container
- Automatic migrations
- Volume persistence

### Production Checklist

- [ ] Set strong `JWT_SECRET`
- [ ] Configure `CORS_ORIGIN`
- [ ] Set `NODE_ENV=production`
- [ ] Configure database backups
- [ ] Set up monitoring/logging
- [ ] Enable HTTPS
- [ ] Review rate limits
- [ ] Configure firewall

## Monitoring & Logging

### Current Implementation

Simple console logging with timestamps:
- Request logging (Morgan)
- Error logging
- Info/debug levels

### Recommended Improvements

- Structured logging (Winston/Pino)
- Log aggregation (ELK Stack)
- APM tools (New Relic, Datadog)
- Health check endpoints

## Future Enhancements

### Short Term
- Unit and integration tests
- API documentation (Swagger/OpenAPI)
- Email verification
- Password reset
- Refresh tokens

### Medium Term
- File upload support
- Search functionality
- Caching layer (Redis)
- WebSocket support
- API versioning

### Long Term
- Microservices architecture
- Event-driven patterns
- GraphQL API
- Kubernetes deployment

## Code Style & Conventions

### TypeScript

- Strict mode enabled
- No `any` types (where possible)
- Async/await over promises
- Named exports preferred

### Naming

- camelCase for variables/functions
- PascalCase for classes/types
- UPPER_CASE for constants
- Descriptive names over short ones

### File Organization

- One controller per file
- Group related routes
- Shared utilities in utils/
- Keep files under 200 lines

## References

- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zod](https://zod.dev/)
- [JWT](https://jwt.io/)
