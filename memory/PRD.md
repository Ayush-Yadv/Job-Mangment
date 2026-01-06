# Teams 24 Careers - Product Requirements Document

## Overview
A full-stack job board application built with **Next.js** (frontend + API), **TypeScript**, and **PostgreSQL** database. Designed for **Vercel deployment** with **Supabase** for database hosting.

## Original Problem Statement
Build a modern job board with:
- Public, SEO-optimized job listings
- Job-centric admin dashboard for recruiters
- Kanban-style application pipeline
- Social sharing capabilities
- Fully serverless architecture (Next.js API routes)

## Tech Stack
- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (no separate backend!)
- **Database**: PostgreSQL (ready for Supabase)
- **Icons**: Lucide React
- **Deployment**: Vercel + Supabase ready

## Architecture (Vercel-Ready)
```
/app/frontend/                 # Single deployable unit
├── src/
│   ├── app/
│   │   ├── api/              # Next.js API Routes (serverless)
│   │   │   ├── jobs/         # CRUD for jobs
│   │   │   ├── applications/ # CRUD for applications
│   │   │   ├── templates/    # Job templates
│   │   │   ├── auth/         # Authentication
│   │   │   ├── health/       # Health check
│   │   │   └── seed/         # Database seeding
│   │   ├── admin/
│   │   │   └── jobs/         # Job-Centric Admin Dashboard
│   │   │       ├── page.tsx  # Jobs list
│   │   │       └── [id]/     # Per-job applications view
│   │   ├── careers/          # SEO Job Pages
│   │   │   ├── page.tsx      # Job listings
│   │   │   └── [slug]/       # Individual job page
│   │   ├── page.tsx          # Landing page
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   └── ShareButton.tsx   # Social sharing component
│   └── lib/
│       ├── db.ts             # PostgreSQL connection
│       └── types.ts          # TypeScript definitions
```

## Core Features

### ✅ Phase 1: Core Application (COMPLETE)
- [x] Job Listings Page
- [x] Admin Login (mock auth)
- [x] Kanban Pipeline
- [x] Candidate Cards

### ✅ Phase 2: Job Management (COMPLETE)
- [x] Job CRUD Operations
- [x] Job Lifecycle (Draft → Published → Paused → Closed → Archived)
- [x] Job Templates
- [x] Application Deadlines

### ✅ Phase 3: Option A - Architecture (COMPLETE - Jan 6, 2026)
- [x] **Job-Centric Admin Dashboard** (`/admin/jobs`)
  - Stats cards (Total Jobs, Active, Applications, Closing Soon)
  - Status filter tabs
  - Create Job modal with full form
  - Quick actions (publish, pause, close)
- [x] **Per-Job Applications View** (`/admin/jobs/[id]`)
  - Kanban board scoped to job
  - Table/Kanban toggle
  - Stage management
- [x] **SEO-Optimized Job Pages** (`/careers/[slug]`)
  - Meta tags, OpenGraph, Twitter cards
  - JSON-LD JobPosting schema
  - Application form
- [x] **Social Sharing** (NEW)
  - Copy link functionality
  - LinkedIn, Twitter, Facebook, Email share buttons
  - Native share API support (mobile)

### ✅ Phase 4: Database Migration (COMPLETE)
- [x] PostgreSQL schema with foreign keys
- [x] Removed MongoDB dependency
- [x] Removed separate FastAPI backend
- [x] Ready for Supabase migration

## Demo Jobs Created
1. **AI/ML Engineer** - Remote/San Francisco, $180k-$300k
2. **Head of Marketing** - New York City, $200k-$350k

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/jobs | List all jobs |
| POST | /api/jobs | Create job |
| GET | /api/jobs/:id | Get job by ID or slug |
| PUT | /api/jobs/:id | Update job |
| DELETE | /api/jobs/:id | Delete job |
| GET | /api/applications | List applications |
| GET | /api/applications?jobId=xxx | Filter by job |
| POST | /api/applications | Create application |
| PUT | /api/applications/:id | Update application |
| POST | /api/applications/bulk | Bulk actions |

## Credentials
- Admin Email: `admin@jobboard.com`
- Admin Password: `admin123`

## Deployment Guide

### Vercel Deployment
```bash
# 1. Push to GitHub
# 2. Connect to Vercel
# 3. Set environment variables:
#    - POSTGRES_HOST=your-supabase-host.supabase.co
#    - POSTGRES_PORT=5432
#    - POSTGRES_DB=postgres
#    - POSTGRES_USER=postgres
#    - POSTGRES_PASSWORD=your-password
# 4. Deploy!
```

### Supabase Setup
1. Create a new Supabase project
2. Run the schema SQL (see database section)
3. Copy the connection string
4. Add to Vercel environment variables

## Next Steps / Backlog

### P0 - Ready for Production
- [ ] Connect to Supabase (replace local PostgreSQL)
- [ ] Add Supabase Auth (replace mock auth)
- [ ] Configure Vercel deployment

### P1 - High Priority
- [ ] Drag-and-drop Kanban
- [ ] Email notifications (Resend/SendGrid)
- [ ] Interview scheduling

### P2 - Medium Priority
- [ ] Analytics dashboard
- [ ] Email templates
- [ ] Resume file upload (Supabase Storage)

### P3 - Low Priority
- [ ] LinkedIn auto-import
- [ ] AI resume parsing
- [ ] Multi-tenant support

## Changelog

### January 6, 2026
- ✅ Fixed Create Job CTA - added full modal with form
- ✅ Created 2 demo jobs (AI/ML Engineer, Head of Marketing)
- ✅ Added Share feature with LinkedIn, Twitter, Facebook, Email + Copy Link
- ✅ Removed separate backend - fully Next.js now
- ✅ Verified Vercel + Supabase deployment readiness

### January 6, 2026 (Earlier)
- ✅ PostgreSQL migration from MongoDB
- ✅ Job-Centric Admin Dashboard
- ✅ SEO-optimized job pages with JSON-LD

### January 5, 2026
- ✅ Next.js migration from React/Vite
