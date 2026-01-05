export type JobStatus = 'draft' | 'published' | 'paused' | 'closed' | 'archived';
export type ClosureReason = 'filled' | 'cancelled' | 'budget' | 'deadline' | 'other';
export type ApplicationStatus = 'new' | 'screening' | 'interview_scheduled' | 'interview_complete' | 'offer' | 'hired' | 'rejected';

export interface Job {
  _id?: string;
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

export interface Application {
  _id?: string;
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
  status: ApplicationStatus;
  rating: number;
  stage: string;
  appliedAt: string;
  notes: Note[];
  ratings: Rating[];
}

export interface Note {
  id: string;
  applicationId: string;
  authorId: string;
  authorName: string;
  noteType: 'general' | 'phone_screen' | 'interview' | 'reference' | 'other';
  content: string;
  isPinned: boolean;
  visibility: 'private' | 'team';
  createdAt: string;
  canEdit: boolean;
}

export interface Rating {
  id: string;
  applicationId: string;
  category: string;
  score: number;
  maxScore: number;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  createdAt: string;
  comment?: string;
}

export interface JobTemplate {
  _id?: string;
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

export interface User {
  _id?: string;
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'recruiter' | 'hiring_manager';
  avatar?: string;
  createdAt: string;
}
