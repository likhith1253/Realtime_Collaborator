DESIGN FREEZE NOTICE:
This document defines the FINAL UI/UX including design tokens.
Frontend implementation MUST follow this exactly.

# UI CONTRACTS & DESIGN SPECIFICATION
> **STATUS**: FINAL
> **SOURCE**: Derived from `docs/08-api-contracts.md` and `docs/09-database-contracts.md`

This document serves as the **Single Source of Truth** for the UI/UX. It is structured to facilitate direct implementation in the frontend (React/Next.js) and mirrors the structure of a Figma file.

---

## 1. DESIGN SYSTEM (Page: `Design System`)

### 1.1 Colors (Frame: `Colors`)
*   **Primary**: `#2563EB` (Blue 600) - Actions, Active States
*   **Secondary**: `#475569` (Slate 600) - Secondary Actions
*   **Background**: `#FFFFFF` (White) - Main bg
*   **Surface**: `#F8FAFC` (Slate 50) - Sidebars, Cards
*   **Border**: `#E2E8F0` (Slate 200) - Dividers, Inputs
*   **Text Primary**: `#0F172A` (Slate 900) - Headings, Body
*   **Text Secondary**: `#64748B` (Slate 500) - Labels, Hints
*   **Error**: `#EF4444` (Red 500) - Validation, Destructive
*   **Success**: `#22C55E` (Green 500) - Confirmations

### 1.2 Typography (Frame: `Typography`)
*   **Font Family**: `Inter`, system-ui, sans-serif
*   **H1**: 32px / 700 / Tight - Page Titles
*   **H2**: 24px / 600 / Tight - Section Headers
*   **H3**: 20px / 600 / Normal - Card Headers
*   **Body**: 16px / 400 / Normal - Main Content
*   **Small**: 14px / 400 / Normal - Labels, Metadata
*   **Tiny**: 12px / 500 / Normal - Captions

### 1.3 Components (Frame: `Global Components`)

#### Button (`<Button />`)
*   **Props**: `variant` (primary, secondary, outline, ghost, destructive), `size` (sm, md, lg), `loading` (bool), `disabled` (bool)
*   **States**:
    *   **Default**: Visible border/bg.
    *   **Hover**: Darken bg 10%.
    *   **Active**: Darken bg 20%, scale 0.98.
    *   **Disabled**: Opacity 50%, no pointer events.
    *   **Loading**: Show spinner, hide text.

#### Input (`<Input />`)
*   **Props**: `label`, `error`, `placeholder`, `type`
*   **States**:
    *   **Default**: Border slate-200.
    *   **Focus**: Border primary-600, ring-2 primary-100.
    *   **Error**: Border red-500, error text below.
    *   **Disabled**: Bg slate-100, text slate-400.

#### Modal (`<Modal />`)
*   **Structure**: Overlay (fixed, blur), Content (centered, shadow-lg, rounded-lg).
*   **Actions**: Close (X top-right), Primary Action (bottom-right), Cancel (bottom-right).

---

## 2. AUTHENTICATION (Page: `Auth`)

### 2.1 Login Screen (Frame: `Login`)
*   **Route**: `/login`
*   **Layout**: Centered Card on Surface background.
*   **Components**:
    *   **Header**: "Welcome back" (H2).
    *   **Form**:
        *   `Email` (Input, type=email)
        *   `Password` (Input, type=password)
    *   **Actions**:
        *   `Sign In` (Button, Primary, FullWidth). Triggers `POST /auth/login`.
        *   `Forgot Password?` (Link, Secondary).
    *   **Footer**: "Don't have an account? Sign up".
*   **Error States**:
    *   Invalid credentials: Toast error "Invalid email or password".
*   **Success**: Redirect to `/` (Dashboard).

### 2.2 Register Screen (Frame: `Register`)
*   **Route**: `/register`
*   **Layout**: Centered Card.
*   **Components**:
    *   **Header**: "Create an account" (H2).
    *   **Form**:
        *   `Full Name` (Input, text) - Maps to `full_name`.
        *   `Email` (Input, email).
        *   `Password` (Input, password).
    *   **Actions**:
        *   `Create Account` (Button, Primary). Triggers `POST /auth/register`.
*   **Success**: Auto-login -> Redirect to `/onboarding` or `/`.

---

## 3. ORGANIZATION & PROJECTS (Page: `Dashboard`)

### 3.1 Organization Selector (Frame: `OrgSelector`)
*   **Context**: Part of Global Sidebar or Topbar.
*   **Data**: `GET /organizations` (implied or user profile).
*   **UI**: Dropdown showing available orgs.
*   **Actions**:
    *   Select Org -> Switch Context.
    *   `+ Create Organization` -> Opens Modal 3.2.

### 3.2 Create Organization Modal (Frame: `CreateOrgModal`)
*   **Trigger**: From Org Selector.
*   **Form**:
    *   `Organization Name` (Input).
    *   `Slug` (Input, auto-generated from name).
*   **Action**: `Create` (Primary). Triggers `POST /organizations`.

