# Application Issues Audit

## Issue 1: Sign Up Fails due to Field Mismatch

**Area:** Auth

**Steps to Reproduce:**
1. Navigate to Sign Up page.
2. Enter Name, Email, Password, Confirm Password.
3. Click "Create Account".

**Expected Behavior:**
- Account is created and user is redirected to dashboard or sign in.

**Actual Behavior:**
- API returns 400 Bad Request.
- Investigation shows frontend sends `name` but backend expects `full_name`.

**Severity:** Critical

---

## Issue 2: Dashboard Fails to Load Projects

**Area:** Projects

**Steps to Reproduce:**
1. Sign in with a valid account.
2. Land on Dashboard (`/dashboard`).

**Expected Behavior:**
- List of projects is displayed.

**Actual Behavior:**
- UI shows "Failed to load projects".
- Projects list remains empty.

**Severity:** Critical

---

## Issue 3: Project Creation Does Not Update UI

**Area:** Projects

**Steps to Reproduce:**
1. On Dashboard, click "New Project".
2. Enter project name and submit.

**Expected Behavior:**
- Modal closes, project list refreshes, and new project appears.

**Actual Behavior:**
- Project creation seems to succeed silently (or fails silently), but the project list is not updated.
- "Failed to load projects" error persists.

**Severity:** High

---

## Issue 4: Documents "New" Button Unresponsive

**Area:** Documents

**Steps to Reproduce:**
1. Navigate to Documents page (e.g., `/dashboard/documents`).
2. Click "+ New" button.

**Expected Behavior:**
- A new document is created or a creation modal appears.

**Actual Behavior:**
- Button click triggers no action.
- Console logs might indicate errors.

**Severity:** High

---

## Issue 5: Missing Sidebar Links (PPT, Canvas)

**Area:** Navigation

**Steps to Reproduce:**
1. Look at the application sidebar.

**Expected Behavior:**
- Links for "Presentations" and "Canvas" should be visible.

**Actual Behavior:**
- Links are missing entirely.

**Severity:** High

---

## Issue 6: 404 Errors on Feature Modules

**Area:** PPT / Canvas

**Steps to Reproduce:**
1. Manually navigate to `/dashboard/presentations` or `/dashboard/canvas`.

**Expected Behavior:**
- Respective feature modules should load.

**Actual Behavior:**
- Page returns 404 Not Found.

**Severity:** Critical

---

## Issue 7: Broken Settings and Team Links

**Area:** Navigation

**Steps to Reproduce:**
1. Click "Team" or "Settings" in the sidebar.

**Expected Behavior:**
- Settings/Team pages load.

**Actual Behavior:**
- Returns 404 Not Found.

**Severity:** Medium

---

## Issue 8: Console Errors 404s

**Area:** UI

**Steps to Reproduce:**
1. Open Browser Console.
2. Navigate effectively anywhere in the app.

**Expected Behavior:**
- Clean console with no red errors.

**Actual Behavior:**
- Multiple 404 errors for resources and API calls logged.

**Severity:** Medium
