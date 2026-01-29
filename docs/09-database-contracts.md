# DATABASE CONTRACTS
> **STATUS**: FINAL
> **SOURCE**: Derived from `docs/00-canonical-system-spec.md` Section 4

This document defines the STRICT database schema contracts. No service may deviate from this schema without a spec update.

## 1. TABLE LIST & MIGRATION ORDER

The tables must be created in this specific order to satisfy foreign key dependencies:

1.  `organizations`
2.  `users` (depends on organizations)
3.  `projects` (depends on organizations)
4.  `documents` (depends on projects, users)
5.  `document_versions` (depends on documents)
6.  `access_logs` (depends on users, documents)

---

## 2. SCHEMA DEFINITIONS

### 2.1 Table: `organizations`
*   **Owner**: Document Service (Write), Auth Service (Read)
*   **Description**: Tenant isolation boundary.

| Column | Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | NO | `gen_random_uuid()` | Primary Key |
| `name` | TEXT | NO | - | Organization name |
| `slug` | TEXT | NO | - | URL-friendly unique identifier |
| `created_at` | TIMESTAMPTZ | NO | `NOW()` | - |
| `updated_at` | TIMESTAMPTZ | NO | `NOW()` | - |

*   **Constraints**:
    *   PK: `id`
    *   Unique: `slug`

### 2.2 Table: `users`
*   **Owner**: Auth Service
*   **Description**: Identity and profile.

| Column | Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | NO | `gen_random_uuid()` | Primary Key |
| `email` | TEXT | NO | - | User email (login) |
| `password_hash` | TEXT | YES | - | Bcrypt/Argon2 hash (Null for OAuth) |
| `full_name` | TEXT | NO | - | Display name |
| `avatar_url` | TEXT | YES | - | S3 URL for profile picture |
| `role` | TEXT | NO | `'viewer'` | Global role (owner, editor, viewer) |
| `organization_id` | UUID | NO | - | FK to `organizations` |
| `created_at` | TIMESTAMPTZ | NO | `NOW()` | - |
| `updated_at` | TIMESTAMPTZ | NO | `NOW()` | - |

*   **Constraints**:
    *   PK: `id`
    *   FK: `organization_id` -> `organizations.id`
    *   Unique: `email`
    *   Index: `organization_id`, `email`

### 2.3 Table: `projects`
*   **Owner**: Document Service
*   **Description**: Logical grouping of documents (folders/workspaces).

| Column | Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | NO | `gen_random_uuid()` | Primary Key |
| `name` | TEXT | NO | - | Project title |
| `description` | TEXT | YES | - | Optional description |
| `organization_id` | UUID | NO | - | FK to `organizations` |
| `created_by` | UUID | NO | - | FK to `users` |
| `created_at` | TIMESTAMPTZ | NO | `NOW()` | - |
| `updated_at` | TIMESTAMPTZ | NO | `NOW()` | - |

*   **Constraints**:
    *   PK: `id`
    *   FK: `organization_id` -> `organizations.id`
    *   FK: `created_by` -> `users.id`
    *   Index: `organization_id`

### 2.4 Table: `documents`
*   **Owner**: Document Service (Metadata), Collaboration Service (Content)
*   **Description**: The central resource.

| Column | Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | NO | `gen_random_uuid()` | Primary Key |
| `title` | TEXT | NO | `'Untitled'` | Document title |
| `project_id` | UUID | NO | - | FK to `projects` |
| `owner_id` | UUID | NO | - | FK to `users` |
| `yjs_binary_state` | BYTEA | NO | `\x00` | **CRDT TRUTH**. Serialized Y.Doc |
| `last_accessed_at` | TIMESTAMPTZ | NO | `NOW()` | For cache/archival |
| `created_at` | TIMESTAMPTZ | NO | `NOW()` | - |
| `updated_at` | TIMESTAMPTZ | NO | `NOW()` | - |

*   **Constraints**:
    *   PK: `id`
    *   FK: `project_id` -> `projects.id`
    *   FK: `owner_id` -> `users.id`
    *   Index: `project_id`

### 2.5 Table: `document_versions`
*   **Owner**: Document Service
*   **Description**: Immutable history snapshots.

| Column | Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | NO | `gen_random_uuid()` | Primary Key |
| `document_id` | UUID | NO | - | FK to `documents` |
| `snapshot_binary` | BYTEA | NO | - | Y.Doc state at this point |
| `created_by` | UUID | YES | - | User who triggered save |
| `name` | TEXT | YES | - | Optional version label |
| `created_at` | TIMESTAMPTZ | NO | `NOW()` | Timestamp of snapshot |

*   **Constraints**:
    *   PK: `id`
    *   FK: `document_id` -> `documents.id`
    *   FK: `created_by` -> `users.id`
    *   Index: `document_id`, `created_at`

### 2.6 Table: `access_logs`
*   **Owner**: Auth Service / Security
*   **Description**: Audit trail.

| Column | Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | NO | `gen_random_uuid()` | Primary Key |
| `user_id` | UUID | NO | - | FK to `users` |
| `resource_type` | TEXT | NO | - | 'document', 'project', 'auth' |
| `resource_id` | UUID | YES | - | ID of affected resource |
| `action` | TEXT | NO | - | 'read', 'write', 'delete', 'login' |
| `ip_address` | INET | YES | - | Client IP |
| `user_agent` | TEXT | YES | - | Browser/Client info |
| `created_at` | TIMESTAMPTZ | NO | `NOW()` | - |

*   **Constraints**:
    *   PK: `id`
    *   FK: `user_id` -> `users.id`
    *   Index: `user_id`, `created_at`

---

## 3. DATA INVARIANTS (STRICT)

1.  **Immutability of Versions**: Rows in `document_versions` MUST NEVER be updated. Only created or deleted (pruned).
2.  **Binary Truth**: The `yjs_binary_state` column in `documents` is the ONLY authoritative source of document content. Any text/JSON representation elsewhere is a derivative cache.
3.  **Soft Deletes**: Major entities (`documents`, `projects`) should use a `deleted_at` column (omitted above for brevity, but implied by enterprise requirements) or strictly move to an archive table. *For this v2.0 spec, we stick to standard CRUD, but strict Referential Integrity (CASCADE) or checks must be in place.* -> **Decision**: Use `ON DELETE CASCADE` for draft/dev, `RESTRICT` for production safety.
4.  **Org Isolation**: All queries for `projects` and `documents` MUST filter by `organization_id` (via join) to prevent cross-tenant data leaks.
