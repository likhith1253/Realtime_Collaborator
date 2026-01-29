# API CONTRACTS
> **STATUS**: FINAL
> **SOURCE**: Derived from `docs/00-canonical-system-spec.md` and `docs/01-phased-execution-plan.md`

This document defines the STRICT API contracts. All services must adhere to these definitions.

## 1. GENERAL API STANDARDS

*   **Base URL**: `/api/v1`
*   **Content-Type**: `application/json`
*   **Date Format**: ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`)
*   **Authentication**: Bearer Token (JWT) in `Authorization` header.

### 1.1 Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

---

## 2. AUTH SERVICE (`/auth`)

### 2.1 Register User
*   **Method**: `POST`
*   **URL**: `/auth/register`
*   **Auth Required**: No
*   **Scopes**: None
*   **Idempotency**: No

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "strongPassword123",
  "full_name": "John Doe"
}
```

**Response Body (201 Created)**:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "viewer"
  },
  "token": "jwt_access_token",
  "refresh_token": "jwt_refresh_token"
}
```

### 2.2 Login
*   **Method**: `POST`
*   **URL**: `/auth/login`
*   **Auth Required**: No
*   **Scopes**: None
*   **Idempotency**: No

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "strongPassword123"
}
```

**Response Body (200 OK)**:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "avatar_url": "https://..."
  },
  "token": "jwt_access_token",
  "refresh_token": "jwt_refresh_token"
}
```

### 2.3 Refresh Token
*   **Method**: `POST`
*   **URL**: `/auth/refresh`
*   **Auth Required**: No (Uses Refresh Token)
*   **Scopes**: None

**Request Body**:
```json
{
  "refresh_token": "jwt_refresh_token"
}
```

**Response Body (200 OK)**:
```json
{
  "token": "new_jwt_access_token",
  "refresh_token": "new_jwt_refresh_token"
}
```

---

## 3. DOCUMENT SERVICE (`/documents`, `/projects`, `/organizations`)

### 3.1 Create Organization
*   **Method**: `POST`
*   **URL**: `/organizations`
*   **Auth Required**: Yes
*   **Scopes**: `org:write`

**Request Body**:
```json
{
  "name": "Acme Corp",
  "slug": "acme-corp"
}
```

**Response Body (201 Created)**:
```json
{
  "id": "uuid",
  "name": "Acme Corp",
  "slug": "acme-corp",
  "created_at": "timestamp"
}
```

### 3.2 Create Project
*   **Method**: `POST`
*   **URL**: `/projects`
*   **Auth Required**: Yes
*   **Scopes**: `project:write`

**Request Body**:
```json
{
  "name": "Marketing Q1",
  "description": "Campaign docs",
  "organization_id": "uuid"
}
```

**Response Body (201 Created)**:
```json
{
  "id": "uuid",
  "name": "Marketing Q1",
  "created_by": "user_uuid"
}
```

### 3.3 Create Document
*   **Method**: `POST`
*   **URL**: `/documents`
*   **Auth Required**: Yes
*   **Scopes**: `doc:write`

**Request Body**:
```json
{
  "title": "Strategy Draft",
  "project_id": "uuid"
}
```

**Response Body (201 Created)**:
```json
{
  "id": "uuid",
  "title": "Strategy Draft",
  "owner_id": "user_uuid",
  "created_at": "timestamp"
}
```

### 3.4 Get Document
*   **Method**: `GET`
*   **URL**: `/documents/:id`
*   **Auth Required**: Yes
*   **Scopes**: `doc:read`

**Response Body (200 OK)**:
```json
{
  "id": "uuid",
  "title": "Strategy Draft",
  "content": { ... }, // Initial JSON content (ProseMirror JSON)
  "updated_at": "timestamp"
}
```

### 3.5 Save Version
*   **Method**: `POST`
*   **URL**: `/documents/:id/versions`
*   **Auth Required**: Yes
*   **Scopes**: `doc:write`

**Request Body**:
```json
{
  "name": "v1.0 Final"
}
```

**Response Body (201 Created)**:
```json
{
  "id": "uuid",
  "name": "v1.0 Final",
  "created_at": "timestamp"
}
```

### 3.6 List Organizations
*   **Method**: `GET`
*   **URL**: `/organizations`
*   **Auth Required**: Yes
*   **Scopes**: `org:read`

**Response Body (200 OK)**:
```json
{
  "organizations": [
    {
      "id": "uuid",
      "name": "Acme Corp",
      "slug": "acme-corp",
      "role": "owner"
    }
  ]
}
```

### 3.7 List Projects
*   **Method**: `GET`
*   **URL**: `/projects`
*   **Auth Required**: Yes
*   **Scopes**: `project:read`

**Query Parameters**:
*   `organization_id`: Filter by organization (Required)

**Response Body (200 OK)**:
```json
{
  "projects": [
    {
      "id": "uuid",
      "name": "Marketing Q1",
      "description": "Campaign docs",
      "created_by": "user_uuid",
      "created_at": "timestamp"
    }
  ]
}
```

### 3.8 Delete Project
*   **Method**: `DELETE`
*   **URL**: `/projects/:id`
*   **Auth Required**: Yes
*   **Scopes**: `project:delete`

**Response Body (200 OK)**:
```json
{
  "success": true
}
```

### 3.9 List Documents
*   **Method**: `GET`
*   **URL**: `/documents`
*   **Auth Required**: Yes
*   **Scopes**: `doc:read`

**Query Parameters**:
*   `project_id`: Filter by project (Required)

**Response Body (200 OK)**:
```json
{
  "documents": [
    {
      "id": "uuid",
      "title": "Strategy Draft",
      "owner_id": "user_uuid",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

### 3.10 Update Document
*   **Method**: `PATCH`
*   **URL**: `/documents/:id`
*   **Auth Required**: Yes
*   **Scopes**: `doc:write`

**Request Body**:
```json
{
  "title": "New Title"
}
```

**Response Body (200 OK)**:
```json
{
  "id": "uuid",
  "title": "New Title",
  "updated_at": "timestamp"
}
```

### 3.11 Delete Document
*   **Method**: `DELETE`
*   **URL**: `/documents/:id`
*   **Auth Required**: Yes
*   **Scopes**: `doc:delete`

**Response Body (200 OK)**:
```json
{
  "success": true
}
```

### 3.12 Get Document Versions
*   **Method**: `GET`
*   **URL**: `/documents/:id/versions`
*   **Auth Required**: Yes
*   **Scopes**: `doc:read`

**Response Body (200 OK)**:
```json
{
  "versions": [
    {
      "id": "uuid",
      "name": "v1.0 Final",
      "created_at": "timestamp",
      "created_by": "user_uuid"
    }
  ]
}
```

---

## 4. COLLABORATION SERVICE (WebSocket)

*   **Endpoint**: `/socket.io`
*   **Transport**: WebSocket
*   **Auth**: JWT in Handshake (Query param `token` or Header)

### 4.1 Client -> Server Events

| Event | Payload | Description |
| :--- | :--- | :--- |
| `join-document` | `{ "docId": "uuid" }` | Request to join a document room. |
| `sync-step-1` | `Uint8Array` | Yjs State Vector (What I have). |
| `sync-step-2` | `Uint8Array` | Yjs Update (What I need). |
| `update` | `Uint8Array` | Incremental document update. |
| `awareness` | `{ "cursor": {...}, "user": {...} }` | Ephemeral presence data. |

### 4.2 Server -> Client Events

| Event | Payload | Description |
| :--- | :--- | :--- |
| `sync-step-1` | `Uint8Array` | Server's State Vector. |
| `sync-step-2` | `Uint8Array` | Server's missing updates. |
| `update` | `Uint8Array` | Broadcasted update from other peers. |
| `awareness` | `Array<UserAwareness>` | List of active users in the room. |

---

## 5. AI SERVICE (`/ai`)

### 5.1 Generate Text
*   **Method**: `POST`
*   **URL**: `/ai/generate`
*   **Auth Required**: Yes
*   **Scopes**: `ai:generate`
*   **Idempotency**: Key Recommended `Idempotency-Key`

**Request Body**:
```json
{
  "prompt": "Write a summary of...",
  "context": {
    "project_id": "uuid",
    "previous_text": "...",
    "tone": "professional"
  },
  "model_preference": "fast" // or "quality"
}
```

**Response Body (200 OK)**:
```json
{
  "text": "Here is the summary...",
  "usage": {
    "tokens": 150,
    "cost_estimate": 0.002
  }
}
```

---

## 6. SEARCH SERVICE (`/search`)

### 6.1 Search
*   **Method**: `GET`
*   **URL**: `/search`
*   **Auth Required**: Yes
*   **Scopes**: `search:read`

**Query Parameters**:
*   `q`: Search query string
*   `type`: Filter (document, project) - Optional

**Response Body (200 OK)**:
```json
{
  "results": [
    {
      "id": "uuid",
      "type": "document",
      "title": "Strategy Draft",
      "snippet": "...targeted marketing strategy...",
      "score": 0.95
    }
  ]
}
```

---

## 7. EXPORT SERVICE (`/export`)

### 7.1 Export Document
*   **Method**: `POST`
*   **URL**: `/export/:document_id`
*   **Auth Required**: Yes
*   **Scopes**: `doc:read`

**Request Body**:
```json
{
  "format": "pdf" // "pdf", "docx", "markdown"
}
```

**Response Body (200 OK)**:
```json
{
  "download_url": "https://s3.aws.com/exports/..."
}
```
