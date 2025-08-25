# API Documentation

Vollständige API-Dokumentation für das Prometheus Feedback Tool.

## 🚀 Base URL

```
Production: https://your-domain.com/api
Development: http://localhost:3001/api
```

## 🔐 Authentication

Die API verwendet JWT-Token für Admin-Authentifizierung.

### Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## 📝 Endpoints

### 1. Feedback Endpoints

#### GET /api/questions
Ruft alle aktiven Fragen ab.

**Request:**
```http
GET /api/questions
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "question_text": "Wie bewerten Sie die VBT Funktionen?",
      "question_type": "rating",
      "category": "features",
      "order_index": 1,
      "options": null
    }
  ]
}
```

**Status Codes:**
- `200` - Erfolgreich
- `500` - Server Fehler

---

#### POST /api/feedback/session
Erstellt eine neue Feedback-Session.

**Request:**
```http
POST /api/feedback/session
Content-Type: application/json

{
  "userEmail": "user@example.com" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

**Status Codes:**
- `201` - Session erstellt
- `400` - Ungültige Anfrage
- `500` - Server Fehler

---

#### POST /api/feedback/response
Übermittelt eine Antwort für eine Session.

**Request:**
```http
POST /api/feedback/response
Content-Type: application/json

{
  "sessionId": "123e4567-e89b-12d3-a456-426614174000",
  "questionId": "456e7890-e89b-12d3-a456-426614174000",
  "response": "Sehr gut implementiert!",
  "rating": 4
}
```

**Validation Rules:**
- `sessionId`: Required, valid UUID
- `questionId`: Required, valid UUID
- `response`: Optional string (max 1000 chars)
- `rating`: Optional integer (1-5)
- At least one of `response` or `rating` required

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "789e0123-e89b-12d3-a456-426614174000"
  }
}
```

**Status Codes:**
- `201` - Antwort gespeichert
- `400` - Validation Fehler
- `404` - Session/Question nicht gefunden
- `409` - Antwort bereits vorhanden
- `500` - Server Fehler

---

#### PUT /api/feedback/session/:sessionId/complete
Schließt eine Feedback-Session ab.

**Request:**
```http
PUT /api/feedback/session/123e4567-e89b-12d3-a456-426614174000/complete
```

**Response:**
```json
{
  "success": true,
  "data": {
    "completed": true,
    "completedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Status Codes:**
- `200` - Session abgeschlossen
- `404` - Session nicht gefunden
- `400` - Session bereits abgeschlossen
- `500` - Server Fehler

---

### 2. Admin Authentication

#### POST /api/admin/login
Admin-Anmeldung mit E-Mail und Passwort.

**Request:**
```http
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@company.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

**Status Codes:**
- `200` - Anmeldung erfolgreich
- `401` - Ungültige Anmeldedaten
- `429` - Zu viele Versuche
- `500` - Server Fehler

---

#### POST /api/admin/verify
Überprüft ein JWT-Token.

**Request:**
```http
POST /api/admin/verify
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "email": "admin@company.com"
  }
}
```

**Status Codes:**
- `200` - Token gültig
- `401` - Token ungültig/abgelaufen
- `500` - Server Fehler

---

### 3. Analytics Endpoints

> 🔒 **Alle Analytics-Endpoints erfordern Admin-Authentifizierung**

#### GET /api/analytics/summary
Ruft Zusammenfassung der Analytics ab.

**Request:**
```http
GET /api/analytics/summary
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSessions": 1250,
    "completedSessions": 987,
    "avgCompletionRate": 78.96,
    "avgRating": 4.2,
    "totalResponses": 8745,
    "timeRange": {
      "start": "2024-01-01T00:00:00Z",
      "end": "2024-01-15T23:59:59Z"
    }
  }
}
```

---

#### GET /api/analytics/categories
Analytics nach Kategorien aufgeschlüsselt.

**Request:**
```http
GET /api/analytics/categories
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "category": "features",
      "questionCount": 3,
      "avgRating": 4.1,
      "totalResponses": 2850,
      "positivePercentage": 82.5
    },
    {
      "category": "performance",
      "questionCount": 2,
      "avgRating": 3.8,
      "totalResponses": 1920,
      "positivePercentage": 76.2
    }
  ]
}
```

