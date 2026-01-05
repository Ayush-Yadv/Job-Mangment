import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

// Initial seed data for jobs
const SEED_JOBS = [
  {
    id: '1',
    title: 'Strategy & operations',
    type: 'full-time',
    salaryMin: '120k',
    salaryMax: '200k',
    location: 'Chennai, Tamilnadu',
    color: '#EC4899',
    description: 'Lead strategic initiatives and optimize operations across the organization.',
    requirements: ['5+ years experience in strategy/operations', 'MBA preferred', 'Strong analytical skills'],
    responsibilities: ['Develop and execute strategic plans', 'Optimize operational processes', 'Lead cross-functional teams'],
    benefits: ['Health insurance', 'Stock options', 'Remote work'],
    status: 'published',
    statusChangedAt: new Date().toISOString(),
    applicationDeadline: '2026-01-31',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    applicationsCount: 15,
    category: 'Operations',
  },
  {
    id: '2',
    title: 'Full stack developer',
    type: 'full-time',
    salaryMin: '200k',
    salaryMax: '400k',
    location: 'Remote',
    color: '#3B82F6',
    description: 'Build and maintain scalable web applications using modern technologies.',
    requirements: ['5+ years full-stack experience', 'React/Next.js expertise', 'Node.js/Python backend skills'],
    responsibilities: ['Design and implement features', 'Code reviews', 'Mentor junior developers'],
    benefits: ['Health insurance', 'Stock options', 'Flexible hours'],
    status: 'published',
    statusChangedAt: new Date().toISOString(),
    applicationDeadline: '2026-01-07',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    applicationsCount: 42,
    category: 'Engineering',
  },
  {
    id: '3',
    title: 'Senior product designer',
    type: 'full-time',
    salaryMin: '250k',
    salaryMax: '400k',
    location: 'Bangalore, Karnataka',
    color: '#F97316',
    description: 'Lead product design initiatives and create exceptional user experiences.',
    requirements: ['7+ years UX/UI design', 'Portfolio required', 'Figma expertise'],
    responsibilities: ['Lead design projects', 'User research', 'Design system maintenance'],
    benefits: ['Health insurance', 'Learning budget', 'Gym membership'],
    status: 'published',
    statusChangedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    applicationsCount: 28,
    category: 'Design',
  },
  {
    id: '4',
    title: 'Customer success manager',
    type: 'full-time',
    salaryMin: '225k',
    salaryMax: '400k',
    location: 'Remote',
    color: '#F472B6',
    description: 'Ensure customer success and drive product adoption across enterprise accounts.',
    requirements: ['3+ years in customer success', 'Enterprise software experience', 'Excellent communication'],
    responsibilities: ['Manage customer relationships', 'Drive product adoption', 'Handle escalations'],
    benefits: ['Health insurance', 'Performance bonus', 'Remote work'],
    status: 'published',
    statusChangedAt: new Date().toISOString(),
    applicationDeadline: '2026-01-05',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    applicationsCount: 19,
    category: 'Customer Success',
  },
];

