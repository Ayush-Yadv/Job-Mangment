# Teams 24 Careers - Product Requirements Document

## Overview
A full-stack job board application built with Next.js and MongoDB, allowing companies to manage job postings and track candidate applications through a Kanban-style pipeline.

## Original Problem Statement
Build a job board with:
- Public job listings page for candidates
- Admin dashboard for recruiters
- Kanban-style application pipeline
- Search and filtering capabilities
- Job management with templates

## Tech Stack
- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Icons**: Lucide React

## Architecture
```
/app/frontend/
├── src/
│   ├── app/
│   │   ├── api/           # Next.js API Routes
│   │   │   ├── jobs/      # CRUD for jobs
│   │   │   ├── applications/ # CRUD for applications
│   │   │   ├── templates/ # Job templates
│   │   │   ├── auth/      # Authentication
│   │   │   ├── health/    # Health check
│   │   │   └── seed/      # Database seeding
│   │   ├── page.tsx       # Main entry point
│   │   └── layout.tsx     # Root layout
│   ├── components/        # React components
│   │   ├── JobLanding.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── KanbanBoard.tsx
│   │   ├── JobManagement.tsx
│   │   └── ...
│   ├── lib/              # Utilities
│   │   ├── mongodb.ts    # DB connection
│   │   └── types.ts      # Type definitions
│   └── hooks/            # Custom hooks
│       └── useData.ts    # Data fetching hooks
```

## Core Features

### Phase 1: Core Application (✅ COMPLETE)
- [x] Job Listings Page - Display published jobs with deadlines
- [x] Admin Login - Mock authentication (admin@jobboard.com / admin123)
- [x] Admin Dashboard - Stats, Kanban board, table view
- [x] Kanban Pipeline - Drag-free stage management
- [x] Candidate Cards - View details, ratings, notes

### Phase 2: Job Management (✅ COMPLETE)
- [x] Job CRUD Operations - Create, edit, publish, pause, close jobs
- [x] Job Lifecycle - Draft → Published → Paused → Closed → Archived
- [x] Job Templates - Save and reuse job templates
- [x] Application Deadlines - Display and track deadlines

### Phase 3: Search & Filters (✅ COMPLETE)
- [x] Global Search - Search by name, email, phone, position
- [x] Multi-select Filters - Filter by position, stage, rating
- [x] Saved Filters - Save and load filter presets
- [x] Active Filter Chips - Visual indication of active filters

### Phase 4: Bulk Actions (✅ COMPLETE)
- [x] Multi-select Candidates - Checkbox selection
- [x] Floating Action Bar - Move, archive, export, email actions
- [x] Batch Operations - Process multiple candidates at once

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/jobs | List all jobs |
| POST | /api/jobs | Create job |
| GET | /api/jobs/:id | Get job |
| PUT | /api/jobs/:id | Update job |
| DELETE | /api/jobs/:id | Delete job |
| GET | /api/applications | List applications |
| POST | /api/applications | Create application |
| GET | /api/applications/:id | Get application |
| PUT | /api/applications/:id | Update application |
| DELETE | /api/applications/:id | Delete application |
| POST | /api/applications/bulk | Bulk actions |
| GET | /api/templates | List templates |
| POST | /api/templates | Create template |
| POST | /api/auth/login | Admin login |
| POST | /api/seed | Seed database |

## Database Schema

### Jobs Collection
```typescript
{
  id: string;
  title: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salaryMin: string;
  salaryMax: string;
  location: string;
  color: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  status: 'draft' | 'published' | 'paused' | 'closed' | 'archived';
  statusChangedAt: string;
  closureReason?: string;
  applicationDeadline?: string;
  createdAt: string;
  updatedAt: string;
  applicationsCount: number;
  category?: string;
}
```

### Applications Collection
```typescript
{
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  resumeUrl?: string;
  linkedIn?: string;
  portfolio?: string;
  coverLetter?: string;
  experience: string;
  status: string;
  rating: number;
  stage: string;
  appliedAt: string;
  notes: Note[];
  ratings: Rating[];
}
```

## Credentials
- Admin Email: `admin@jobboard.com`
- Admin Password: `admin123`

## Running the Application
```bash
# Development
cd /app/frontend
yarn dev

# The app runs on http://localhost:3000
# API routes: http://localhost:3000/api/*
```

## Next Steps / Backlog

### P1 - High Priority
- [ ] Email Notification System - Send emails for status changes
- [ ] Interview Scheduling - Calendar integration for interviews
- [ ] Real Authentication - JWT tokens, session management

### P2 - Medium Priority
- [ ] Email Templates - Customizable email templates
- [ ] Analytics Dashboard - Hiring metrics and insights
- [ ] Drag-and-drop Kanban - Enable drag between stages

### P3 - Low Priority
- [ ] LinkedIn Auto-Import - Parse LinkedIn profiles
- [ ] Resume Parsing - AI-powered resume analysis
- [ ] Multi-tenant Support - Multiple companies/teams

## Migration Notes (January 5, 2026)
Successfully migrated from React/Vite + FastAPI to full Next.js stack:
- Eliminated separate backend server
- All API routes now in Next.js
- MongoDB integration via Next.js API routes
- Hot reload working for development
