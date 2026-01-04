import { useState } from 'react';
import { ArrowUpRight, Lock, Clock, AlertCircle } from 'lucide-react';
import { JobDialog } from './JobDialog';

export interface Job {
  id: string;
  title: string;
  type: string;
  salaryMin: string;
  salaryMax: string;
  location: string;
  color: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  applicationDeadline?: string;
  status?: 'draft' | 'published' | 'paused' | 'closed' | 'archived';
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Strategy & operations',
    type: 'Full-time',
    salaryMin: '$120k',
    salaryMax: '$200k',
    location: 'Chennai, Tamilnadu',
    color: '#EC4899',
    description: 'We are looking for a strategic thinker to join our operations team and help drive business growth.',
    requirements: [
      '5+ years of experience in strategy or operations',
      'Strong analytical and problem-solving skills',
      'Experience with data analysis and business intelligence tools',
      'Excellent communication and presentation skills'
    ],
    responsibilities: [
      'Develop and implement strategic initiatives',
      'Analyze business metrics and identify opportunities',
      'Collaborate with cross-functional teams',
      'Present findings to leadership team'
    ],
    applicationDeadline: '2026-01-31',
    status: 'published'
  },
  {
    id: '2',
    title: 'Full stack developer',
    type: 'Full-time',
    salaryMin: '$200k',
    salaryMax: '$400k',
    location: 'Remote',
    color: '#3B82F6',
    description: 'Join our engineering team to build cutting-edge web applications using modern technologies.',
    requirements: [
      '3+ years of experience in full-stack development',
      'Proficiency in React, Node.js, and TypeScript',
      'Experience with database design and optimization',
      'Strong understanding of RESTful APIs and GraphQL'
    ],
    responsibilities: [
      'Design and develop scalable web applications',
      'Write clean, maintainable code',
      'Collaborate with designers and product managers',
      'Mentor junior developers'
    ],
    applicationDeadline: '2026-01-07',
    status: 'published'
  },
  {
    id: '3',
    title: 'Senior product designer',
    type: 'Full-time',
    salaryMin: '$250k',
    salaryMax: '$400k',
    location: 'Bangalore, Karnataka',
    color: '#F97316',
    description: 'We are seeking a talented product designer to create intuitive and beautiful user experiences.',
    requirements: [
      '5+ years of product design experience',
      'Expert knowledge of Figma and design systems',
      'Strong portfolio demonstrating UX/UI skills',
      'Experience with user research and testing'
    ],
    responsibilities: [
      'Lead design projects from concept to launch',
      'Create wireframes, prototypes, and high-fidelity designs',
      'Conduct user research and usability testing',
      'Collaborate with engineering and product teams'
    ],
    status: 'published'
  },
  {
    id: '4',
    title: 'Customer success manager',
    type: 'Full-time',
    salaryMin: '$225k',
    salaryMax: '$400k',
    location: 'Remote',
    color: '#F472B6',
    description: 'Help our customers succeed by providing exceptional support and building strong relationships.',
    requirements: [
      '3+ years of customer success experience',
      'Excellent communication and interpersonal skills',
      'Experience with CRM systems',
      'Problem-solving mindset'
    ],
    responsibilities: [
      'Onboard new customers and ensure adoption',
      'Build and maintain customer relationships',
      'Identify upsell and expansion opportunities',
      'Gather customer feedback and insights'
    ],
    applicationDeadline: '2026-01-05',
    status: 'published'
  }
];

interface JobLandingProps {
  onAdminClick: () => void;
}

// Helper functions for deadline display
const getDaysUntilDeadline = (deadline?: string) => {
  if (!deadline) return null;
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);
  return Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

const isDeadlineApproaching = (deadline?: string) => {
  const days = getDaysUntilDeadline(deadline);
  return days !== null && days >= 0 && days <= 3;
};

const isLastDay = (deadline?: string) => {
  const days = getDaysUntilDeadline(deadline);
  return days === 0;
};

const isDeadlinePassed = (deadline?: string) => {
  const days = getDaysUntilDeadline(deadline);
  return days !== null && days < 0;
};

const formatDeadline = (deadline?: string) => {
  if (!deadline) return null;
  return new Date(deadline).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

export function JobLanding({ onAdminClick }: JobLandingProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Only show published jobs that are not past deadline
  const activeJobs = mockJobs.filter(job => {
    if (job.status && job.status !== 'published') return false;
    if (job.applicationDeadline && isDeadlinePassed(job.applicationDeadline)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-gray-600">Teams 24 Careers</h2>
          <button
            onClick={onAdminClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Admin Login"
          >
            <Lock className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="h-px bg-gray-200 mb-12" />

        {/* Title and View All Button */}
        <div className="flex justify-between items-center mb-12">
          <h1>Open positions</h1>
          <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
            View all openings
          </button>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {activeJobs.map((job) => {
            const daysUntil = getDaysUntilDeadline(job.applicationDeadline);
            const approaching = isDeadlineApproaching(job.applicationDeadline);
            const lastDay = isLastDay(job.applicationDeadline);
            
            return (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`flex items-center gap-4 py-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 -mx-6 px-6 transition-colors ${
                  approaching ? 'bg-amber-50/50 hover:bg-amber-50' : ''
                }`}
                data-testid={`job-card-${job.id}`}
              >
                {/* Color Circle */}
                <div
                  className="w-10 h-10 rounded-full flex-shrink-0"
                  style={{ backgroundColor: job.color }}
                />

                {/* Job Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3>{job.title}</h3>
                    {lastDay && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Last day to apply!
                      </span>
                    )}
                    {!lastDay && approaching && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Closing soon
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">
                    {job.type} • {job.salaryMin} - {job.salaryMax} • {job.location}
                  </p>
                  {job.applicationDeadline && (
                    <p className={`text-sm mt-1 flex items-center gap-1 ${
                      lastDay ? 'text-red-600 font-medium' : 
                      approaching ? 'text-amber-600' : 'text-gray-500'
                    }`}>
                      <Clock className="w-3 h-3" />
                      Apply by {formatDeadline(job.applicationDeadline)}
                      {daysUntil !== null && daysUntil > 0 && daysUntil <= 7 && (
                        <span className="ml-1">
                          ({daysUntil} day{daysUntil !== 1 ? 's' : ''} left)
                        </span>
                      )}
                    </p>
                  )}
                </div>

                {/* Arrow Icon */}
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
              </div>
            );
          })}
          
          {activeJobs.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              No open positions at the moment. Check back soon!
            </div>
          )}
        </div>
      </div>

      {/* Job Dialog */}
      {selectedJob && (
        <JobDialog job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}
