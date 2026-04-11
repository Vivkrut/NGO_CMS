# Module 1 - Authentication (Status)

## Completed

### Backend
- Custom user model with email login, role, status, created_at
  - backend/accounts/models.py
- Login API (email + password) issuing JWT access/refresh
  - backend/accounts/views.py
- Registration API (create user with hashed password)
  - backend/accounts/views.py
- Forgot password API (send reset link/email)
  - backend/accounts/views.py
- Reset password API (token-based)
  - backend/accounts/views.py
- Protected dashboard API requiring JWT
  - backend/accounts/views.py
- Auth model configured
  - backend/backend/settings.py
- URLs wired for login + dashboard
  - backend/backend/urls.py

### Frontend
- Login screen with loading + error handling
  - src/components/Login.js
- Registration page
  - src/components/Register.js
- Forgot password page
  - src/components/ForgotPassword.js
- Reset password page
  - src/components/ResetPassword.js
- Dashboard page that calls protected API using Bearer token
  - src/components/Dashboard.js
- Logout (clears localStorage, redirects to login)
  - src/components/Dashboard.js

### Environment / Deployment Config
- Frontend API base URL via REACT_APP_API_BASE_URL
  - src/components/Login.js
  - src/components/Dashboard.js
- .env.example added for live deployment
  - .env.example
- CORS and JWT auth configured in Django
  - backend/backend/settings.py

---

## Pending (Required for Module 1 completion)

### Backend
- Email verification (optional but recommended)
- Logout endpoint (optional if using stateless JWT)
- Session management / auto-logout policy (token expiry/refresh handling)

### Frontend
- Email verification flow (if implemented on backend)
- Session timeout / auto-logout UX

### Documentation
- End-user steps with screenshots for:
  - Login
  - Registration
  - Forgot/Reset password
- Live URL + environment setup steps

---

## Notes
- Current login + dashboard works with JWT and localStorage.
- Missing APIs and screens are required to fully satisfy Module 1 as described in task.md.
