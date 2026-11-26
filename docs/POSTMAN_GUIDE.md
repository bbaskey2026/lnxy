# Postman Guide

Set an environment variable:

```text
baseUrl = http://localhost:4000/api/v1
```

## Dashboard login

1. Send `POST {{baseUrl}}/user/auth/dashboard`.
2. Copy `data.accessToken`.
3. Set the `Authorization` header to `<accessToken>`; the `Bearer ` prefix is optional.
4. Send requests to protected routes.

`POST {{baseUrl}}/auth/dashboard`, `POST {{baseUrl}}/auth/login`, and `POST {{baseUrl}}/user/auth/login` remain available as compatibility aliases.

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
