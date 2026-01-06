'use client';

import { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  Mail, 
  Archive, 
  Tag, 
  UserPlus, 
  Download, 
  Trash2,
  CheckSquare,
  AlertTriangle,
  Loader2
} from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onMoveToStage: (stage: string) => void;
  onSendEmail: () => void;
  onArchive: () => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onAssignReviewer: (reviewerId: string) => void;
  onExport: (format: 'csv' | 'excel') => void;
  onDelete: () => void;
  isProcessing: boolean;
  availableTags: string[];
  availableReviewers: { id: string; name: string }[];
}

const PIPELINE_STAGES = [
  { id: 'new', label: 'New', color: '#3B82F6' },
  { id: 'screening', label: 'Screening', color: '#F59E0B' },
  { id: 'interview_scheduled', label: 'Interview Scheduled', color: '#8B5CF6' },
  { id: 'interview_complete', label: 'Interview Complete', color: '#6366F1' },
  { id: 'offer_pending', label: 'Offer Pending', color: '#06B6D4' },
  { id: 'hired', label: 'Hired', color: '#10B981' },
  { id: 'rejected', label: 'Rejected', color: '#EF4444' },
  { id: 'on_hold', label: 'On Hold', color: '#6B7280' },
];

export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onMoveToStage,
  onSendEmail,
  onArchive,
  onAddTag,
  onRemoveTag,
  onAssignReviewer,
  onExport,
  onDelete,
  isProcessing,
  availableTags,
  availableReviewers,
}: BulkActionsBarProps) {
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [showAssignMenu, setShowAssignMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState<'archive' | 'delete' | null>(null);
  const [newTag, setNewTag] = useState('');

  if (selectedCount === 0) return null;

  const closeAllMenus = () => {
    setShowMoveMenu(false);
    setShowTagMenu(false);
    setShowAssignMenu(false);
    setShowExportMenu(false);
  };

  const handleMoveToStage = (stage: string) => {
    const sensitiveStages = ['rejected', 'hired'];
    if (sensitiveStages.includes(stage)) {
      if (window.confirm(`Are you sure you want to move ${selectedCount} candidate(s) to "${PIPELINE_STAGES.find(s => s.id === stage)?.label}"?`)) {
        onMoveToStage(stage);
      }
    } else {
      onMoveToStage(stage);
    }
    closeAllMenus();
  };

  const handleArchive = () => {
    closeAllMenus();
    setShowConfirmModal('archive');
  };

  const handleDelete = () => {
    closeAllMenus();
    setShowConfirmModal('delete');
  };

  const confirmAction = () => {
    if (showConfirmModal === 'archive') {
      onArchive();
    } else if (showConfirmModal === 'delete') {
      onDelete();
    }
    setShowConfirmModal(null);
  };

  const handleAddNewTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag('');
      setShowTagMenu(false);
    }
  };

  return (
    <>
      {/* Floating Bulk Actions Bar */}
      <div 
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]"
        data-testid="bulk-actions-bar"
      >
        <div className="flex items-center gap-3 px-6 py-4 bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10">
          {/* Selection Count */}
          <div className="flex items-center gap-2 text-white border-r border-white/20 pr-4">
            <CheckSquare className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-sm">{selectedCount} selected</span>
            <button
              onClick={onClearSelection}
              className="ml-2 p-1 hover:bg-white/10 rounded transition-colors"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-center gap-2 text-blue-400 px-3">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Processing...</span>
            </div>
          )}

          {/* Actions */}
          {!isProcessing && (
            <div className="flex items-center gap-1">
              {/* Move to Stage */}
              <div className="relative">
                <button
                  onClick={() => {
                    closeAllMenus();
                    setShowMoveMenu(!showMoveMenu);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
                  data-testid="bulk-move-btn"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Move to</span>
                </button>
                
                {showMoveMenu && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100 bg-gray-50 rounded-t-xl">
                      Move to Stage
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {PIPELINE_STAGES.map(stage => (
                        <button
                          key={stage.id}
                          onClick={() => handleMoveToStage(stage.id)}
                          className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 text-sm"
                        >
                          <div 
                            className="w-2.5 h-2.5 rounded-full" 
                            style={{ backgroundColor: stage.color }}
                          />
                          {stage.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Send Email */}
              <button
                onClick={() => {
                  closeAllMenus();
                  onSendEmail();
                }}
                className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
                data-testid="bulk-email-btn"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </button>

              {/* Add/Remove Tag */}
              <div className="relative">
                <button
                  onClick={() => {
                    closeAllMenus();
                    setShowTagMenu(!showTagMenu);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
                  data-testid="bulk-tag-btn"
                >
                  <Tag className="w-4 h-4" />
                  <span>Tag</span>
                </button>
                
                {showTagMenu && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100 bg-gray-50 rounded-t-xl">
                      Add Tag
                    </div>
                    <div className="p-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="New tag name..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onKeyDown={(e) => e.key === 'Enter' && handleAddNewTag()}
                        />
                        <button
                          onClick={handleAddNewTag}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    {availableTags.length > 0 && (
                      <>
                        <div className="border-t border-gray-200 my-1" />
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                          Existing Tags
                        </div>
                        <div className="max-h-32 overflow-y-auto">
                          {availableTags.map(tag => (
                            <div key={tag} className="px-4 py-2 flex items-center justify-between hover:bg-gray-50 text-sm">
                              <span className="text-gray-700">{tag}</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    onAddTag(tag);
                                    setShowTagMenu(false);
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  Add
                                </button>
                                <span className="text-gray-300">|</span>
                                <button
                                  onClick={() => {
                                    onRemoveTag(tag);
                                    setShowTagMenu(false);
                                  }}
                                  className="text-xs text-red-600 hover:text-red-800 font-medium"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Assign Reviewer */}
              <div className="relative">
                <button
                  onClick={() => {
                    closeAllMenus();
                    setShowAssignMenu(!showAssignMenu);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
                  data-testid="bulk-assign-btn"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Assign</span>
                </button>
                
                {showAssignMenu && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100 bg-gray-50 rounded-t-xl">
                      Assign to Reviewer
                    </div>
                    {availableReviewers.map(reviewer => (
                      <button
                        key={reviewer.id}
                        onClick={() => {
                          onAssignReviewer(reviewer.id);
                          setShowAssignMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 text-sm"
                      >
                        {reviewer.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Export */}
              <div className="relative">
                <button
                  onClick={() => {
                    closeAllMenus();
                    setShowExportMenu(!showExportMenu);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
                  data-testid="bulk-export-btn"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                
                {showExportMenu && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100 bg-gray-50 rounded-t-xl">
                      Export Format
                    </div>
                    <button
                      onClick={() => {
                        onExport('csv');
                        setShowExportMenu(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 text-sm"
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => {
                        onExport('excel');
                        setShowExportMenu(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 text-sm"
                    >
                      Export as Excel
                    </button>
                  </div>
                )}
              </div>

              {/* Archive */}
              <button
                onClick={handleArchive}
                className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
                data-testid="bulk-archive-btn"
              >
                <Archive className="w-4 h-4" />
                <span>Archive</span>
              </button>

              {/* Delete */}
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors text-sm font-medium"
                data-testid="bulk-delete-btn"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-[10000]">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                showConfirmModal === 'delete' ? 'bg-red-100' : 'bg-amber-100'
              }`}>
                <AlertTriangle className={`w-6 h-6 ${
                  showConfirmModal === 'delete' ? 'text-red-600' : 'text-amber-600'
                }`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {showConfirmModal === 'archive' ? 'Archive Candidates' : 'Delete Candidates'}
                </h3>
                <p className="text-gray-500 text-sm">This action affects {selectedCount} candidate(s)</p>
              </div>
            </div>
            
            <p className="text-gray-700 text-sm mb-6">
              {showConfirmModal === 'archive' 
                ? 'Are you sure you want to archive these candidates? They will be moved to the archive and can be restored later.'
                : 'Are you sure you want to permanently delete these candidates? This action cannot be undone.'}
            </p>

            {showConfirmModal === 'delete' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-red-700">
                  <strong>Warning:</strong> This will permanently remove all candidate data including applications, ratings, and notes.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(null)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${
                  showConfirmModal === 'delete'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {showConfirmModal === 'archive' ? 'Archive' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
