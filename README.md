

A modern job board application built with Next.js, TypeScript, and PostgreSQL.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Supabase compatible)
- **Icons**: Lucide React

## Features

- 🏢 Public careers page with SEO-optimized job listings
- 📋 Admin dashboard for job management
- 📊 Kanban-style application pipeline
- 📝 Job templates for quick job creation
- 🔗 Social sharing (LinkedIn, Twitter, Facebook, Email)
- 📱 Fully responsive design

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Supabase)

### Installation

```bash
# Install dependencies
npm install
# or
yarn install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
# or
yarn dev
```

### Environment Variables

Create a `.env.local` file with:

```env
POSTGRES_HOST=your-supabase-host.supabase.co
POSTGRES_PORT=5432
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

### Database (Supabase)

1. Create a Supabase project at https://supabase.com
2. Run the schema SQL (see `/src/lib/schema.sql`)
3. Copy connection details to environment variables

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── admin/        # Admin dashboard
│   │   ├── careers/      # Public job pages
│   │   └── page.tsx      # Landing page
│   ├── components/       # React components
│   └── lib/
│       ├── db.ts         # Database connection
│       └── types.ts      # TypeScript types
├── public/               # Static assets
├── package.json
└── tailwind.config.js
```

## License

MIT
