# Smart IT Department Academic Support Portal

This is a production-quality, enterprise-grade university SaaS system designed for institutional deployment.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Supabase recommended)
- Cloudinary account (for file storage)

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables in `.env`:
   ```env
   DATABASE_URL=your_postgresql_url
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Generate Prisma Client and migrate:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠 Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS, Framer Motion, Zustand
- **Backend:** Node.js, Express, Prisma ORM, PostgreSQL
- **Real-time:** Socket.IO
- **Security:** JWT, RBAC, Bcrypt

## 🔑 User Roles
- **Student:** View courses, submit assignments, track attendance, view test scores.
- **Lecturer:** Manage courses, upload materials, grade assignments, mark attendance.
- **Admin:** Manage users, courses, system-wide analytics, and announcements.
