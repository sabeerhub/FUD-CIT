# IT Department Student Portal

A comprehensive, modern web-based portal designed for the Information Technology Department. This application streamlines academic management by providing dedicated interfaces for both students and department administrators.

## 🚀 Features

### 👨‍🎓 Student Portal
* **Authentication:** Secure registration and login system.
* **Dashboard:** Overview of academic progress and recent announcements.
* **Profile Management:** View and update personal information.
* **Course Registration:** View registered courses based on academic level.
* **Assignments:** Download course materials and submit assignments securely.
* **Results:** Check academic performance and grades.
* **Announcements:** Stay updated with the latest department news and notices.

### 👨‍💼 Admin Panel
* **Dashboard:** High-level overview of department metrics.
* **Student Management:** Add, edit, or remove student records.
* **Course Management:** Create and organize courses by level and semester.
* **Assignment Management:** Post assignments with deadlines for specific courses.
* **Result Processing:** Upload and manage student grades.
* **Announcements:** Broadcast important information to all students.

## 🛠️ Tech Stack

* **Frontend:** React 18, TypeScript, Vite
* **Styling:** Tailwind CSS, Lucide React (Icons)
* **Routing:** React Router DOM
* **Backend/Database:** Supabase (PostgreSQL, Authentication, Storage)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v16 or higher)
* npm or yarn
* A [Supabase](https://supabase.com/) account

## ⚙️ Getting Started

### 1. Clone the repository and install dependencies

```bash
npm install
```

### 2. Set up Environment Variables

Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup (Supabase)

Run the following SQL commands in your Supabase SQL Editor to create the necessary tables and disable Row Level Security (RLS) for custom authentication:

```sql
-- Students Table
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reg_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  level TEXT NOT NULL,
  year TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Admins Table
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Insert a default admin
INSERT INTO admins (full_name, email, password) VALUES ('Super Admin', 'admin@example.com', 'admin123');

-- Courses Table
CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_code TEXT UNIQUE NOT NULL,
  course_name TEXT NOT NULL,
  level TEXT NOT NULL,
  semester INTEGER NOT NULL
);

-- Assignments Table
CREATE TABLE assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_code TEXT NOT NULL REFERENCES courses(course_code) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  deadline DATE NOT NULL,
  file_url TEXT
);

-- Submissions Table
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_reg TEXT NOT NULL REFERENCES students(reg_number) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Results Table
CREATE TABLE results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_reg TEXT NOT NULL REFERENCES students(reg_number) ON DELETE CASCADE,
  course_code TEXT NOT NULL REFERENCES courses(course_code) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  grade TEXT NOT NULL
);

-- Announcements Table
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Disable RLS to allow custom React auth to read/write data
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE results DISABLE ROW LEVEL SECURITY;
ALTER TABLE announcements DISABLE ROW LEVEL SECURITY;
```

### 4. Storage Setup
In your Supabase dashboard, go to **Storage** and create a new public bucket named `assignments`. Ensure you set the bucket policies to allow public access for uploads and downloads.

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or the port specified in your terminal).

## 🔐 Default Admin Credentials

To access the admin panel initially, use the following credentials:
* **Email:** `admin@example.com`
* **Password:** `admin123`

## 📄 License

This project is licensed under the MIT License.
