import { useState } from 'react';
import { X, Upload, CheckCircle } from 'lucide-react';
import { Job } from './JobLanding';

interface ApplicationFormProps {
  job: Job;
  onClose: () => void;
  onBack: () => void;
}

export function ApplicationForm({ job, onClose, onBack }: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedIn: '',
    portfolio: '',
    coverLetter: ''
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store application data (will be enhanced with Supabase)
    console.log('Application submitted:', { ...formData, resume: resumeFile?.name, jobId: job.id });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for applying to the {job.title} position. We'll review your application and get back to you soon.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="mb-2">Apply for {job.title}</h2>
            <p className="text-gray-600">Fill out the form below to submit your application</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-8">
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block mb-2 text-gray-700">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block mb-2 text-gray-700">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-gray-700">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* Phone */}
          <div className="mb-6">
            <label htmlFor="phone" className="block mb-2 text-gray-700">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* LinkedIn */}
          <div className="mb-6">
            <label htmlFor="linkedIn" className="block mb-2 text-gray-700">
              LinkedIn Profile
            </label>
            <input
              type="url"
              id="linkedIn"
              name="linkedIn"
              value={formData.linkedIn}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/yourprofile"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* Portfolio */}
          <div className="mb-6">
            <label htmlFor="portfolio" className="block mb-2 text-gray-700">
              Portfolio/Website
            </label>
            <input
              type="url"
              id="portfolio"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleInputChange}
              placeholder="https://yourportfolio.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* Resume Upload */}
          <div className="mb-6">
            <label htmlFor="resume" className="block mb-2 text-gray-700">
              Resume *
            </label>
            <div className="relative">
              <input
                type="file"
                id="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
                className="hidden"
              />
              <label
                htmlFor="resume"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
              >
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">
                  {resumeFile ? resumeFile.name : 'Upload your resume (PDF, DOC, DOCX)'}
                </span>
              </label>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="mb-8">
            <label htmlFor="coverLetter" className="block mb-2 text-gray-700">
              Cover Letter
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              rows={6}
              placeholder="Tell us why you're interested in this position..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
