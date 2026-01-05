'use client';

import { useState } from 'react';
import { Star, Plus, X, User } from 'lucide-react';

interface Rating {
  id: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  category?: string;
  createdAt: string;
}

interface CandidateRatingProps {
  applicationId: string;
  ratings: Rating[];
  onAddRating: (rating: number, category?: string) => void;
}

const RATING_CATEGORIES = [
  { id: 'technical', label: 'Technical Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'communication', label: 'Communication' },
  { id: 'culture_fit', label: 'Culture Fit' },
  { id: 'overall', label: 'Overall' },
];

export function CandidateRating({ applicationId, ratings, onAddRating }: CandidateRatingProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newCategory, setNewCategory] = useState('overall');
  const [hoverRating, setHoverRating] = useState(0);

  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;

  const handleSubmit = () => {
    if (newRating > 0) {
      onAddRating(newRating, newCategory);
      setNewRating(0);
      setNewCategory('overall');
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Candidate Rating</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Rating
        </button>
      </div>

      {/* Overall Rating */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <span className="text-sm text-gray-500">
            Based on {ratings.length} {ratings.length === 1 ? 'review' : 'reviews'}
          </span>
        </div>
      </div>

      {/* Individual Ratings */}
      {ratings.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Individual Ratings</h4>
          {ratings.map((rating) => (
            <div key={rating.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{rating.reviewerName}</p>
                  <p className="text-xs text-gray-500">
                    {RATING_CATEGORIES.find(c => c.id === rating.category)?.label || 'Overall'} • {rating.createdAt}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Rating Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Rating</h3>
              <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {RATING_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoverRating || newRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-lg font-semibold text-gray-700">
                    {newRating > 0 ? newRating : '-'}/5
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={newRating === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Rating
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
