# Application Issues Audit

## Issue 1: Sign Up Silent Failure

**Area:** Auth

**Steps to Reproduce:**
1. Navigate to `/auth/sign-up`.
2. Fill in valid details for a new user.
3. Click "Create Account".

**Expected Behavior:**
- User is redirected to `/dashboard` or `/auth/sign-in`.
- Success message appears.

**Actual Behavior:**
- No visual feedback or redirection.
- Form remains filled but unresponsive.
- Account is not created.

**Severity:** Critical

## Issue 2: Dashboard/Routes Unprotected

**Area:** Auth

**Steps to Reproduce:**
1. Navigate directly to `/dashboard` without logging in.

**Expected Behavior:**
- Redirect to `/auth/sign-in`.

**Actual Behavior:**
- Dashboard loads successfully.
- User is logged in as "Jane Doe" (Default/Mock User).

**Severity:** Critical

## Issue 3: Logout Broken

**Area:** Auth

**Steps to Reproduce:**
1. On Dashboard, click User Avatar/Logout button.

**Expected Behavior:**
- Session clears.
- Redirect to Sign In or Landing page.

**Actual Behavior:**
- No action occurs.
- User remains on Dashboard.

**Severity:** High

## Issue 4: Project Creation Failure

**Area:** Projects

**Steps to Reproduce:**
1. On Dashboard, click "New Project".
2. Enter name "Test" and click "Create".

**Expected Behavior:**
- Project is created and appears in list.
- Redirects to project details.

**Actual Behavior:**
- Redirects to a project page (e.g. `/projects/xyz`).
- Shows "Failed to load project details".
- Console shows 500 Internal Server Error.
- Project does not persist/appear in Dashboard list.

**Severity:** Critical

## Issue 5: Documents "New" Button Unresponsive

**Area:** Documents

**Steps to Reproduce:**
1. Navigate to `/dashboard/documents`.
2. Click the "+ New" button.

**Expected Behavior:**
- A modal appears to create a document, or directly creates one.

**Actual Behavior:**
- Button click is completely ignored.
- No UI feedback or action.

**Severity:** High

## Issue 6: Presentations Feature Missing

**Area:** PPT

**Steps to Reproduce:**
1. Navigate to `/dashboard/presentations`.
2. Observe page content.

**Expected Behavior:**
- Presentations list or creation options available.

**Actual Behavior:**
- Page displays "This feature is coming soon!".
- Feature is effectively unimplemented/inaccessible.

**Severity:** High

## Issue 7: Canvas Feature Missing

**Area:** Canvas

**Steps to Reproduce:**
1. Navigate to `/dashboard/canvas`.
2. Observe page content.

**Expected Behavior:**
- Canvas list or creation options available.

**Actual Behavior:**
- Page displays "Coming soon!".
- Feature is effectively unimplemented/inaccessible.

**Severity:** High

## Issue 8: Realtime Verification Blocked

**Area:** Realtime

**Steps to Reproduce:**
1. Attempt to sync two tabs.

**Expected Behavior:**
- Changes in one tab reflect in another.

**Actual Behavior:**
- Cannot test because document/canvas creation (Issues 4, 5, 7) prevents accessing the editor.

**Severity:** Medium