---

#### GET /api/analytics/trends
Zeitbasierte Trend-Daten.

**Query Parameters:**
- `period`: `day`, `week`, `month` (default: `week`)
- `days`: Anzahl Tage zurück (default: 30)

**Request:**
```http
GET /api/analytics/trends?period=day&days=7
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-15",
      "sessions": 45,
      "completions": 38,
      "avgRating": 4.3,
      "completionRate": 84.4
    },
    {
      "date": "2024-01-14",
      "sessions": 52,
      "completions": 41,
      "avgRating": 4.1,
      "completionRate": 78.8
    }
  ]
}
```

---

#### GET /api/analytics/questions/:questionId
Detaillierte Analytics für eine spezifische Frage.

**Request:**
```http
GET /api/analytics/questions/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "questionId": "123e4567-e89b-12d3-a456-426614174000",
    "questionText": "Wie bewerten Sie die VBT Funktionen?",
    "category": "features",
    "totalResponses": 987,
    "avgRating": 4.2,
    "ratingDistribution": {
      "1": 23,
      "2": 45,
      "3": 156,
      "4": 312,
      "5": 451
    },
    "positiveCount": 763,
    "negativeCount": 68,
    "neutralCount": 156,
    "positivePercentage": 77.3,
    "responseRate": 89.2,
    "recentResponses": [
      {
        "rating": 5,
        "response": "Exzellente VBT Implementation!",
        "createdAt": "2024-01-15T14:30:00Z"
      }
    ]
  }
}
```

---

#### GET /api/analytics/export
Exportiert alle Analytics-Daten.

**Query Parameters:**
- `format`: `json`, `csv` (default: `json`)
- `startDate`: ISO date string (optional)
- `endDate`: ISO date string (optional)

**Request:**
```http
GET /api/analytics/export?format=csv&startDate=2024-01-01
Authorization: Bearer <jwt_token>
```

**Response (JSON):**
```json
{
  "success": true,
  "data": {
    "summary": { /* ... */ },
    "sessions": [ /* ... */ ],
    "responses": [ /* ... */ ],
    "questions": [ /* ... */ ]
  }
}
```

**Response (CSV):**
```csv
sessionId,userEmail,status,createdAt,completedAt,questionText,rating,response
123e4567...,user@example.com,completed,2024-01-15T10:00:00Z,2024-01-15T10:05:00Z,"Wie bewerten Sie...",4,"Sehr gut"
```

---

### 4. Admin Management

#### GET /api/admin/sessions
Ruft alle Sessions für Admin-Dashboard ab.

**Query Parameters:**
- `page`: Seitennummer (default: 1)
- `limit`: Items pro Seite (default: 20, max: 100)
- `status`: `pending`, `completed`, `all` (default: `all`)
- `sortBy`: `created_at`, `completed_at`, `avg_rating` (default: `created_at`)
- `order`: `asc`, `desc` (default: `desc`)