// Seed applications
const SEED_APPLICATIONS = [
  {
    id: 'app-1',
    jobId: '2',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '+1 555-0101',
    position: 'Full stack developer',
    resumeUrl: '/resumes/sarah-chen.pdf',
    linkedIn: 'linkedin.com/in/sarahchen',
    portfolio: 'sarahchen.dev',
    experience: '6 years',
    status: 'new',
    rating: 4.5,
    stage: 'new',
    appliedAt: new Date(Date.now() - 86400000).toISOString(),
    notes: [],
    ratings: [
      { id: 'r1', applicationId: 'app-1', category: 'Technical Skills', score: 9, maxScore: 10, reviewerId: 'admin-1', reviewerName: 'Admin', createdAt: new Date().toISOString() },
      { id: 'r2', applicationId: 'app-1', category: 'Communication', score: 8, maxScore: 10, reviewerId: 'admin-1', reviewerName: 'Admin', createdAt: new Date().toISOString() },
    ],
  },
  {
    id: 'app-2',
    jobId: '2',
    name: 'Michael Johnson',
    email: 'michael.j@email.com',
    phone: '+1 555-0102',
    position: 'Full stack developer',
    resumeUrl: '/resumes/michael-j.pdf',
    linkedIn: 'linkedin.com/in/michaelj',
    experience: '4 years',
    status: 'screening',
    rating: 3.8,
    stage: 'screening',
    appliedAt: new Date(Date.now() - 172800000).toISOString(),
    notes: [
      { id: 'n1', applicationId: 'app-2', authorId: 'admin-1', authorName: 'Admin', noteType: 'phone_screen', content: 'Good communication skills, needs more backend experience', isPinned: true, visibility: 'team', createdAt: new Date().toISOString(), canEdit: true },
    ],
    ratings: [],
  },
  {
    id: 'app-3',
    jobId: '2',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    phone: '+1 555-0103',
    position: 'Full stack developer',
    experience: '8 years',
    status: 'interview_scheduled',
    rating: 4.2,
    stage: 'interview_scheduled',
    appliedAt: new Date(Date.now() - 259200000).toISOString(),
    notes: [],
    ratings: [],
  },
  {
    id: 'app-4',
    jobId: '3',
    name: 'David Kim',
    email: 'david.kim@email.com',
    phone: '+1 555-0104',
    position: 'Senior product designer',
    portfolio: 'davidkim.design',
    experience: '9 years',
    status: 'new',
    rating: 4.8,
    stage: 'new',
    appliedAt: new Date(Date.now() - 43200000).toISOString(),
    notes: [],
    ratings: [],
  },
  {
    id: 'app-5',
    jobId: '1',
    name: 'Jessica Williams',
    email: 'jessica.w@email.com',
    phone: '+1 555-0105',
    position: 'Strategy & operations',
    experience: '7 years',
    status: 'interview_complete',
    rating: 4.0,
    stage: 'interview_complete',
    appliedAt: new Date(Date.now() - 432000000).toISOString(),
    notes: [],
    ratings: [],
  },
];

// Seed templates
const SEED_TEMPLATES = [
  {
    id: 'template-1',
    name: 'Software Engineer',
    category: 'Engineering',
    title: 'Software Engineer',
    type: 'full-time',
    salaryMin: '150k',
    salaryMax: '250k',
    location: 'Remote',
    description: 'We are looking for a talented software engineer to join our team.',
    requirements: ['3+ years experience', 'Strong problem-solving skills', 'Team player'],
    responsibilities: ['Write clean, maintainable code', 'Participate in code reviews', 'Collaborate with team'],
    benefits: ['Health insurance', 'Stock options', 'Flexible hours'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'template-2',
    name: 'Product Manager',
    category: 'Product',
    title: 'Product Manager',
    type: 'full-time',
    salaryMin: '180k',
    salaryMax: '280k',
    location: 'Hybrid',
    description: 'Lead product strategy and roadmap development.',
    requirements: ['5+ years PM experience', 'Technical background preferred', 'Data-driven mindset'],
    responsibilities: ['Define product roadmap', 'Work with engineering', 'Analyze metrics'],
    benefits: ['Health insurance', 'Learning budget', 'Remote work option'],
    createdAt: new Date().toISOString(),
  },
];

export async function POST() {
  try {
    const jobsCollection = await getCollection('jobs');
    const applicationsCollection = await getCollection('applications');
    const templatesCollection = await getCollection('templates');
    
    // Clear existing data
    await jobsCollection.deleteMany({});
    await applicationsCollection.deleteMany({});
    await templatesCollection.deleteMany({});
    
    // Insert seed data
    if (SEED_JOBS.length > 0) {
      await jobsCollection.insertMany(SEED_JOBS);
    }
    if (SEED_APPLICATIONS.length > 0) {
      await applicationsCollection.insertMany(SEED_APPLICATIONS);
    }
    if (SEED_TEMPLATES.length > 0) {
      await templatesCollection.insertMany(SEED_TEMPLATES);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      counts: {
        jobs: SEED_JOBS.length,
        applications: SEED_APPLICATIONS.length,
        templates: SEED_TEMPLATES.length,
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
