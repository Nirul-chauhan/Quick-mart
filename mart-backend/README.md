# Blinkit Backend API

FastAPI + PostgreSQL backend with JWT authentication, OTP verification, and role-based access control.

---

## Project Structure

```
blinkit_backend/
├── app/
│   ├── core/
│   │   ├── config.py          # Settings from .env
│   │   ├── database.py        # SQLAlchemy engine + session
│   │   ├── dependencies.py    # JWT auth dependency
│   │   └── security.py        # Password hashing + JWT
│   ├── models/
│   │   ├── role.py            # roles table
│   │   ├── user.py            # users table
│   │   ├── user_role.py       # user_roles mapping table
│   │   └── otp.py             # otp table
│   ├── routes/
│   │   ├── auth.py            # /auth/* endpoints
│   │   └── roles.py           # /roles/* endpoints
│   ├── schemas/
│   │   └── auth.py            # Pydantic request/response models
│   ├── services/
│   │   ├── auth_service.py    # Business logic
│   │   └── otp_service.py     # OTP generate / verify
│   └── main.py                # FastAPI app
├── alembic/
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
│       └── 0001_initial_schema.py
├── alembic.ini
├── .env
└── requirements.txt
```

---

## Setup

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure environment

Edit `.env`:

```
DATABASE_URL=postgresql+psycopg2://avnadmin:mypass@pg-3058b753-blinkit-db.l.aivencloud.com:25728/defaultdb?sslmode=require
SECRET_KEY=change_this_to_a_long_random_string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### 3. Run database migrations

```bash
alembic upgrade head
```

This creates all tables and seeds the three roles (`admin`, `service`, `user`).

### 4. Start the server

```bash
uvicorn app.main:app --reload
```

API docs available at: http://127.0.0.1:8000/docs

---

## API Endpoints

### Authentication flow

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/auth/register` | Send details → receive OTP |
| POST | `/auth/verify-otp` | Verify OTP |
| POST | `/auth/complete-registration` | Create account |
| POST | `/auth/login` | Get JWT token |
| GET  | `/auth/profile` | Get profile (Bearer token required) |
| POST | `/auth/forgot-password` | Request password reset OTP |
| POST | `/auth/reset-password` | Reset password with OTP |

### Roles

| Method | URL | Description |
|--------|-----|-------------|
| GET  | `/roles/` | List all roles |
| POST | `/roles/?role_name=xyz` | Create role (admin only) |

---

## Role Access Rules

| Action | Admin | Service | User |
|--------|-------|---------|------|
| Create Product | ✅ | ❌ | ❌ |
| Delete Product | ✅ | ❌ | ❌ |
| View Products  | ✅ | ✅ | ✅ |

---

## Example: Register a User

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Nirul",
    "last_name": "Chauhan",
    "email": "nirul@gmail.com",
    "mobile": "9876543210",
    "password": "Password123",
    "role_id": 3
  }'
```

Response includes `dev_otp` for development. In production, send it via email/SMS instead.