**Request:**
```http
GET /api/admin/sessions?page=1&limit=20&status=completed&sortBy=created_at&order=desc
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "userEmail": "user@example.com",
        "status": "completed",
        "createdAt": "2024-01-15T10:00:00Z",
        "completedAt": "2024-01-15T10:05:00Z",
        "responseCount": 8,
        "avgRating": 4.2,
        "completionTimeMinutes": 5.2
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 12,
      "totalItems": 240,
      "itemsPerPage": 20,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

#### GET /api/admin/sessions/:sessionId
Detaillierte Session-Informationen.

**Request:**
```http
GET /api/admin/sessions/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "userEmail": "user@example.com",
      "status": "completed",
      "createdAt": "2024-01-15T10:00:00Z",
      "completedAt": "2024-01-15T10:05:00Z"
    },
    "responses": [
      {
        "id": "789e0123-e89b-12d3-a456-426614174000",
        "questionText": "Wie bewerten Sie die VBT Funktionen?",
        "category": "features",
        "rating": 4,
        "response": "Sehr gute Implementation",
        "createdAt": "2024-01-15T10:02:00Z"
      }
    ]
  }
}
```

---

#### GET /api/admin/questions
Verwaltet Fragen (Admin).

**Request:**
```http
GET /api/admin/questions
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "questionText": "Wie bewerten Sie die VBT Funktionen?",
      "questionType": "rating",
      "category": "features",
      "isActive": true,
      "orderIndex": 1,
      "options": null,
      "createdAt": "2024-01-01T00:00:00Z",
      "responseCount": 987,
      "avgRating": 4.2
    }
  ]
}
```

---

#### PUT /api/admin/questions/:questionId
Aktualisiert eine Frage.

**Request:**
```http
PUT /api/admin/questions/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "questionText": "Neue Frage Text",
  "isActive": false,
  "orderIndex": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "updated": true
  }
}
```

## 🚫 Error Responses

Alle Endpoints können die folgenden Fehler zurückgeben:

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "rating",
        "message": "Rating must be between 1 and 5"
      }
    ]
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing authentication token"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Access denied"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### 409 Conflict
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Response already exists for this question in this session"
  }
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests, please try again later",
    "retryAfter": 60
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

## 📊 Rate Limits

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Public API | 100 requests | 15 minutes |
| Admin Login | 5 attempts | 15 minutes |
| Admin API | 1000 requests | 15 minutes |
| Feedback Submit | 10 submissions | 15 minutes |

## 🔧 Status Codes Reference

| Code | Bedeutung | Verwendung |
|------|-----------|------------|
| 200 | OK | Erfolgreiche GET/PUT Anfrage |
| 201 | Created | Erfolgreiche POST Anfrage |
| 400 | Bad Request | Validation Fehler |
| 401 | Unauthorized | Authentication erforderlich |
| 403 | Forbidden | Keine Berechtigung |
| 404 | Not Found | Resource nicht gefunden |
| 409 | Conflict | Resource Konflikt |
| 429 | Too Many Requests | Rate Limit überschritten |
| 500 | Internal Server Error | Server Fehler |

## 🧪 Testing

### cURL Examples

#### Feedback Session erstellen
```bash
curl -X POST http://localhost:3001/api/feedback/session \
  -H "Content-Type: application/json" \
  -d '{"userEmail": "test@example.com"}'
```

#### Antwort übermitteln
```bash
curl -X POST http://localhost:3001/api/feedback/response \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "123e4567-e89b-12d3-a456-426614174000",
    "questionId": "456e7890-e89b-12d3-a456-426614174000",
    "rating": 4,
    "response": "Sehr gute Features!"
  }'
```

#### Admin Login
```bash
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "secure_password"
  }'
```

#### Analytics abrufen
```bash
curl -X GET http://localhost:3001/api/analytics/summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📚 SDK Examples

### JavaScript/React
```javascript
// Feedback API Client
class FeedbackAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async createSession(userEmail) {
    const response = await fetch(`${this.baseURL}/feedback/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail })
    });
    return response.json();
  }

  async submitResponse(sessionId, questionId, rating, response) {
    const res = await fetch(`${this.baseURL}/feedback/response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, questionId, rating, response })
    });
    return res.json();
  }
}

// Usage
const api = new FeedbackAPI('http://localhost:3001/api');
const session = await api.createSession('user@example.com');
```

### Python
```python
import requests

class PrometheusAPI:
    def __init__(self, base_url):
        self.base_url = base_url
        self.token = None
    
    def login(self, email, password):
        response = requests.post(f"{self.base_url}/admin/login", json={
            'email': email,
            'password': password
        })
        data = response.json()
        if data['success']:
            self.token = data['data']['token']
        return data
    
    def get_analytics(self):
        headers = {'Authorization': f'Bearer {self.token}'}
        response = requests.get(f"{self.base_url}/analytics/summary", headers=headers)
        return response.json()

# Usage
api = PrometheusAPI('http://localhost:3001/api')
api.login('admin@company.com', 'password')
analytics = api.get_analytics()
```

Diese API-Dokumentation bietet eine vollständige Referenz für alle verfügbaren Endpoints und deren Verwendung.
