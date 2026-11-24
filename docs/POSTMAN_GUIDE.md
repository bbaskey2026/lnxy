# Postman Guide

Set an environment variable:

```text
baseUrl = http://localhost:4000/api
```

## Login

1. Send `POST {{baseUrl}}/auth/login`.
2. Copy `data.accessToken`.
3. Set the `Authorization` header to `Bearer <accessToken>`.
4. Send requests to protected routes.

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Student | aarav@example.com | student123 |
| Instructor | instructor@exampro.com | instructor123 |
| Admin | admin@exampro.com | admin123 |

## Example response

```json
{
  "success": true,
  "data": {}
}
```
