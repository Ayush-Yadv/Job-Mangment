# Teams 24 Careers - Product Requirements Document

## Overview
A full-stack job board application built with Next.js, TypeScript, and PostgreSQL, allowing companies to manage job postings and track candidate applications through a Kanban-style pipeline.

## Original Problem Statement
Build a job board with:
- Public job listings page for candidates
- Admin dashboard for recruiters
- Kanban-style application pipeline
- Search and filtering capabilities
- Job management with templates
- SEO-optimized job pages

## Tech Stack
- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (ready for Supabase migration)
- **Icons**: Lucide React

## Architecture
```
/app/frontend/
├── src/
│   ├── app/
│   │   ├── api/              # Next.js API Routes
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
│   ├── components/           # React components
│   └── lib/
│       ├── db.ts             # PostgreSQL connection
│       └── types.ts          # TypeScript definitions
```

## Core Features

### Phase 1: Core Application (✅ COMPLETE)
- [x] Job Listings Page - Display published jobs with deadlines
- [x] Admin Login - Mock authentication (admin@jobboard.com / admin123)
- [x] Kanban Pipeline - Stage management for candidates
- [x] Candidate Cards - View details, ratings, notes

### Phase 2: Job Management (✅ COMPLETE)
- [x] Job CRUD Operations - Create, edit, publish, pause, close jobs
- [x] Job Lifecycle - Draft → Published → Paused → Closed → Archived
- [x] Job Templates - Save and reuse job templates
- [x] Application Deadlines - Display and track deadlines

### Phase 3: Search & Filters (✅ COMPLETE)
- [x] Global Search - Search by name, email, position
- [x] Status Filters - Filter jobs by status
- [x] Saved Filters - Save and load filter presets

### Phase 4: Option A - Architecture (✅ COMPLETE - Jan 6, 2026)
- [x] **Job-Centric Admin Dashboard** (`/admin/jobs`)
  - Grid of jobs with stats (applicants, status, deadline)
  - Filter tabs: All | Published | Draft | Paused | Closed
  - Quick actions (publish, pause, close)
  - Click job to view its applications
- [x] **Per-Job Applications View** (`/admin/jobs/[id]`)
  - Kanban board scoped to selected job
  - Toggle between Table and Kanban views
  - Stage change via dropdown menu
  - Back navigation to job list
- [x] **SEO-Optimized Job Pages** (`/careers/[slug]`)
  - Dedicated URLs for each job
  - Meta tags (title, description, OpenGraph, Twitter)
  - JSON-LD structured data (JobPosting schema)
  - Application form embedded on page
- [x] **Public Careers Page** (`/careers`)
  - Lists all published jobs
  - Category filter tabs
  - Company footer

### Phase 5: Database Migration (✅ COMPLETE - Jan 6, 2026)
- [x] Migrated from MongoDB to PostgreSQL
- [x] Created proper schema with foreign keys and indexes
- [x] Added `slug` field for SEO-friendly URLs
- [x] Ready for Supabase migration

## Database Schema (PostgreSQL)

### Jobs Table
```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50),
  salary_min VARCHAR(50),
  salary_max VARCHAR(50),
  location VARCHAR(255),
  color VARCHAR(20),
  description TEXT,
  requirements TEXT[],
  responsibilities TEXT[],
  benefits TEXT[],
  status VARCHAR(50), -- draft, published, paused, closed, archived
  application_deadline DATE,
  meta_title VARCHAR(255),
  meta_description TEXT,
  category VARCHAR(100),
  applications_count INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Applications Table
```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY,
  job_id UUID REFERENCES jobs(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  position VARCHAR(255),
  resume_url TEXT,
  linkedin VARCHAR(255),
  portfolio VARCHAR(255),
  cover_letter TEXT,
  experience VARCHAR(100),
  status VARCHAR(50),
  stage VARCHAR(50),
  rating DECIMAL(3,2),
  applied_at TIMESTAMP
);
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/jobs | List all jobs |
| GET | /api/jobs?status=published | Filter by status |
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
- PostgreSQL: `postgres:postgres123@localhost:5432/teams24careers`

## Running the Application
```bash
cd /app/frontend
yarn dev
# App: http://localhost:3000
# Admin: http://localhost:3000/admin/jobs
# Careers: http://localhost:3000/careers
```

## Next Steps / Backlog

### P0 - Critical (Ready for Supabase)
- [ ] Migrate PostgreSQL to Supabase cloud database
- [ ] Add real authentication (Supabase Auth)

### P1 - High Priority
- [ ] Email Notification System - Auto emails for status changes
- [ ] Interview Scheduling - Calendar integration
- [ ] Drag-and-drop Kanban - Enable drag between stages

### P2 - Medium Priority
- [ ] Email Templates - Customizable email templates
- [ ] Analytics Dashboard - Hiring metrics and insights
- [ ] Resume File Upload - Store resumes in cloud storage

### P3 - Low Priority
- [ ] LinkedIn Auto-Import - Parse LinkedIn profiles
- [ ] Resume Parsing - AI-powered resume analysis
- [ ] Multi-tenant Support - Multiple companies/teams

## Changelog

### January 6, 2026
- **PostgreSQL Migration**: Migrated from MongoDB to PostgreSQL
- **Job-Centric Admin Dashboard**: Admin navigates by jobs first (`/admin/jobs`)
- **Per-Job Applications View**: Kanban/Table for specific job (`/admin/jobs/[id]`)
- **SEO Job Pages**: `/careers` listing and `/careers/[slug]` with meta tags, JSON-LD
- **Database Schema**: Added slug field, proper indexes, foreign keys

### January 5, 2026
- **Next.js Migration**: Migrated from React/Vite to Next.js with TypeScript
- **API Routes**: Created Next.js API routes replacing FastAPI backend
- Initial MongoDB integration (later replaced with PostgreSQL)
