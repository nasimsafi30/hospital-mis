# 🏥 Hospital MIS - Complete Hospital Management Information System

A comprehensive, full-stack hospital management system built with modern web technologies. Manage patients, doctors, appointments, pharmacy, laboratory, billing, inventory, and more — all from a single, elegant dashboard.

## ✨ Features

### 📋 Core Modules

- **Patient Management** — Full CRUD with medical history, documents, and QR code wristbands
- **Doctor Management** — Profiles, schedules, specializations, and department assignments
- **Appointment Scheduling** — Calendar view, status tracking (confirm/cancel/complete), conflict detection
- **Inpatient Management** — Bed allocation, vitals tracking, discharge & transfer workflows
- **Medical Records** — Digital records with diagnosis, prescriptions, and printable reports
- **Prescriptions** — Digital Rx with PDF export and printing
- **Pharmacy** — Medicine inventory with QR codes, barcode scanning, stock alerts, and dispensing
- **Laboratory** — Test requests, result uploads, and lab reports
- **Billing & Invoicing** — Invoice generation, payment tracking, refunds, and QR payment codes
- **Inventory Management** — Stock tracking, low stock alerts, expiry date monitoring
- **Departments, Rooms & Beds** — Hospital facility management

### 📊 Dashboard & Analytics

- Real-time statistics and KPIs
- Interactive charts (line, bar, pie, area)
- Revenue trends, patient demographics, appointment analytics
- Department performance metrics

### 🔐 Security & Access Control

- Role-based access (Admin, Doctor, Nurse, Receptionist, Pharmacist, Lab Technician)
- JWT authentication with protected API routes
- Audit logging for all system activities
- Password reset functionality

### 🎨 Modern UI/UX

- Dark/Light mode with system preference detection
- Responsive design (mobile, tablet, desktop)
- Animated transitions with Framer Motion
- Glassmorphism design elements
- Interactive data tables with sorting, filtering, and pagination

### 📱 Additional Features

- QR Code generation for patients, medicines, and invoices
- Barcode/QR scanner support for pharmacy dispensing
- PDF export for medical records, prescriptions, and invoices
- Print-friendly layouts
- PWA support with offline capabilities
- RESTful API with 60+ endpoints

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Database** | Neon PostgreSQL (Serverless) |
| **ORM** | Drizzle ORM |
| **Authentication** | NextAuth.js + JWT |
| **UI Library** | Radix UI + Tailwind CSS |
| **Charts** | Recharts |
| **Forms** | React Hook Form + Zod |
| **PDF** | jsPDF |
| **QR Codes** | qrcode.react |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

## 📸 Screenshots

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Patient Management

![Patients](screenshots/patients.png)

### Pharmacy with QR Codes

![Pharmacy](screenshots/pharmacy.png)

### Appointments Calendar

![Appointments](screenshots/appointments.png)

### Analytics

![Analytics](screenshots/analytics.png)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/hospital-mis.git
cd hospital-mis

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Neon database URL

# Push database schema
npx drizzle-kit push

# Seed with sample data
npm run db:seed-complete

# Start development server
npm run dev
