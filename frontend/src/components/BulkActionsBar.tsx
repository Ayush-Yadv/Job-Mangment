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
  Loader2,
  ChevronUp
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
      {/* Floating Bulk Actions Bar - Fixed at bottom center */}
      <div 
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
        }}
        data-testid="bulk-actions-bar"
      >
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 24px',
            backgroundColor: 'rgba(17, 24, 39, 0.97)',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Selection Count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', borderRight: '1px solid rgba(255,255,255,0.2)', paddingRight: '16px' }}>
            <CheckSquare style={{ width: '20px', height: '20px', color: '#60A5FA' }} />
            <span style={{ fontWeight: 600, fontSize: '14px' }}>{selectedCount} selected</span>
            <button
              onClick={onClearSelection}
              style={{ 
                marginLeft: '8px', 
                padding: '4px', 
                borderRadius: '6px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              title="Clear selection"
            >
              <X style={{ width: '16px', height: '16px', color: 'white' }} />
            </button>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60A5FA', padding: '0 12px' }}>
              <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '14px' }}>Processing...</span>
            </div>
          )}

          {/* Actions */}
          {!isProcessing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {/* Move to Stage */}
              <div style={{ position: 'relative' }}>
                <ActionButton
                  icon={<ArrowRight style={{ width: '16px', height: '16px' }} />}
                  label="Move to"
                  onClick={() => {
                    closeAllMenus();
                    setShowMoveMenu(!showMoveMenu);
                  }}
                  testId="bulk-move-btn"
                />
                
                {showMoveMenu && (
                  <DropdownMenu title="Move to Stage">
                    {PIPELINE_STAGES.map(stage => (
                      <button
                        key={stage.id}
                        onClick={() => handleMoveToStage(stage.id)}
                        style={{
                          width: '100%',
                          padding: '10px 16px',
                          textAlign: 'left',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '14px',
                          color: '#374151',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div 
                          style={{ 
                            width: '10px', 
                            height: '10px', 
                            borderRadius: '50%', 
                            backgroundColor: stage.color 
                          }}
                        />
                        {stage.label}
                      </button>
                    ))}
                  </DropdownMenu>
                )}
              </div>

              {/* Send Email */}
              <ActionButton
                icon={<Mail style={{ width: '16px', height: '16px' }} />}
                label="Email"
                onClick={() => {
                  closeAllMenus();
                  onSendEmail();
                }}
                testId="bulk-email-btn"
              />

              {/* Add/Remove Tag */}
              <div style={{ position: 'relative' }}>
                <ActionButton
                  icon={<Tag style={{ width: '16px', height: '16px' }} />}
                  label="Tag"
                  onClick={() => {
                    closeAllMenus();
                    setShowTagMenu(!showTagMenu);
                  }}
                  testId="bulk-tag-btn"
                />
                
                {showTagMenu && (
                  <DropdownMenu title="Add Tag" width={280}>
                    <div style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="New tag name..."
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '6px',
                            fontSize: '14px',
                            outline: 'none',
                          }}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddNewTag()}
                        />
                        <button
                          onClick={handleAddNewTag}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#2563EB',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            cursor: 'pointer',
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    {availableTags.length > 0 && (
                      <>
                        <div style={{ borderTop: '1px solid #E5E7EB', margin: '8px 0' }} />
                        <div style={{ padding: '8px 16px', fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>
                          Existing Tags
                        </div>
                        {availableTags.map(tag => (
                          <div 
                            key={tag} 
                            style={{ 
                              padding: '8px 16px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              fontSize: '14px',
                            }}
                          >
                            <span style={{ color: '#374151' }}>{tag}</span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => {
                                  onAddTag(tag);
                                  setShowTagMenu(false);
                                }}
                                style={{ fontSize: '12px', color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer' }}
                              >
                                Add
                              </button>
                              <span style={{ color: '#D1D5DB' }}>|</span>
                              <button
                                onClick={() => {
                                  onRemoveTag(tag);
                                  setShowTagMenu(false);
                                }}
                                style={{ fontSize: '12px', color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </DropdownMenu>
                )}
              </div>

              {/* Assign Reviewer */}
              <div style={{ position: 'relative' }}>
                <ActionButton
                  icon={<UserPlus style={{ width: '16px', height: '16px' }} />}
                  label="Assign"
                  onClick={() => {
                    closeAllMenus();
                    setShowAssignMenu(!showAssignMenu);
                  }}
                  testId="bulk-assign-btn"
                />
                
                {showAssignMenu && (
                  <DropdownMenu title="Assign to Reviewer">
                    {availableReviewers.map(reviewer => (
                      <button
                        key={reviewer.id}
                        onClick={() => {
                          onAssignReviewer(reviewer.id);
                          setShowAssignMenu(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 16px',
                          textAlign: 'left',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: '#374151',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        {reviewer.name}
                      </button>
                    ))}
                  </DropdownMenu>
                )}
              </div>

              {/* Export */}
              <div style={{ position: 'relative' }}>
                <ActionButton
                  icon={<Download style={{ width: '16px', height: '16px' }} />}
                  label="Export"
                  onClick={() => {
                    closeAllMenus();
                    setShowExportMenu(!showExportMenu);
                  }}
                  testId="bulk-export-btn"
                />
                
                {showExportMenu && (
                  <DropdownMenu title="Export Format">
                    <button
                      onClick={() => {
                        onExport('csv');
                        setShowExportMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        textAlign: 'left',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#374151',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => {
                        onExport('excel');
                        setShowExportMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        textAlign: 'left',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#374151',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      Export as Excel
                    </button>
                  </DropdownMenu>
                )}
              </div>

              {/* Archive */}
              <ActionButton
                icon={<Archive style={{ width: '16px', height: '16px' }} />}
                label="Archive"
                onClick={handleArchive}
                testId="bulk-archive-btn"
              />

              {/* Delete */}
              <ActionButton
                icon={<Trash2 style={{ width: '16px', height: '16px' }} />}
                label="Delete"
                onClick={handleDelete}
                testId="bulk-delete-btn"
                danger
              />
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            zIndex: 10000,
          }}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              maxWidth: '448px',
              width: '100%',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div 
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  backgroundColor: showConfirmModal === 'delete' ? '#FEE2E2' : '#FEF3C7',
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                <AlertTriangle style={{ width: '24px', height: '24px', color: showConfirmModal === 'delete' ? '#DC2626' : '#D97706' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>
                  {showConfirmModal === 'archive' ? 'Archive Candidates' : 'Delete Candidates'}
                </h3>
                <p style={{ fontSize: '14px', color: '#6B7280', margin: '4px 0 0 0' }}>
                  This action affects {selectedCount} candidate(s)
                </p>
              </div>
            </div>
            
            <p style={{ color: '#374151', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
              {showConfirmModal === 'archive' 
                ? 'Are you sure you want to archive these candidates? They will be moved to the archive and can be restored later.'
                : 'Are you sure you want to permanently delete these candidates? This action cannot be undone.'}
            </p>

            {showConfirmModal === 'delete' && (
              <div 
                style={{ 
                  backgroundColor: '#FEF2F2', 
                  border: '1px solid #FECACA', 
                  borderRadius: '8px', 
                  padding: '12px',
                  marginBottom: '24px'
                }}
              >
                <p style={{ fontSize: '14px', color: '#991B1B', margin: 0 }}>
                  <strong>Warning:</strong> This will permanently remove all candidate data including applications, ratings, and notes.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowConfirmModal(null)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  backgroundColor: showConfirmModal === 'delete' ? '#DC2626' : '#2563EB',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {showConfirmModal === 'archive' ? 'Archive' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS for spin animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

// Action Button Component
function ActionButton({ 
  icon, 
  label, 
  onClick, 
  testId, 
  danger = false 
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void; 
  testId: string;
  danger?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={testId}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 14px',
        backgroundColor: isHovered 
          ? (danger ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.15)') 
          : 'transparent',
        color: danger ? '#F87171' : 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        transition: 'background-color 0.15s',
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// Dropdown Menu Component
function DropdownMenu({ 
  title, 
  children, 
  width = 220 
}: { 
  title: string; 
  children: React.ReactNode; 
  width?: number;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: '8px',
        width: `${width}px`,
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
      }}
    >
      <div 
        style={{ 
          padding: '12px 16px', 
          fontSize: '11px', 
          fontWeight: 600, 
          color: '#6B7280', 
          textTransform: 'uppercase',
          borderBottom: '1px solid #E5E7EB',
          backgroundColor: '#F9FAFB',
        }}
      >
        {title}
      </div>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {children}
      </div>
      {/* Arrow pointing down */}
      <div
        style={{
          position: 'absolute',
          bottom: '-6px',
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
          width: '12px',
          height: '12px',
          backgroundColor: 'white',
          borderRight: '1px solid #E5E7EB',
          borderBottom: '1px solid #E5E7EB',
        }}
      />
    </div>
  );
}
