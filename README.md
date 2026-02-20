# CourseSell — Course Selling Platform

A full-stack course selling application built with the MERN stack + Next.js, featuring Razorpay payment integration.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Payments | Razorpay |
| Auth | JWT (JSON Web Tokens) |

## Project Structure

```
payment-integration/
├── server/          # Express backend
│   ├── config/      # Database connection
│   ├── middleware/  # JWT auth middleware
│   ├── models/      # Mongoose models (User, Course, Order)
│   ├── routes/      # API routes (auth, courses, payment)
│   ├── index.js     # Entry point
│   └── seed.js      # Sample course data seeder
└── client/          # Next.js frontend
    ├── app/         # App Router pages
    │   ├── courses/ # Course listing + detail pages
    │   ├── login/   # Auth pages
    │   ├── register/
    │   └── my-courses/ # Dashboard with purchased courses & orders
    ├── components/  # Reusable components (Navbar, CourseCard, PaymentButton)
    └── lib/         # Axios API client
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Razorpay account (get keys from https://dashboard.razorpay.com)

---

### 1. Server Setup

```bash
cd server
npm install
```

Copy environment variables:
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/course-seller
JWT_SECRET=your_super_secret_key_here
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLIENT_URL=http://localhost:3000
```

Seed sample courses:
```bash
npm run seed
```

Start the server:
```bash
npm run dev   # development (nodemon)
npm start     # production
```

---

### 2. Client Setup

```bash
cd client
npm install
```

Copy environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

Start the client:
```bash
npm run dev
```

App runs at **http://localhost:3000**

---

## Razorpay Payment Flow

1. User clicks **Buy Now** on a course page
2. Frontend calls `POST /api/payment/create-order` → server creates Razorpay order
3. Razorpay checkout modal opens in the browser
4. User completes payment (use test card: `4111 1111 1111 1111`)
5. Razorpay returns `payment_id`, `order_id`, `signature` to frontend
6. Frontend calls `POST /api/payment/verify` → server verifies HMAC SHA256 signature
7. Course is added to user's library

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user (auth required) |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | List all courses (supports `?search=`, `?category=`, `?level=`) |
| GET | `/api/courses/:id` | Get single course |

### Payment
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment/create-order` | Create Razorpay order (auth required) |
| POST | `/api/payment/verify` | Verify payment signature (auth required) |
| GET | `/api/payment/orders` | Get user's order history (auth required) |

## Razorpay Test Credentials

Use these for testing in test mode:
- **Card:** `4111 1111 1111 1111` | Expiry: any future date | CVV: any 3 digits
- **UPI:** `success@razorpay`
- **Net Banking:** Any bank → success

Get test API keys from: https://dashboard.razorpay.com/app/keys
