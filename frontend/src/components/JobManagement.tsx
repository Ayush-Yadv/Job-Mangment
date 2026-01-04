import { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Play, 
  Pause, 
  Archive, 
  Trash2, 
  Copy, 
  Edit,
  Clock,
  Users,
  Calendar,
  ChevronDown,
  X,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  PauseCircle,
  ArchiveIcon
} from 'lucide-react';

// Job status types
export type JobStatus = 'draft' | 'published' | 'paused' | 'closed' | 'archived';
export type ClosureReason = 'filled' | 'cancelled' | 'budget' | 'deadline' | 'other';

export interface Job {
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
  benefits?: string[];
  status: JobStatus;
  statusChangedAt: string;
  closureReason?: ClosureReason;
  applicationDeadline?: string;
  createdAt: string;
  updatedAt: string;
  applicationsCount: number;
  templateId?: string;
  category?: string;
}

export interface JobTemplate {
  id: string;
  name: string;
  category: string;
  title: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salaryMin: string;
  salaryMax: string;
  location: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  createdAt: string;
}

interface JobStateHistory {
  id: string;
  jobId: string;
  fromStatus: JobStatus | null;
  toStatus: JobStatus;
  changedAt: string;
  changedBy: string;
  reason?: string;
}

// Status configuration
const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  draft: { 
    label: 'Draft', 
    color: '#6B7280', 
    bgColor: '#F3F4F6',
    icon: <FileText className="w-4 h-4" />
  },
  published: { 
    label: 'Published', 
    color: '#059669', 
    bgColor: '#D1FAE5',
    icon: <CheckCircle2 className="w-4 h-4" />
  },
  paused: { 
    label: 'Paused', 
    color: '#D97706', 
    bgColor: '#FEF3C7',
    icon: <PauseCircle className="w-4 h-4" />
  },
  closed: { 
    label: 'Closed', 
    color: '#DC2626', 
    bgColor: '#FEE2E2',
    icon: <XCircle className="w-4 h-4" />
  },
  archived: { 
    label: 'Archived', 
    color: '#6B7280', 
    bgColor: '#E5E7EB',
    icon: <ArchiveIcon className="w-4 h-4" />
  },
};

