# 🚀 Hospital MIS - Deployment Guide

Complete deployment guide for Hospital Management Information System.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Database Setup](#database-setup)
- [Deployment Options](#deployment-options)
- [Vercel Deployment](#vercel-deployment)
- [Docker Deployment](#docker-deployment)
- [VPS Deployment](#vps-deployment)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)

---

## Prerequisites

- **Node.js** 18+ (Recommended: 20 LTS)
- **npm** 9+
- **Git**
- **Neon PostgreSQL Database** (or any PostgreSQL)

---

## Local Development

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/hospital-mis.git
cd hospital-mis

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# 4. Push database schema
npx drizzle-kit push

# 5. Seed database (optional)
npm run db:seed-complete

# 6. Start development server
npm run dev

# 7. Open browser
# http://localhost:3000
