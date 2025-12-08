import { useState } from 'react';
import { LogOut, Briefcase, Users, FileText, Eye, X } from 'lucide-react';

interface Application {
  id: string;
  jobTitle: string;
  applicantName: string;
  email: string;
  phone: string;
  appliedDate: string;
  status: 'new' | 'reviewing' | 'interviewed' | 'rejected' | 'hired';
  resume: string;
  linkedIn?: string;
  portfolio?: string;
  coverLetter?: string;
}

// Mock applications data
const mockApplications: Application[] = [
  {
    id: '1',
    jobTitle: 'Full stack developer',
    applicantName: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    appliedDate: '2025-12-07',
    status: 'new',
    resume: 'john_doe_resume.pdf',
    linkedIn: 'https://linkedin.com/in/johndoe',
    coverLetter: 'I am excited to apply for the Full Stack Developer position...'
  },
  {
    id: '2',
    jobTitle: 'Senior product designer',
    applicantName: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+1 (555) 987-6543',
    appliedDate: '2025-12-06',
    status: 'reviewing',
    resume: 'jane_smith_resume.pdf',
    portfolio: 'https://janesmith.design',
    coverLetter: 'With over 5 years of product design experience...'
  },
  {
    id: '3',
    jobTitle: 'Customer success manager',
    applicantName: 'Mike Johnson',
    email: 'mike.j@email.com',
    phone: '+1 (555) 456-7890',
    appliedDate: '2025-12-05',
    status: 'interviewed',
    resume: 'mike_johnson_resume.pdf',
    linkedIn: 'https://linkedin.com/in/mikejohnson'
  }
];

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [applications] = useState<Application[]>(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'reviewing'>('all');

  const filteredApplications = applications.filter((app) => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });

  const stats = {
    total: applications.length,
    new: applications.filter((a) => a.status === 'new').length,
    reviewing: applications.filter((a) => a.status === 'reviewing').length
  };

  const getStatusColor = (status: Application['status']) => {
    const colors = {
      new: 'bg-blue-100 text-blue-700',
      reviewing: 'bg-yellow-100 text-yellow-700',
      interviewed: 'bg-purple-100 text-purple-700',
      rejected: 'bg-red-100 text-red-700',
      hired: 'bg-green-100 text-green-700'
    };
    return colors[status];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Briefcase className="w-6 h-6" />
            <h1>Job Board Admin</h1>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600">Total Applications</p>
                <p className="text-2xl">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600">New Applications</p>
                <p className="text-2xl">{stats.new}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-600">Under Review</p>
                <p className="text-2xl">{stats.reviewing}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="mb-4">Applications</h2>
            
            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'new'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                New ({stats.new})
              </button>
              <button
                onClick={() => setActiveTab('reviewing')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'reviewing'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Reviewing ({stats.reviewing})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700">Applicant</th>
                  <th className="px-6 py-3 text-left text-gray-700">Position</th>
                  <th className="px-6 py-3 text-left text-gray-700">Contact</th>
                  <th className="px-6 py-3 text-left text-gray-700">Applied Date</th>
                  <th className="px-6 py-3 text-left text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p>{app.applicantName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700">{app.jobTitle}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700">{app.email}</p>
                      <p className="text-gray-500">{app.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700">{app.appliedDate}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedApplication(app)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-start">
              <div>
                <h2 className="mb-2">{selectedApplication.applicantName}</h2>
                <p className="text-gray-600">{selectedApplication.jobTitle}</p>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-8 py-8">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-gray-500 mb-1">Email</p>
                  <p className="text-gray-900">{selectedApplication.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Phone</p>
                  <p className="text-gray-900">{selectedApplication.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Applied Date</p>
                  <p className="text-gray-900">{selectedApplication.appliedDate}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedApplication.status)}`}>
                    {selectedApplication.status}
                  </span>
                </div>
              </div>

              {selectedApplication.linkedIn && (
                <div className="mb-6">
                  <p className="text-gray-500 mb-1">LinkedIn</p>
                  <a href={selectedApplication.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {selectedApplication.linkedIn}
                  </a>
                </div>
              )}

              {selectedApplication.portfolio && (
                <div className="mb-6">
                  <p className="text-gray-500 mb-1">Portfolio</p>
                  <a href={selectedApplication.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {selectedApplication.portfolio}
                  </a>
                </div>
              )}

              <div className="mb-6">
                <p className="text-gray-500 mb-1">Resume</p>
                <p className="text-gray-900">{selectedApplication.resume}</p>
              </div>

              {selectedApplication.coverLetter && (
                <div className="mb-6">
                  <p className="text-gray-500 mb-2">Cover Letter</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedApplication.coverLetter}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