// Default job templates
const DEFAULT_TEMPLATES: JobTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Full Stack Developer',
    category: 'Engineering',
    title: 'Full Stack Developer',
    type: 'full-time',
    salaryMin: '$100k',
    salaryMax: '$150k',
    location: 'Remote',
    description: 'We are looking for a skilled Full Stack Developer to join our engineering team.',
    requirements: [
      '3+ years of experience in full-stack development',
      'Proficiency in React, Node.js, and TypeScript',
      'Experience with database design (PostgreSQL, MongoDB)',
      'Strong understanding of RESTful APIs'
    ],
    responsibilities: [
      'Design and develop scalable web applications',
      'Write clean, maintainable code with tests',
      'Collaborate with designers and product managers',
      'Participate in code reviews'
    ],
    benefits: [
      'Competitive salary and equity',
      'Remote-first culture',
      'Health insurance',
      'Learning & development budget'
    ],
    createdAt: '2025-12-01'
  },
  {
    id: 'tpl-2',
    name: 'UI/UX Designer',
    category: 'Design',
    title: 'UI/UX Designer',
    type: 'full-time',
    salaryMin: '$80k',
    salaryMax: '$120k',
    location: 'Hybrid',
    description: 'Join our design team to create beautiful and intuitive user experiences.',
    requirements: [
      '4+ years of product design experience',
      'Expert knowledge of Figma',
      'Strong portfolio demonstrating UX/UI skills',
      'Experience with design systems'
    ],
    responsibilities: [
      'Create wireframes, prototypes, and high-fidelity designs',
      'Conduct user research and usability testing',
      'Maintain and evolve our design system',
      'Collaborate with engineering teams'
    ],
    benefits: [
      'Flexible working hours',
      'Creative environment',
      'Conference attendance',
      'Equipment allowance'
    ],
    createdAt: '2025-12-01'
  },
  {
    id: 'tpl-3',
    name: 'DevOps Engineer',
    category: 'Engineering',
    title: 'DevOps Engineer',
    type: 'full-time',
    salaryMin: '$120k',
    salaryMax: '$180k',
    location: 'Remote',
    description: 'Help us build and maintain robust infrastructure and CI/CD pipelines.',
    requirements: [
      '5+ years of DevOps/SRE experience',
      'Strong knowledge of AWS/GCP/Azure',
      'Experience with Kubernetes and Docker',
      'Proficiency in Infrastructure as Code (Terraform)'
    ],
    responsibilities: [
      'Design and implement CI/CD pipelines',
      'Manage cloud infrastructure',
      'Monitor system performance and reliability',
      'Automate operational tasks'
    ],
    benefits: [
      'Competitive compensation',
      'Work from anywhere',
      'Certification support',
      'Stock options'
    ],
    createdAt: '2025-12-01'
  },
  {
    id: 'tpl-4',
    name: 'Project Manager',
    category: 'Operations',
    title: 'Project Manager',
    type: 'full-time',
    salaryMin: '$90k',
    salaryMax: '$130k',
    location: 'On-site',
    description: 'Lead cross-functional projects and ensure successful delivery.',
    requirements: [
      '5+ years of project management experience',
      'PMP or Agile certification preferred',
      'Experience with project management tools',
      'Strong communication skills'
    ],
    responsibilities: [
      'Plan and execute projects end-to-end',
      'Manage stakeholder expectations',
      'Track progress and report to leadership',
      'Identify and mitigate risks'
    ],
    benefits: [
      'Career growth opportunities',
      'Annual bonus',
      'Health benefits',
      'Paid time off'
    ],
    createdAt: '2025-12-01'
  },
  {
    id: 'tpl-5',
    name: 'Intern (Generic)',
    category: 'Internship',
    title: 'Summer Intern',
    type: 'internship',
    salaryMin: '$25/hr',
    salaryMax: '$35/hr',
    location: 'Hybrid',
    description: 'Join our team for a hands-on learning experience.',
    requirements: [
      'Currently pursuing a relevant degree',
      'Strong willingness to learn',
      'Good communication skills',
      'Available for 10-12 weeks'
    ],
    responsibilities: [
      'Work on real projects with mentorship',
      'Attend team meetings and contribute ideas',
      'Complete assigned tasks and projects',
      'Present work at the end of internship'
    ],
    benefits: [
      'Competitive hourly rate',
      'Mentorship program',
      'Networking opportunities',
      'Potential full-time offer'
    ],
    createdAt: '2025-12-01'
  }
];

