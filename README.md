# Milk Tracker

Live Demo :  https://milk-tracker-ashen.vercel.app/ 

frontend Deploy : Vercel 
backend Deploy  : Render

A full-stack web application for managing milk delivery subscriptions between vendors (milk sellers) and customers (milk buyers).

## Features

### Vendor Portal
- Register with a business name and profile image
- Set and manage milk pricing with history tracking
- View customer list with search and individual detail pages
- Analytics dashboard with revenue trends, daily charts, and top customers
- Track payment history and pending amounts

### Customer Portal
- Browse and subscribe to milk vendors
- Set daily milk quantities per vendor
- Interactive calendar to override daily deliveries (skip days, adjust quantity)
- Pay vendors via simulated UPI, Card, or Cash payment flow
- View payment history and pending amounts

### System Features
- Automatic daily milk record generation for active subscriptions (via APScheduler)
- Cookie-based session authentication (separate for vendors and customers)
- Image upload for vendor profiles (via Cloudinary)
- Responsive design with mobile-friendly sidebar navigation

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.13, FastAPI, SQLAlchemy, Alembic |
| **Database** | PostgreSQL 18 |
| **Frontend** | React 19, React Router v7, Tailwind CSS, shadcn/ui |
| **Build Tool** | Vite 8 |
| **Package Manager** | uv (Python), npm (JS) |
| **Background Jobs** | APScheduler |
| **Image Storage** | Cloudinary |
| **Password Hashing** | Argon2 |

## Architecture

```
Frontend (React, port 5173)  ──/api/*──>  Backend (FastAPI, port 8000)  ──>  PostgreSQL (port 5432)
```

- The Vite dev server proxies all `/api/*` requests to the FastAPI backend
- Authentication uses httponly cookies (`customer_session` / `vendor_session`) with tokens stored in the database
- APScheduler runs background jobs: daily record generation (00:05), payment reminders (09:00), session cleanup (03:00)

## Prerequisites

- **Python** 3.13+
- **Node.js** 24+
- **Docker** (for PostgreSQL)
- **uv** (Python package manager) - [Install uv](https://docs.astral.sh/uv/getting-started/installation/)

## Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:silverstripesoftware/tinymagiq-fde.git
cd tinymagiq-fde
```

### 2. Start PostgreSQL

Run PostgreSQL using Docker:

```bash
docker run -d \
  --name tinymagiq-postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=trainingdb \
  -p 5432:5432 \
  postgres
```

### 3. Install Python dependencies

```bash
uv sync
```

### 4. Run database migrations

From the `backend/` directory:

```bash
cd backend
uv run alembic upgrade head
```

### 5. Start the backend

From the `backend/` directory:

```bash
uv run fastapi dev app/main.py
```

The API runs at `http://localhost:8000`.

### 6. Install frontend dependencies

From the `frontend-router/` directory:

```bash
cd frontend-router
npm install
```

### 7. Start the frontend dev server

```bash
npm run dev
```

The frontend runs at `http://localhost:5173`.

### 8. Open the application

Visit `http://localhost:5173` in your browser. Create a vendor or customer account to get started.

## Project Structure

```
tinymagiq-fde/
├── backend/                    # FastAPI Python backend
│   ├── app/
│   │   ├── main.py             # FastAPI app entry point
│   │   ├── config.py           # Pydantic settings
│   │   ├── database.py         # SQLAlchemy engine + session
│   │   ├── models.py           # ORM models (Vendor, Customer, Subscription, etc.)
│   │   ├── schema/             # Pydantic request/response schemas
│   │   ├── routes/             # API endpoints
│   │   ├── scheduler/          # APScheduler background jobs
│   │   └── cloudinary/         # Image upload service
│   ├── alembic/                # Database migrations
│   └── tests/                  # Integration tests
│
├── frontend-router/            # React Router v7 frontend
│   ├── app/
│   │   ├── root.jsx            # HTML shell
│   │   ├── routes.js           # Route definitions
│   │   ├── app.css             # Tailwind CSS + design tokens
│   │   ├── layouts/            # Navbar, CustomerSidebar, VendorSidebar
│   │   ├── components/         # Reusable UI components (shadcn/ui)
│   │   └── routes/             # Page components
│   │       ├── customers/      # Customer portal pages (6 pages)
│   │       └── vendors/        # Vendor portal pages (6 pages)
│   └── package.json
│
├── bruno/                      # API collection for manual testing
└── pyproject.toml              # Python project config
```

## API Endpoints

| Group | Base Path | Endpoints |
|-------|-----------|-----------|
| Customers | `/api/customers/` | signup, login, logout, profile, dashboard-stats, payable-amounts, confirm-payment, payment-history |
| Vendors | `/api/vendors/` | create, login, logout, profile, dashboard, analytics, customers, pricing, payment-history |
| Subscriptions | `/api/subscriptions/` | create, update, unsubscribe, my-vendors, subscription-data |
| Milk Records | `/api/milk-records/` | get records, update record |

## Database Tables

- **vendors** - Vendor profiles (id, name, image_url)
- **customers** - Customer profiles (id, name)
- **vendor_login_credentials** - Vendor auth (email, password_hash, session_token)
- **customer_login_credentials** - Customer auth (email, password_hash, session_token)
- **subscription** - Many-to-many relationship with default_quantity and is_active
- **milk_prices** - Vendor pricing history
- **daily_milk_records** - Daily delivery records with quantity and amount
- **payments** - Payment transactions (UPI, Card, Cash)