### 3.3 Dashboard / Project List (Frame: `ProjectList`)
*   **Route**: `/` or `/org/:slug`
*   **Data**: `GET /projects?organization_id=...` implied (API 3.1 lists create, need list endpoint - *FLAG: API Contract 3.x only shows Create Project. Assuming GET /projects exists per Phased Plan Phase B.3*).
*   **Layout**: Grid of Project Cards.
*   **Components**:
    *   **Header**: "Projects" (H2) + `New Project` (Button, Primary).
    *   **Empty State**: "No projects yet. Create one to get started."
    *   **Card**:
        *   Title (H3).
        *   Description (Body, truncated).
        *   Meta: "Created by [User]" (Small).
        *   Click -> Navigates to `/project/:id`.

### 3.4 Create Project Modal (Frame: `CreateProjectModal`)
*   **Form**:
    *   `Name` (Input).
    *   `Description` (Textarea).
*   **Action**: `Create` (Primary). Triggers `POST /projects`.

---

## 4. DOCUMENT WORKSPACE (Page: `Workspace`)

### 4.1 Document List (Frame: `DocList`)
*   **Route**: `/project/:id`
*   **Data**: `GET /documents?project_id=...` (Need to verify API support for list. *FLAG: API 3.4 is GET single doc. Assuming list endpoint exists*).
*   **Layout**: List view (Table-like).
*   **Columns**: Title, Owner, Last Modified, Actions.
*   **Action**: `+ New Document` (Button). Triggers `POST /documents`.

### 4.2 Document Editor (Frame: `Editor`)
*   **Route**: `/doc/:id`
*   **Structure**:
    *   **Top Bar**:
        *   Breadcrumbs (Org > Project > Doc).
        *   **Title** (Editable Input). On blur -> `PUT /documents/:id` (Wait, API only has Save Version? *FLAG: Title update needs endpoint or Yjs sync*).
        *   **Presence Avatars**: Row of active users (Source: WebSocket `awareness`).
        *   **Share** (Button).
    *   **Sidebar (Left)**:
        *   Navigation / File Tree (if applicable).
    *   **Canvas (Center)**:
        *   **TipTap/ProseMirror Container**.
        *   Syncs via `ws://.../socket.io` (API Section 4).
    *   **AI Panel (Floating/Right)** - *See Section 5*.
*   **States**:
    *   **Loading**: Skeleton loader for text.
    *   **Saving**: "Saving..." indicator in Top Bar.
    *   **Offline**: "Offline - Changes saved locally" banner.

### 4.3 Version History (Frame: `VersionHistory`)
*   **Trigger**: Top Bar > "Last saved..." or Menu > History.
*   **UI**: Sidebar overlay.
*   **List**:
    *   Items: "v1.0", "Draft", timestamps.
    *   Data: `GET /documents/:id/versions` (*FLAG: Missing in API Spec, but Create Version exists*).
*   **Action**: `Create Version` (Button). Triggers `POST /documents/:id/versions`.
    *   Input: "Version Name".

---

## 5. AI INTERACTION (Page: `AI`)

### 5.1 AI Sidebar / Chat (Frame: `AIChat`)
*   **Components**:
    *   **History**: List of previous Q&A.
    *   **Input Area**: Textarea + "Send" (Icon Button).
    *   **Context Indicator**: "Using context: Project Marketing Q1".
*   **Action**: `POST /ai/generate`.
    *   Payload: `{ prompt, context: { ... } }`.
*   **Response**: Streaming text block.

### 5.2 Helper / Slash Command (Frame: `SlashCommand`)
*   **Trigger**: User types `/ai` in Editor.
*   **UI**: Popover menu near cursor.
*   **Options**: "Summarize", "Fix Grammar", "Expand".
*   **Action**: Inserts generated text directly into Editor at cursor.

---

## 6. PERMISSIONS & ACCESSIBILITY

### 6.1 Role Variants
*   **Viewer**:
    *   Editor: Read-only mode. No typing allowed.
    *   Top Bar: "View Only" badge.
    *   Project List: Hide "New Project" button.
*   **Editor**:
    *   Full access to Modify content.
    *   Can create Versions.
*   **Owner**:
    *   Can Delete Project/Doc (*FLAG: Delete endpoints missing in API*).
    *   Can Manage Settings.

### 6.2 Accessibility Standards
*   **Focus**: All inputs and buttons must have visible `:focus-visible` ring.
*   **Keyboard**:
    *   `Esc` closes Modals.
    *   `Enter` submits forms.
    *   `Cmd+S` triggers Version Save (if manual) or shows "Saved".
*   **Contrast**: Text must meet WCAG AA (4.5:1). using Slate-500/900 on White achieves this.
*   **ARIA**:
    *   Modals: `role="dialog"`, `aria-modal="true"`.
    *   Inputs: `aria-invalid` on errors.
    *   Buttons: `aria-busy` when loading.

---

## 7. MISSING API FLAGS (Action Required)
*   **Project List**: `GET /projects` (assumed).
*   **Document List**: `GET /documents` (assumed).
*   **Document Update**: Updating Title (`PATCH /documents/:id`) or handling via Yjs?
*   **Version List**: `GET /documents/:id/versions` needed to display history.
*   **Delete**: `DELETE` endpoints for Docs/Projects.

*The UI will implement these assuming standard REST patterns until API is updated.*
