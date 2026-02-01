# API Documentation

Base URL: `http://localhost:3000/api/v1`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## Endpoints

### Authentication

#### Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "clxxx...",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation:**

- `email`: Valid email format, required
- `password`: Minimum 6 characters, required
- `name`: String, optional

#### Login

**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "clxxx...",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors:**

- `401`: Invalid credentials

---

### Users

#### Get Current User

**GET** `/users/me` 🔒

Get the authenticated user's profile.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "clxxx...",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update User

**PATCH** `/users/me` 🔒

Update the authenticated user's profile.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "Jane Doe",
  "email": "newemail@example.com"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "clxxx...",
    "email": "newemail@example.com",
    "name": "Jane Doe",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**

- `409`: Email already in use

#### Delete User

**DELETE** `/users/me` 🔒

Delete the authenticated user's account.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### Posts

#### Get All Posts

**GET** `/posts`

Get a paginated list of posts.

**Query Parameters:**

- `published` (optional): Filter by publication status (`true` or `false`)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example:** `/posts?published=true&page=1&limit=10`

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "clxxx...",
        "title": "My First Post",
        "content": "This is the content",
        "published": true,
        "authorId": "clyyy...",
        "author": {
          "id": "clyyy...",
          "name": "John Doe",
          "email": "user@example.com"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### Get Post by ID

**GET** `/posts/:id`

Get a single post by its ID.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "clxxx...",
    "title": "My First Post",
    "content": "This is the content",
    "published": true,
    "authorId": "clyyy...",
    "author": {
      "id": "clyyy...",
      "name": "John Doe",
      "email": "user@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**

- `404`: Post not found

#### Create Post

**POST** `/posts` 🔒

Create a new post.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "title": "My New Post",
  "content": "This is the content of my post",
  "published": true
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "id": "clxxx...",
    "title": "My New Post",
    "content": "This is the content of my post",
    "published": true,
    "authorId": "clyyy...",
    "author": {
      "id": "clyyy...",
      "name": "John Doe",
      "email": "user@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Validation:**

- `title`: String, required
- `content`: String, optional
- `published`: Boolean, optional (default: false)

#### Update Post

**PATCH** `/posts/:id` 🔒

Update an existing post. Only the author can update their posts.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "published": false
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "id": "clxxx...",
    "title": "Updated Title",
    "content": "Updated content",
    "published": false,
    "authorId": "clyyy...",
    "author": {
      "id": "clyyy...",
      "name": "John Doe",
      "email": "user@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

**Errors:**

- `404`: Post not found
- `403`: Not authorized to update this post

#### Delete Post

**DELETE** `/posts/:id` 🔒

Delete a post. Only the author can delete their posts.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

**Errors:**

- `404`: Post not found
- `403`: Not authorized to delete this post

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Window**: 15 minutes
- **Max Requests**: 100 per window

When rate limit is exceeded, the API returns a `429` status code.

## Error Examples

### Validation Error

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "body.email",
      "message": "Invalid email address"
    }
  ]
}
```

### Authentication Error

```json
{
  "success": false,
  "message": "No token provided"
}
```

### Authorization Error

```json
{
  "success": false,
  "message": "You are not authorized to update this post"
}
```

### Not Found Error

```json
{
  "success": false,
  "message": "Post not found"
}
```
