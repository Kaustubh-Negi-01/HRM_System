-- Seed data for Supabase

INSERT INTO public.users (employee_id, name, email, role, department, title) VALUES
('ADM001', 'Saksham Singh', 'admin@dayflow.internal', 'ADMIN', 'Human Resources', 'HR Director'),
('EMP001', 'Alex Chen', 'alex.chen@dayflow.internal', 'EMPLOYEE', 'Engineering', 'Lead Fullstack Engineer'),
('EMP002', 'Elena Rostova', 'elena.rostova@dayflow.internal', 'EMPLOYEE', 'Engineering', 'Senior Systems Engineer'),
('EMP003', 'Marcus Vance', 'marcus.vance@dayflow.internal', 'EMPLOYEE', 'Engineering', 'DevOps Specialist'),
('EMP004', 'Priya Sharma', 'priya.sharma@dayflow.internal', 'EMPLOYEE', 'Customer Support', 'Support Operations Lead'),
('EMP005', 'David Kim', 'david.kim@dayflow.internal', 'EMPLOYEE', 'Customer Support', 'Tier 2 Support Engineer'),
('EMP006', 'Amina Diallo', 'amina.diallo@dayflow.internal', 'EMPLOYEE', 'Customer Support', 'Support Specialist'),
('EMP007', 'Sarah Jenkins', 'sarah.jenkins@dayflow.internal', 'EMPLOYEE', 'Human Resources', 'People Operations Partner'),
('EMP008', 'Ryan Patel', 'ryan.patel@dayflow.internal', 'EMPLOYEE', 'Product & Design', 'Principal Product Manager'),
('EMP009', 'Zoe Martinez', 'zoe.martinez@dayflow.internal', 'EMPLOYEE', 'Product & Design', 'Lead UI/UX Designer')
ON CONFLICT (employee_id) DO NOTHING;

INSERT INTO public.employee_profiles (employee_id, designation, phone, address, joining_date) VALUES
('ADM001', 'HR Director', '+1 (555) 019-2831', '100 Innovation Way, Suite 400', '2023-01-15'),
('EMP001', 'Lead Fullstack Engineer', '+1 (555) 102-3948', '45 Silicon Boulevard, Apt 12B', '2023-03-01'),
('EMP002', 'Senior Systems Engineer', '+1 (555) 203-4950', '88 Redwood Drive', '2023-04-10'),
('EMP003', 'DevOps Specialist', '+1 (555) 304-5961', '12 Lakeview Avenue', '2023-06-01'),
('EMP004', 'Support Operations Lead', '+1 (555) 405-6972', '340 Pinecrest Way', '2023-02-20'),
('EMP005', 'Tier 2 Support Engineer', '+1 (555) 506-7983', '77 Horizon Pass', '2023-07-15'),
('EMP006', 'Support Specialist', '+1 (555) 607-8994', '910 Maple Court', '2023-08-01'),
('EMP007', 'People Operations Partner', '+1 (555) 708-9005', '23 Willow Lane', '2023-05-12'),
('EMP008', 'Principal Product Manager', '+1 (555) 809-0116', '500 Tech Square, Floor 8', '2023-01-20'),
('EMP009', 'Lead UI/UX Designer', '+1 (555) 910-1227', '62 Artisan Row', '2023-09-01')
ON CONFLICT DO NOTHING;

INSERT INTO public.payroll (employee_id, month, year, basic_salary, allowances, deductions, net_salary, status) VALUES
('ADM001', 'August', 2026, 12000.00, 2000.00, 2500.00, 11500.00, 'PAID'),
('EMP001', 'August', 2026, 9500.00, 1200.00, 1800.00, 8900.00, 'PAID'),
('EMP002', 'August', 2026, 8800.00, 1000.00, 1600.00, 8200.00, 'PAID'),
('EMP003', 'August', 2026, 8000.00, 1000.00, 1500.00, 7500.00, 'PAID'),
('EMP004', 'August', 2026, 7200.00, 800.00, 1300.00, 6700.00, 'PAID'),
('EMP005', 'August', 2026, 6500.00, 600.00, 1100.00, 6000.00, 'PAID'),
('EMP006', 'August', 2026, 5800.00, 500.00, 1000.00, 5300.00, 'PAID'),
('EMP007', 'August', 2026, 7000.00, 800.00, 1200.00, 6600.00, 'PAID'),
('EMP008', 'August', 2026, 10500.00, 1500.00, 2100.00, 9900.00, 'PAID'),
('EMP009', 'August', 2026, 8200.00, 1000.00, 1500.00, 7700.00, 'PAID')
ON CONFLICT DO NOTHING;
