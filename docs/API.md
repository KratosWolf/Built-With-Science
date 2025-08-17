# API Documentation

## Overview

Built With Science API provides endpoints for managing scientific data, research projects, and user interactions.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Staging**: `https://staging.builtwithscience.com/api`
- **Production**: `https://builtwithscience.com/api`

## Authentication

All API endpoints require authentication using Stack Auth.

```typescript
// Example authenticated request
const response = await fetch('/api/projects', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## Endpoints

### Projects

#### GET /api/projects
Get all projects for the authenticated user.

**Response:**
```json
{
  "projects": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

#### POST /api/projects
Create a new project.

**Request Body:**
```json
{
  "title": "string",
  "description": "string"
}
```

#### GET /api/projects/[id]
Get a specific project by ID.

#### PUT /api/projects/[id]
Update a specific project.

#### DELETE /api/projects/[id]
Delete a specific project.

### Research Data

#### GET /api/research
Get research data with optional filtering.

**Query Parameters:**
- `category` - Filter by research category
- `limit` - Number of results (default: 20)
- `offset` - Pagination offset

#### POST /api/research
Submit new research data.

### User Management

#### GET /api/user/profile
Get current user profile.

#### PUT /api/user/profile
Update user profile.

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

### Common Error Codes

- `UNAUTHORIZED` - Invalid or missing authentication
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid request data
- `INTERNAL_ERROR` - Server error

## Rate Limiting

- **Authenticated requests**: 1000 requests per hour
- **Unauthenticated requests**: 100 requests per hour

## Examples

### JavaScript/TypeScript
```typescript
// Get projects
const projects = await fetch('/api/projects', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(res => res.json());

// Create project
const newProject = await fetch('/api/projects', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'My Research Project',
    description: 'Description of the project'
  })
}).then(res => res.json());
```

### cURL
```bash
# Get projects
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://builtwithscience.com/api/projects

# Create project
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title":"My Project","description":"Project description"}' \
     https://builtwithscience.com/api/projects
```

## Webhooks

Configure webhooks to receive real-time updates:

### Endpoint
`POST /api/webhooks/[event]`

### Events
- `project.created`
- `project.updated`
- `research.submitted`

### Payload
```json
{
  "event": "project.created",
  "data": {
    "id": "project_id",
    "title": "Project Title"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```
