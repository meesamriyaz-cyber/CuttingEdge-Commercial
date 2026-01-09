# Government Client Verification Flow Test

## Test Scenario: Post-Login Verification

### 1. Government Client Registration

- Register a new government client with valid details
- Verify that verification code is generated and sent to official email
- Verify that account status is set to "PENDING"

### 2. Government Client Login (Before Verification)

- Login with government client credentials
- Verify that login succeeds but returns `verificationRequired: true`
- Verify that user is redirected to `/verify-account` page

### 3. Post-Login Verification

- Enter the verification code received via email
- Verify that verification succeeds
- Verify that user state is updated with `govtValidationStatus: "VERIFIED"`
- Verify that user is redirected to `/enquiries` page

### 4. Access to Enquiry Form (After Verification)

- Navigate to product page and click "Submit Enquiry"
- Verify that enquiry form loads normally (no verification required message)
- Submit enquiry successfully

### 5. Access to Enquiry Form (Before Verification)

- Login as government client (not verified)
- Navigate to product page and click "Submit Enquiry"
- Verify that verification required message is shown
- Verify that "Complete Verification" button redirects to `/verify-account`

## Implementation Summary

### Backend Changes:

1. **Modified `login` controller** in `backend/src/controllers/auth.controller.js`:
   - Added check for government clients with pending verification
   - Returns `verificationRequired: true` in response for unverified government clients

### Frontend Changes:

1. **Created `PostLoginVerification` component** in `frontend/web/src/pages/auth/PostLoginVerification.jsx`:

   - Form for entering verification code after login
   - Shows user's official email address
   - Updates user state after successful verification

2. **Created `PostLoginVerificationRoute` component** in `frontend/web/src/components/PostLoginVerificationRoute.jsx`:

   - Checks if government client needs verification before allowing access to protected routes
   - Redirects to `/verify-account` if verification is required

3. **Updated `Login` component** in `frontend/web/src/pages/auth/Login.jsx`:

   - Handles `verificationRequired` response from backend
   - Redirects to `/verify-account` for government clients needing verification

4. **Updated `EnquiryForm` component** in `frontend/web/src/pages/govt/EnquiryForm.jsx`:

   - Checks if government client is verified before allowing enquiry submission
   - Shows verification required message if not verified

5. **Updated routes** in `frontend/web/src/routes/AppRoutes.jsx`:
   - Added `/verify-account` route
   - Wrapped all protected routes with `PostLoginVerificationRoute`
   - Ensures government clients complete verification before accessing any protected functionality

## Flow Diagram:

```
Government Client Registration
         ↓
    Account Created (PENDING)
         ↓
    Login Attempt
         ↓
    Backend Checks Status
         ↓
    If PENDING → verificationRequired: true
         ↓
    Frontend Redirects to /verify-account
         ↓
    Enter Verification Code
         ↓
    Verification Success
         ↓
    User State Updated (VERIFIED)
         ↓
    Access to Protected Routes
         ↓
    Can Submit Enquiries
```

## Key Features:

- ✅ Government clients can register successfully
- ✅ Verification code is sent to official email
- ✅ Login works but requires verification for government clients
- ✅ Post-login verification form is user-friendly
- ✅ Verification status is properly tracked in user state
- ✅ Access control prevents unverified government clients from submitting enquiries
- ✅ Clear messaging guides users through the verification process
