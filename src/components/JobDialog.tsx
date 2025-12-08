import { useState } from 'react';
import { X } from 'lucide-react';
import { Job } from './JobLanding';
import { ApplicationForm } from './ApplicationForm';

interface JobDialogProps {
  job: Job;
  onClose: () => void;
}

export function JobDialog({ job, onClose }: JobDialogProps) {
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  if (showApplicationForm) {
    return (
      <ApplicationForm
        job={job}
        onClose={onClose}
        onBack={() => setShowApplicationForm(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-start">
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-full flex-shrink-0"
              style={{ backgroundColor: job.color }}
            />
            <div>
              <h2 className="mb-2">{job.title}</h2>
              <p className="text-gray-600">
                {job.type} • {job.salaryMin} - {job.salaryMax} • {job.location}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          {/* Description */}
          <div className="mb-8">
            <h3 className="mb-4">About the role</h3>
            <p className="text-gray-700">{job.description}</p>
          </div>

          {/* Requirements */}
          <div className="mb-8">
            <h3 className="mb-4">Requirements</h3>
            <ul className="space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-gray-400 flex-shrink-0">•</span>
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Responsibilities */}
          <div className="mb-8">
            <h3 className="mb-4">Responsibilities</h3>
            <ul className="space-y-2">
              {job.responsibilities.map((resp, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-gray-400 flex-shrink-0">•</span>
                  <span className="text-gray-700">{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Apply Button */}
          <button
            onClick={() => setShowApplicationForm(true)}
            className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Apply for this position
          </button>
        </div>
      </div>
    </div>
  );
}