// Mock jobs data
const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Strategy & operations',
    type: 'full-time',
    salaryMin: '$120k',
    salaryMax: '$200k',
    location: 'Chennai, Tamilnadu',
    color: '#EC4899',
    description: 'We are looking for a strategic thinker to join our operations team.',
    requirements: ['5+ years of experience', 'Strong analytical skills'],
    responsibilities: ['Develop strategic initiatives', 'Analyze business metrics'],
    status: 'published',
    statusChangedAt: '2025-12-01',
    createdAt: '2025-11-28',
    updatedAt: '2025-12-01',
    applicationsCount: 24,
    applicationDeadline: '2025-12-31'
  },
  {
    id: 'job-2',
    title: 'Full stack developer',
    type: 'full-time',
    salaryMin: '$200k',
    salaryMax: '$400k',
    location: 'Remote',
    color: '#3B82F6',
    description: 'Join our engineering team to build cutting-edge applications.',
    requirements: ['3+ years experience', 'React & Node.js'],
    responsibilities: ['Design and develop web applications', 'Write clean code'],
    status: 'published',
    statusChangedAt: '2025-12-05',
    createdAt: '2025-12-01',
    updatedAt: '2025-12-05',
    applicationsCount: 45,
    applicationDeadline: '2025-12-15'
  },
  {
    id: 'job-3',
    title: 'Senior product designer',
    type: 'full-time',
    salaryMin: '$250k',
    salaryMax: '$400k',
    location: 'Bangalore, Karnataka',
    color: '#F97316',
    description: 'Create intuitive and beautiful user experiences.',
    requirements: ['5+ years design experience', 'Figma expertise'],
    responsibilities: ['Lead design projects', 'Conduct user research'],
    status: 'paused',
    statusChangedAt: '2025-12-08',
    createdAt: '2025-11-20',
    updatedAt: '2025-12-08',
    applicationsCount: 18
  },
  {
    id: 'job-4',
    title: 'Customer success manager',
    type: 'full-time',
    salaryMin: '$225k',
    salaryMax: '$400k',
    location: 'Remote',
    color: '#F472B6',
    description: 'Help our customers succeed.',
    requirements: ['3+ years CS experience', 'CRM knowledge'],
    responsibilities: ['Onboard customers', 'Build relationships'],
    status: 'draft',
    statusChangedAt: '2025-12-10',
    createdAt: '2025-12-10',
    updatedAt: '2025-12-10',
    applicationsCount: 0
  },
  {
    id: 'job-5',
    title: 'Marketing Manager',
    type: 'full-time',
    salaryMin: '$100k',
    salaryMax: '$150k',
    location: 'New York, NY',
    color: '#8B5CF6',
    description: 'Lead our marketing initiatives.',
    requirements: ['5+ years marketing experience'],
    responsibilities: ['Develop marketing strategies'],
    status: 'closed',
    statusChangedAt: '2025-12-05',
    closureReason: 'filled',
    createdAt: '2025-10-15',
    updatedAt: '2025-12-05',
    applicationsCount: 67
  }
];

interface JobManagementProps {
  onBack: () => void;
}

