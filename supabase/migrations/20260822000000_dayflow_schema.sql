-- DayFlow Intelligent Workforce OS — Supabase PostgreSQL Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'EMPLOYEE',
    department VARCHAR(100) NOT NULL,
    title VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Employee Profiles Table
CREATE TABLE IF NOT EXISTS public.employee_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) REFERENCES public.users(employee_id) ON DELETE CASCADE,
    designation VARCHAR(100),
    phone VARCHAR(50),
    address TEXT,
    joining_date DATE DEFAULT CURRENT_DATE,
    avatar_url TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Attendance Records Table
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(50) REFERENCES public.users(employee_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE')),
    check_in_time TIME,
    check_out_time TIME,
    work_hours NUMERIC(4, 2) DEFAULT 8.0,
    overtime_hours NUMERIC(4, 2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(employee_id, date)
);

-- 4. Leave Requests Table
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(50) REFERENCES public.users(employee_id) ON DELETE CASCADE,
    leave_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days INTEGER NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    impact_score NUMERIC(5, 2),
    impact_risk VARCHAR(20) DEFAULT 'LOW',
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Payroll Table
CREATE TABLE IF NOT EXISTS public.payroll (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(50) REFERENCES public.users(employee_id) ON DELETE CASCADE,
    month VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    basic_salary NUMERIC(12, 2) NOT NULL,
    allowances NUMERIC(12, 2) DEFAULT 0,
    deductions NUMERIC(12, 2) DEFAULT 0,
    net_salary NUMERIC(12, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PROCESSED' CHECK (status IN ('DRAFT', 'PROCESSED', 'PAID')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated and public client demos
CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public read profiles" ON public.employee_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read attendance" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Allow public read leave" ON public.leave_requests FOR ALL USING (true);
CREATE POLICY "Allow public read payroll" ON public.payroll FOR SELECT USING (true);