export function JobManagement({ onBack }: JobManagementProps) {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [templates, setTemplates] = useState<JobTemplate[]>(DEFAULT_TEMPLATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
  const [showJobEditor, setShowJobEditor] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [selectedJobForHistory, setSelectedJobForHistory] = useState<Job | null>(null);
  const [actionMenuJob, setActionMenuJob] = useState<string | null>(null);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!job.title.toLowerCase().includes(query) && 
            !job.location.toLowerCase().includes(query)) {
          return false;
        }
      }
      // Status filter
      if (statusFilter !== 'all' && job.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [jobs, searchQuery, statusFilter]);

  // Count by status
  const statusCounts = useMemo(() => {
    const counts: Record<JobStatus | 'all', number> = {
      all: jobs.length,
      draft: 0,
      published: 0,
      paused: 0,
      closed: 0,
      archived: 0
    };
    jobs.forEach(job => {
      counts[job.status]++;
    });
    return counts;
  }, [jobs]);

  // Check if deadline is approaching (within 3 days)
  const isDeadlineApproaching = (deadline?: string) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  };

  const isLastDay = (deadline?: string) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    return deadlineDate.toDateString() === today.toDateString();
  };

  const isDeadlinePassed = (deadline?: string) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    return deadlineDate < today;
  };

  // Status change handlers
  const handlePublish = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: 'published' as JobStatus, statusChangedAt: new Date().toISOString() }
        : job
    ));
    setActionMenuJob(null);
  };

  const handlePause = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: 'paused' as JobStatus, statusChangedAt: new Date().toISOString() }
        : job
    ));
    setActionMenuJob(null);
  };

  const handleClose = (jobId: string, reason: ClosureReason) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: 'closed' as JobStatus, closureReason: reason, statusChangedAt: new Date().toISOString() }
        : job
    ));
    setActionMenuJob(null);
  };

  const handleArchive = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: 'archived' as JobStatus, statusChangedAt: new Date().toISOString() }
        : job
    ));
    setActionMenuJob(null);
  };

  const handleDuplicate = (job: Job) => {
    const newJob: Job = {
      ...job,
      id: `job-${Date.now()}`,
      title: `${job.title} (Copy)`,
      status: 'draft',
      statusChangedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applicationsCount: 0,
      applicationDeadline: undefined
    };
    setJobs(prev => [newJob, ...prev]);
    setActionMenuJob(null);
  };

  const handleCreateFromTemplate = (template: JobTemplate) => {
    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: template.title,
      type: template.type,
      salaryMin: template.salaryMin,
      salaryMax: template.salaryMax,
      location: template.location,
      color: ['#EC4899', '#3B82F6', '#F97316', '#10B981', '#8B5CF6'][Math.floor(Math.random() * 5)],
      description: template.description,
      requirements: [...template.requirements],
      responsibilities: [...template.responsibilities],
      benefits: [...template.benefits],
      status: 'draft',
      statusChangedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applicationsCount: 0,
      templateId: template.id,
      category: template.category
    };
    setJobs(prev => [newJob, ...prev]);
    setShowTemplateSelector(false);
  };

  const handleSaveAsTemplate = (job: Job) => {
    const newTemplate: JobTemplate = {
      id: `tpl-${Date.now()}`,
      name: job.title,
      category: job.category || 'General',
      title: job.title,
      type: job.type,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      location: job.location,
      description: job.description,
      requirements: [...job.requirements],
      responsibilities: [...job.responsibilities],
      benefits: job.benefits || [],
      createdAt: new Date().toISOString()
    };
    setTemplates(prev => [...prev, newTemplate]);
    setActionMenuJob(null);
    alert('Job saved as template!');
  };

  // Get available actions for a job based on its status
  const getAvailableActions = (job: Job) => {
    const actions: { label: string; icon: React.ReactNode; onClick: () => void; danger?: boolean }[] = [];
    
    switch (job.status) {
      case 'draft':
        actions.push({ label: 'Publish', icon: <Play className="w-4 h-4" />, onClick: () => handlePublish(job.id) });
        actions.push({ label: 'Edit', icon: <Edit className="w-4 h-4" />, onClick: () => { setEditingJob(job); setShowJobEditor(true); } });
        break;
      case 'published':
        actions.push({ label: 'Pause', icon: <Pause className="w-4 h-4" />, onClick: () => handlePause(job.id) });
        actions.push({ label: 'Close (Filled)', icon: <XCircle className="w-4 h-4" />, onClick: () => handleClose(job.id, 'filled') });
        actions.push({ label: 'Close (Cancelled)', icon: <XCircle className="w-4 h-4" />, onClick: () => handleClose(job.id, 'cancelled') });
        break;
      case 'paused':
        actions.push({ label: 'Resume', icon: <Play className="w-4 h-4" />, onClick: () => handlePublish(job.id) });
        actions.push({ label: 'Close', icon: <XCircle className="w-4 h-4" />, onClick: () => handleClose(job.id, 'cancelled') });
        break;
      case 'closed':
        actions.push({ label: 'Archive', icon: <Archive className="w-4 h-4" />, onClick: () => handleArchive(job.id) });
        break;
      case 'archived':
        actions.push({ label: 'Clone as Draft', icon: <Copy className="w-4 h-4" />, onClick: () => handleDuplicate(job) });
        break;
    }
    
    // Common actions
    if (job.status !== 'archived') {
      actions.push({ label: 'Duplicate', icon: <Copy className="w-4 h-4" />, onClick: () => handleDuplicate(job) });
      actions.push({ label: 'Save as Template', icon: <FileText className="w-4 h-4" />, onClick: () => handleSaveAsTemplate(job) });
    }
    actions.push({ label: 'View History', icon: <Clock className="w-4 h-4" />, onClick: () => setSelectedJobForHistory(job) });
    
    return actions;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
              <h1 className="text-xl font-semibold">Job Management</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowTemplateManager(true)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Manage Templates
              </button>
              <button
                onClick={() => setShowTemplateSelector(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Job
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {(['all', 'draft', 'published', 'paused', 'closed', 'archived'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-gray-900 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {status === 'all' ? 'All' : STATUS_CONFIG[status].label} ({statusCounts[status]})
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Job Title</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Applications</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Deadline</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Last Updated</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredJobs.map(job => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex-shrink-0"
                        style={{ backgroundColor: job.color }}
                      />
                      <div>
                        <p className="font-medium text-gray-900">{job.title}</p>
                        <p className="text-sm text-gray-500">{job.type} • {job.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: STATUS_CONFIG[job.status].bgColor,
                        color: STATUS_CONFIG[job.status].color
                      }}
                    >
                      {STATUS_CONFIG[job.status].icon}
                      {STATUS_CONFIG[job.status].label}
                    </span>
                    {job.closureReason && (
                      <span className="ml-2 text-xs text-gray-500">
                        ({job.closureReason})
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{job.applicationsCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {job.applicationDeadline ? (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className={`${
                          isDeadlinePassed(job.applicationDeadline) 
                            ? 'text-red-600' 
                            : isLastDay(job.applicationDeadline)
                            ? 'text-red-600 font-medium'
                            : isDeadlineApproaching(job.applicationDeadline)
                            ? 'text-amber-600'
                            : 'text-gray-900'
                        }`}>
                          {new Date(job.applicationDeadline).toLocaleDateString()}
                        </span>
                        {isLastDay(job.applicationDeadline) && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                            Last day!
                          </span>
                        )}
                        {!isLastDay(job.applicationDeadline) && isDeadlineApproaching(job.applicationDeadline) && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                            Closing soon
                          </span>
                        )}
                        {isDeadlinePassed(job.applicationDeadline) && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                            Expired
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">No deadline</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-500 text-sm">
                      {new Date(job.updatedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative">
                      <button
                        onClick={() => setActionMenuJob(actionMenuJob === job.id ? null : job.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>
                      
                      {actionMenuJob === job.id && (
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10">
                          {getAvailableActions(job).map((action, idx) => (
                            <button
                              key={idx}
                              onClick={action.onClick}
                              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-gray-50 ${
                                action.danger ? 'text-red-600' : 'text-gray-700'
                              }`}
                            >
                              {action.icon}
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredJobs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No jobs found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Create New Job</h2>
              <button onClick={() => setShowTemplateSelector(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="mb-6">
                <button
                  onClick={() => {
                    setEditingJob(null);
                    setShowTemplateSelector(false);
                    setShowJobEditor(true);
                  }}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create from Scratch</span>
                </button>
              </div>
              
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-4">Or choose a template</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleCreateFromTemplate(template)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left"
                  >
                    <span className="text-xs font-medium text-blue-600 uppercase">{template.category}</span>
                    <h4 className="font-medium text-gray-900 mt-1">{template.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{template.type} • {template.location}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Manager Modal */}
      {showTemplateManager && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Templates</h2>
              <button onClick={() => setShowTemplateManager(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {templates.map(template => (
                  <div key={template.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <span className="text-xs font-medium text-blue-600 uppercase">{template.category}</span>
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-500">{template.type} • {template.location} • {template.salaryMin} - {template.salaryMax}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCreateFromTemplate(template)}
                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Use Template
                      </button>
                      <button
                        onClick={() => {
                          setTemplates(prev => prev.filter(t => t.id !== template.id));
                        }}
                        className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Editor Modal */}
      {showJobEditor && (
        <JobEditor
          job={editingJob}
          onSave={(job) => {
            if (editingJob) {
              setJobs(prev => prev.map(j => j.id === job.id ? job : j));
            } else {
              setJobs(prev => [job, ...prev]);
            }
            setShowJobEditor(false);
            setEditingJob(null);
          }}
          onClose={() => {
            setShowJobEditor(false);
            setEditingJob(null);
          }}
        />
      )}

      {/* State History Modal */}
      {selectedJobForHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Status History: {selectedJobForHistory.title}</h2>
              <button onClick={() => setSelectedJobForHistory(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: STATUS_CONFIG[selectedJobForHistory.status].bgColor }}>
                    {STATUS_CONFIG[selectedJobForHistory.status].icon}
                  </div>
                  <div>
                    <p className="font-medium">Current: {STATUS_CONFIG[selectedJobForHistory.status].label}</p>
                    <p className="text-sm text-gray-500">Since {new Date(selectedJobForHistory.statusChangedAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="border-l-2 border-gray-200 ml-5 pl-6 space-y-4">
                  <div className="relative">
                    <div className="absolute -left-8 w-3 h-3 bg-gray-300 rounded-full" />
                    <p className="text-sm text-gray-600">Job created</p>
                    <p className="text-xs text-gray-400">{new Date(selectedJobForHistory.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close action menu */}
      {actionMenuJob && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setActionMenuJob(null)}
        />
      )}
    </div>
  );
}

// Job Editor Component
function JobEditor({ job, onSave, onClose }: { job: Job | null; onSave: (job: Job) => void; onClose: () => void }) {
  const [formData, setFormData] = useState<Partial<Job>>(job || {
    title: '',
    type: 'full-time',
    salaryMin: '',
    salaryMax: '',
    location: '',
    color: '#3B82F6',
    description: '',
    requirements: [''],
    responsibilities: [''],
    benefits: [''],
    status: 'draft',
    applicationDeadline: ''
  });

  const handleSave = () => {
    const newJob: Job = {
      id: job?.id || `job-${Date.now()}`,
      title: formData.title || 'Untitled Job',
      type: formData.type || 'full-time',
      salaryMin: formData.salaryMin || '',
      salaryMax: formData.salaryMax || '',
      location: formData.location || '',
      color: formData.color || '#3B82F6',
      description: formData.description || '',
      requirements: (formData.requirements || []).filter(r => r.trim()),
      responsibilities: (formData.responsibilities || []).filter(r => r.trim()),
      benefits: (formData.benefits || []).filter(b => b.trim()),
      status: job?.status || 'draft',
      statusChangedAt: job?.statusChangedAt || new Date().toISOString(),
      createdAt: job?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applicationsCount: job?.applicationsCount || 0,
      applicationDeadline: formData.applicationDeadline || undefined
    };
    onSave(newJob);
  };

  const updateListItem = (field: 'requirements' | 'responsibilities' | 'benefits', index: number, value: string) => {
    const list = [...(formData[field] || [])];
    list[index] = value;
    setFormData(prev => ({ ...prev, [field]: list }));
  };

  const addListItem = (field: 'requirements' | 'responsibilities' | 'benefits') => {
    setFormData(prev => ({ ...prev, [field]: [...(prev[field] || []), ''] }));
  };

  const removeListItem = (field: 'requirements' | 'responsibilities' | 'benefits', index: number) => {
    setFormData(prev => ({ ...prev, [field]: (prev[field] || []).filter((_, i) => i !== index) }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{job ? 'Edit Job' : 'Create New Job'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="e.g. Full Stack Developer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="e.g. Remote, New York, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary Min</label>
              <input
                type="text"
                value={formData.salaryMin}
                onChange={(e) => setFormData(prev => ({ ...prev, salaryMin: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="e.g. $100k"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary Max</label>
              <input
                type="text"
                value={formData.salaryMax}
                onChange={(e) => setFormData(prev => ({ ...prev, salaryMax: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="e.g. $150k"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
              <input
                type="date"
                value={formData.applicationDeadline || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, applicationDeadline: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Describe the role and what makes it exciting..."
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
            {(formData.requirements || []).map((req, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => updateListItem('requirements', idx, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Add a requirement..."
                />
                <button onClick={() => removeListItem('requirements', idx)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button onClick={() => addListItem('requirements')} className="text-sm text-blue-600 hover:text-blue-800">
              + Add requirement
            </button>
          </div>

          {/* Responsibilities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities</label>
            {(formData.responsibilities || []).map((resp, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={resp}
                  onChange={(e) => updateListItem('responsibilities', idx, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Add a responsibility..."
                />
                <button onClick={() => removeListItem('responsibilities', idx)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button onClick={() => addListItem('responsibilities')} className="text-sm text-blue-600 hover:text-blue-800">
              + Add responsibility
            </button>
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
            {(formData.benefits || []).map((benefit, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => updateListItem('benefits', idx, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Add a benefit..."
                />
                <button onClick={() => removeListItem('benefits', idx)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button onClick={() => addListItem('benefits')} className="text-sm text-blue-600 hover:text-blue-800">
              + Add benefit
            </button>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {job ? 'Save Changes' : 'Create Job'}
          </button>
        </div>
      </div>
    </div>
  );
}
