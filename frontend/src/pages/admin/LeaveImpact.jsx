import React, { useState, useEffect, useCallback } from 'react';
import {
  getLeaveImpact,
  getPendingLeaves,
  approveLeave,
  rejectLeave,
} from '../../features/leaveImpact/leaveImpact.service';

/**
 * LeaveImpact Component
 * Differentiator 2: Smart Leave Decision Support & Staffing Impact Simulation.
 * Owned by: Kaustubh (Team Leader)
 */
export default function LeaveImpact() {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [impactData, setImpactData] = useState(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingImpact, setIsLoadingImpact] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState(null);

  // Modal state for rejection rationale or approval notes
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'approve' | 'reject'
  const [actionComments, setActionComments] = useState('');

  // 1. Fetch pending leaves list
  const fetchPendingQueue = useCallback(async () => {
    setIsLoadingList(true);
    setError(null);
    try {
      const response = await getPendingLeaves();
      const leaves = response?.data || response || [];
      setPendingLeaves(leaves);

      // Auto-select first pending leave if none selected or previous one no longer exists
      if (leaves.length > 0) {
        if (!selectedLeaveId || !leaves.some((l) => (l._id || l.id) === selectedLeaveId)) {
          setSelectedLeaveId(leaves[0]._id || leaves[0].id);
        }
      } else {
        setSelectedLeaveId(null);
        setImpactData(null);
      }
    } catch (err) {
      console.error('Failed to fetch pending leaves:', err);
      setError(err?.message || 'Could not load pending leave requests.');
    } finally {
      setIsLoadingList(false);
    }
  }, [selectedLeaveId]);

  // 2. Fetch impact assessment when selected leave changes
  const fetchImpactForSelectedLeave = useCallback(async (leaveId) => {
    if (!leaveId) return;
    setIsLoadingImpact(true);
    setError(null);
    try {
      const response = await getLeaveImpact(leaveId);
      const data = response?.data || response;
      setImpactData(data);
    } catch (err) {
      console.error('Failed to calculate leave impact:', err);
      setError(err?.message || 'Failed to simulate leave staffing impact.');
    } finally {
      setIsLoadingImpact(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingQueue();
  }, [fetchPendingQueue]);

  useEffect(() => {
    if (selectedLeaveId) {
      fetchImpactForSelectedLeave(selectedLeaveId);
    }
  }, [selectedLeaveId, fetchImpactForSelectedLeave]);

  // Handle open decision confirmation modal
  const handleOpenActionModal = (actionType) => {
    setModalAction(actionType);
    setActionComments('');
    setIsModalOpen(true);
  };

  // Execute approval or rejection
  const handleConfirmDecision = async () => {
    if (!selectedLeaveId || !modalAction) return;
    setActionLoading(true);
    setError(null);
    setActionSuccessMessage(null);

    try {
      if (modalAction === 'approve') {
        await approveLeave(selectedLeaveId, actionComments);
        setActionSuccessMessage('Leave request successfully approved.');
      } else if (modalAction === 'reject') {
        await rejectLeave(selectedLeaveId, actionComments);
        setActionSuccessMessage('Leave request has been rejected with documented reason.');
      }
      setIsModalOpen(false);
      // Refresh pending queue
      await fetchPendingQueue();
    } catch (err) {
      console.error(`Failed to ${modalAction} leave:`, err);
      setError(err?.message || `Failed to process ${modalAction} action.`);
    } finally {
      setActionLoading(false);
    }
  };

  // Helper for risk badge styling
  const getRiskStyles = (risk) => {
    switch (risk?.toUpperCase()) {
      case 'LOW':
        return { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0', barColor: '#10b981' };
      case 'MEDIUM':
        return { bg: '#fffbeb', text: '#d97706', border: '#fde68a', barColor: '#f59e0b' };
      case 'HIGH':
        return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', barColor: '#ef4444' };
      case 'CRITICAL':
        return { bg: '#450a0a', text: '#fecaca', border: '#7f1d1d', barColor: '#991b1b' };
      default:
        return { bg: '#f3f4f6', text: '#4b5563', border: '#e5e7eb', barColor: '#94a3b8' };
    }
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.titleRow}>
            <h1 style={styles.title}>Smart Leave Impact</h1>
            <span style={styles.badgeDecisionSupport}>DECISION SUPPORT</span>
          </div>
          <p style={styles.subtitle}>
            Proactive team capacity simulation and deterministic overlap risk analysis before leave approval.
          </p>
        </div>
        <button
          onClick={fetchPendingQueue}
          disabled={isLoadingList}
          style={styles.refreshBtn}
          title="Refresh pending leave queue"
        >
          <svg style={{ ...styles.icon, ...(isLoadingList ? styles.spinning : {}) }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{isLoadingList ? 'Checking...' : 'Refresh Queue'}</span>
        </button>
      </div>

      {/* Action Notification Alert */}
      {actionSuccessMessage && (
        <div style={styles.successBanner}>
          <svg style={styles.successIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{actionSuccessMessage}</span>
          <button onClick={() => setActionSuccessMessage(null)} style={styles.dismissBtn}>✕</button>
        </div>
      )}

      {/* Global Error Alert */}
      {error && (
        <div style={styles.errorBanner}>
          <div style={styles.errorContent}>
            <svg style={styles.errorIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} style={styles.dismissBtn}>✕</button>
        </div>
      )}

      {/* Main Content Layout: Left Queue + Right Analysis Panel */}
      <div style={styles.splitLayout}>
        {/* Left Column: Pending Leave Requests Queue */}
        <div style={styles.leftCol}>
          <div style={styles.queueHeader}>
            <h2 style={styles.queueTitle}>
              Pending Review ({pendingLeaves.length})
            </h2>
            <span style={styles.queueSub}>Select a request to simulate impact</span>
          </div>

          {isLoadingList && (
            <div style={styles.loadingBox}>
              <div style={styles.spinner} />
              <p style={styles.mutedText}>Loading leave queue...</p>
            </div>
          )}

          {!isLoadingList && pendingLeaves.length === 0 && (
            <div style={styles.emptyQueueBox}>
              <svg style={styles.emptyQueueIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
              <h4 style={styles.emptyQueueTitle}>All Caught Up</h4>
              <p style={styles.emptyQueueText}>There are no pending leave requests awaiting approval.</p>
            </div>
          )}

          <div style={styles.queueList}>
            {pendingLeaves.map((leave) => {
              const id = leave._id || leave.id;
              const isSelected = id === selectedLeaveId;
              return (
                <div
                  key={id}
                  onClick={() => setSelectedLeaveId(id)}
                  style={{
                    ...styles.queueItem,
                    ...(isSelected ? styles.queueItemSelected : {}),
                  }}
                >
                  <div style={styles.queueItemTop}>
                    <span style={styles.queueItemName}>{leave.employeeName || leave.employeeId || 'Employee'}</span>
                    <span style={styles.queueItemDays}>{leave.days || 1} day{(leave.days || 1) > 1 ? 's' : ''}</span>
                  </div>
                  <div style={styles.queueItemMeta}>
                    <span style={styles.queueItemDept}>{leave.department || 'General'}</span>
                    <span style={styles.queueItemDates}>
                      {leave.startDate} → {leave.endDate}
                    </span>
                  </div>
                  {leave.leaveType && (
                    <span style={styles.queueItemType}>{leave.leaveType}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Impact Assessment & Decision Panel */}
        <div style={styles.rightCol}>
          {isLoadingImpact && (
            <div style={styles.loadingImpactContainer}>
              <div style={styles.spinner} />
              <p style={styles.loadingText}>Simulating department coverage and evaluating overlap risks...</p>
            </div>
          )}

          {!isLoadingImpact && !impactData && (
            <div style={styles.emptyImpactState}>
              <svg style={styles.emptyIllustration} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 style={styles.emptyImpactTitle}>No Leave Request Selected</h3>
              <p style={styles.emptyImpactDesc}>
                Select a pending leave request from the queue on the left to see deterministic staffing impact and coverage drop analysis.
              </p>
            </div>
          )}

          {!isLoadingImpact && impactData && (
            <div style={styles.impactCard}>
              {/* Top Banner: Employee & Leave Profile */}
              <div style={styles.impactHeader}>
                <div>
                  <div style={styles.applicantNameRow}>
                    <h2 style={styles.applicantName}>{impactData.employeeName || 'Employee Request'}</h2>
                    <span style={styles.applicantIdBadge}>{impactData.employeeId || 'EMP'}</span>
                  </div>
                  <p style={styles.applicantMeta}>
                    {impactData.position || 'Staff'} • <strong>{impactData.department || 'General'}</strong>
                  </p>
                </div>

                <div style={styles.datesBox}>
                  <span style={styles.datesLabel}>Requested Window</span>
                  <span style={styles.datesValue}>
                    {impactData.startDate} — {impactData.endDate} ({impactData.days || 1} day{(impactData.days || 1) > 1 ? 's' : ''})
                  </span>
                  {impactData.reason && (
                    <span style={styles.reasonText}>"{impactData.reason}"</span>
                  )}
                </div>
              </div>

              {/* Coverage Simulation Section */}
              <div style={styles.simulationSection}>
                <h3 style={styles.sectionHeading}>Team Coverage Simulation</h3>
                
                <div style={styles.coverageGrid}>
                  {/* Current Coverage */}
                  <div style={styles.coverageMetricBox}>
                    <span style={styles.coverageLabel}>Current Coverage</span>
                    <span style={styles.coverageNumber}>{impactData.currentTeamCoverage ?? 100}%</span>
                    <div style={styles.gaugeBg}>
                      <div
                        style={{
                          ...styles.gaugeFill,
                          width: `${Math.min(impactData.currentTeamCoverage ?? 100, 100)}%`,
                          backgroundColor: '#10b981',
                        }}
                      />
                    </div>
                  </div>

                  {/* Projected Coverage */}
                  <div style={styles.coverageMetricBox}>
                    <span style={styles.coverageLabel}>Projected Coverage (If Approved)</span>
                    <span
                      style={{
                        ...styles.coverageNumber,
                        color: (impactData.projectedTeamCoverage ?? 0) < 70 ? '#dc2626' : (impactData.projectedTeamCoverage ?? 0) < 85 ? '#d97706' : '#059669',
                      }}
                    >
                      {impactData.projectedTeamCoverage ?? 0}%
                    </span>
                    <div style={styles.gaugeBg}>
                      <div
                        style={{
                          ...styles.gaugeFill,
                          width: `${Math.min(impactData.projectedTeamCoverage ?? 0, 100)}%`,
                          backgroundColor: (impactData.projectedTeamCoverage ?? 0) < 70 ? '#ef4444' : (impactData.projectedTeamCoverage ?? 0) < 85 ? '#f59e0b' : '#10b981',
                        }}
                      />
                    </div>
                  </div>

                  {/* Coverage Drop Delta */}
                  <div style={styles.coverageDeltaBox}>
                    <span style={styles.coverageLabel}>Projected Drop</span>
                    <span style={styles.deltaNumber}>
                      -{impactData.coverageDrop ?? ((impactData.currentTeamCoverage ?? 100) - (impactData.projectedTeamCoverage ?? 100))}%
                    </span>
                    <span style={styles.deltaSub}>
                      {impactData.unavailableCount ?? 1} total member{(impactData.unavailableCount ?? 1) > 1 ? 's' : ''} unavailable
                    </span>
                  </div>
                </div>
              </div>

              {/* Staffing Risk & Reasons */}
              <div style={styles.riskSection}>
                <div style={styles.riskTitleRow}>
                  <h3 style={styles.sectionHeading}>Staffing Risk Assessment</h3>
                  {(() => {
                    const badge = getRiskStyles(impactData.riskLevel);
                    return (
                      <span
                        style={{
                          ...styles.riskBadge,
                          backgroundColor: badge.bg,
                          color: badge.text,
                          borderColor: badge.border,
                        }}
                      >
                        {(impactData.riskLevel || 'LOW').toUpperCase()} RISK
                      </span>
                    );
                  })()}
                </div>

                {impactData.riskReasons && impactData.riskReasons.length > 0 && (
                  <ul style={styles.riskReasonsList}>
                    {impactData.riskReasons.map((reason, idx) => (
                      <li key={idx} style={styles.riskReasonItem}>
                        <svg style={styles.riskReasonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Overlapping Leaves Conflicts */}
                <div style={styles.overlapSection}>
                  <h4 style={styles.overlapTitle}>
                    Concurrent Team Leaves in Window ({impactData.overlappingLeaves?.length || 0})
                  </h4>
                  {(!impactData.overlappingLeaves || impactData.overlappingLeaves.length === 0) ? (
                    <p style={styles.noOverlapText}>No overlapping leaves scheduled in {impactData.department || 'this team'}.</p>
                  ) : (
                    <div style={styles.overlapList}>
                      {impactData.overlappingLeaves.map((conflict, i) => (
                        <div key={i} style={styles.overlapCard}>
                          <div style={styles.overlapCardTop}>
                            <span style={styles.conflictName}>{conflict.employeeName}</span>
                            <span style={styles.conflictStatus}>{conflict.status || 'Approved'}</span>
                          </div>
                          <span style={styles.conflictDates}>
                            {conflict.startDate} → {conflict.endDate}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* System Recommendation */}
                {impactData.recommendation && (
                  <div style={styles.recommendationBox}>
                    <div style={styles.recommendationHeader}>
                      <svg style={styles.recommendationIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <strong>System Recommendation</strong>
                    </div>
                    <p style={styles.recommendationText}>{impactData.recommendation}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={styles.actionBar}>
                <div style={styles.actionPrompt}>
                  <span>Make an executive decision for this request:</span>
                </div>
                <div style={styles.btnGroup}>
                  <button
                    onClick={() => handleOpenActionModal('reject')}
                    disabled={actionLoading}
                    style={styles.rejectBtn}
                  >
                    Reject Request
                  </button>
                  <button
                    onClick={() => handleOpenActionModal('approve')}
                    disabled={actionLoading}
                    style={styles.approveBtn}
                  >
                    Approve Leave
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decision Confirmation Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>
              Confirm {modalAction === 'approve' ? 'Approval' : 'Rejection'}
            </h3>
            <p style={styles.modalDesc}>
              {modalAction === 'approve'
                ? `Are you sure you want to approve leave for ${impactData?.employeeName}? Projected team coverage will be ${impactData?.projectedTeamCoverage}%.`
                : `Please provide a reason or constructive guidance for rejecting ${impactData?.employeeName}'s leave request.`}
            </p>

            <label style={styles.modalLabel}>Decision Notes / Comments (Optional):</label>
            <textarea
              value={actionComments}
              onChange={(e) => setActionComments(e.target.value)}
              placeholder={
                modalAction === 'approve'
                  ? 'e.g., Approved with alternate shift coverage arranged.'
                  : 'e.g., Critical staffing deficit in Customer Support for Aug 25-27. Please consider rescheduling to Aug 28.'
              }
              rows={3}
              style={styles.modalTextarea}
            />

            <div style={styles.modalBtnRow}>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={actionLoading}
                style={styles.modalCancelBtn}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecision}
                disabled={actionLoading}
                style={{
                  ...styles.modalConfirmBtn,
                  backgroundColor: modalAction === 'approve' ? '#059669' : '#dc2626',
                }}
              >
                {actionLoading ? 'Processing...' : modalAction === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Clean inline styles adhering to DayFlow design tokens
const styles = {
  container: {
    padding: '28px',
    maxWidth: '1320px',
    margin: '0 auto',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#1e293b',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '24px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '6px',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  badgeDecisionSupport: {
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.05em',
    color: '#4338ca',
    backgroundColor: '#eef2ff',
    border: '1px solid #c7d2fe',
    borderRadius: '9999px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  refreshBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  icon: {
    width: '16px',
    height: '16px',
  },
  spinning: {
    animation: 'spin 1s linear infinite',
  },
  successBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 18px',
    backgroundColor: '#ecfdf5',
    border: '1px solid #a7f3d0',
    borderRadius: '10px',
    color: '#065f46',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '20px',
  },
  successIcon: {
    width: '20px',
    height: '20px',
    color: '#059669',
    marginRight: '8px',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 18px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '10px',
    color: '#991b1b',
    fontSize: '14px',
    marginBottom: '20px',
  },
  errorContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  errorIcon: {
    width: '20px',
    height: '20px',
    color: '#dc2626',
  },
  dismissBtn: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: 'inherit',
    cursor: 'pointer',
  },
  splitLayout: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: '24px',
    alignItems: 'start',
  },
  leftCol: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    border: '1px solid #e2e8f0',
    padding: '18px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
  },
  queueHeader: {
    marginBottom: '14px',
    paddingBottom: '12px',
    borderBottom: '1px solid #f1f5f9',
  },
  queueTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 2px 0',
  },
  queueSub: {
    fontSize: '12px',
    color: '#64748b',
  },
  queueList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '600px',
    overflowY: 'auto',
  },
  queueItem: {
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  queueItemSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 1px #3b82f6',
  },
  queueItemTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  queueItemName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0f172a',
  },
  queueItemDays: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#2563eb',
    backgroundColor: '#dbeafe',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  queueItemMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: '#64748b',
    marginBottom: '4px',
  },
  queueItemDept: {
    fontWeight: '500',
  },
  queueItemDates: {
    color: '#475569',
  },
  queueItemType: {
    display: 'inline-block',
    fontSize: '10px',
    fontWeight: '600',
    color: '#475569',
    backgroundColor: '#f1f5f9',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  loadingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px 10px',
  },
  emptyQueueBox: {
    textAlign: 'center',
    padding: '30px 10px',
  },
  emptyQueueIcon: {
    width: '32px',
    height: '32px',
    color: '#10b981',
    marginBottom: '8px',
  },
  emptyQueueTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 4px 0',
  },
  emptyQueueText: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  },
  rightCol: {
    minHeight: '400px',
  },
  loadingImpactContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    border: '1px solid #e2e8f0',
  },
  spinner: {
    width: '36px',
    height: '36px',
    border: '3px solid #e2e8f0',
    borderTopColor: '#2563eb',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    marginBottom: '12px',
  },
  loadingText: {
    fontSize: '14px',
    color: '#64748b',
  },
  emptyImpactState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '70px 30px',
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
  },
  emptyIllustration: {
    width: '54px',
    height: '54px',
    color: '#94a3b8',
    marginBottom: '14px',
  },
  emptyImpactTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 8px 0',
  },
  emptyImpactDesc: {
    fontSize: '14px',
    color: '#64748b',
    maxWidth: '440px',
    margin: 0,
  },
  impactCard: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    border: '1px solid #e2e8f0',
    padding: '26px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  impactHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '16px',
    paddingBottom: '20px',
    borderBottom: '1px solid #f1f5f9',
  },
  applicantNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '4px',
  },
  applicantName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  applicantIdBadge: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    padding: '2px 8px',
    borderRadius: '6px',
  },
  applicantMeta: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0,
  },
  datesBox: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '10px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  datesLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  datesValue: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0f172a',
  },
  reasonText: {
    fontSize: '12px',
    fontStyle: 'italic',
    color: '#475569',
    marginTop: '2px',
  },
  simulationSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  sectionHeading: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  coverageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },
  coverageMetricBox: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '16px',
  },
  coverageLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    display: 'block',
    marginBottom: '6px',
  },
  coverageNumber: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    display: 'block',
    marginBottom: '10px',
  },
  gaugeBg: {
    height: '6px',
    backgroundColor: '#e2e8f0',
    borderRadius: '9999px',
    overflow: 'hidden',
  },
  gaugeFill: {
    height: '100%',
    borderRadius: '9999px',
    transition: 'width 0.4s ease',
  },
  coverageDeltaBox: {
    backgroundColor: '#fff1f2',
    border: '1px solid #fecdd3',
    borderRadius: '12px',
    padding: '16px',
  },
  deltaNumber: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#e11d48',
    display: 'block',
    marginBottom: '4px',
  },
  deltaSub: {
    fontSize: '12px',
    color: '#9f1239',
    fontWeight: '500',
  },
  riskSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    backgroundColor: '#fafaf9',
    border: '1px solid #e7e5e4',
    borderRadius: '12px',
    padding: '20px',
  },
  riskTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riskBadge: {
    fontSize: '12px',
    fontWeight: '800',
    padding: '4px 12px',
    borderRadius: '8px',
    borderWidth: '1px',
    borderStyle: 'solid',
    letterSpacing: '0.05em',
  },
  riskReasonsList: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  riskReasonItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '13px',
    color: '#44403c',
    lineHeight: '1.45',
  },
  riskReasonIcon: {
    width: '16px',
    height: '16px',
    color: '#e11d48',
    flexShrink: 0,
    marginTop: '2px',
  },
  overlapSection: {
    marginTop: '6px',
  },
  overlapTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1c1917',
    margin: '0 0 8px 0',
  },
  noOverlapText: {
    fontSize: '12px',
    color: '#78716c',
    fontStyle: 'italic',
    margin: 0,
  },
  overlapList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '10px',
  },
  overlapCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e7e5e4',
    borderRadius: '8px',
    padding: '10px 12px',
  },
  overlapCardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    marginBottom: '2px',
  },
  conflictName: {
    fontWeight: '700',
    color: '#1c1917',
  },
  conflictStatus: {
    fontSize: '10px',
    fontWeight: '600',
    color: '#059669',
    backgroundColor: '#ecfdf5',
    padding: '1px 6px',
    borderRadius: '4px',
  },
  conflictDates: {
    fontSize: '11px',
    color: '#78716c',
  },
  recommendationBox: {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '10px',
    padding: '14px 16px',
    marginTop: '4px',
  },
  recommendationHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#0369a1',
    marginBottom: '4px',
  },
  recommendationIcon: {
    width: '18px',
    height: '18px',
    color: '#0284c7',
  },
  recommendationText: {
    fontSize: '13px',
    color: '#0c4a6e',
    margin: 0,
    lineHeight: '1.4',
  },
  actionBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #f1f5f9',
  },
  actionPrompt: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
  },
  btnGroup: {
    display: 'flex',
    gap: '12px',
  },
  rejectBtn: {
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#b91c1c',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  approveBtn: {
    padding: '10px 22px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#ffffff',
    backgroundColor: '#059669',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
    transition: 'all 0.2s ease',
  },
  mutedText: {
    fontSize: '12px',
    color: '#94a3b8',
    margin: 0,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    maxWidth: '480px',
    width: '100%',
    padding: '28px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 8px 0',
  },
  modalDesc: {
    fontSize: '14px',
    color: '#64748b',
    margin: '0 0 18px 0',
    lineHeight: '1.45',
  },
  modalLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#475569',
    display: 'block',
    marginBottom: '6px',
  },
  modalTextarea: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '13px',
    fontFamily: 'inherit',
    color: '#1e293b',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    resize: 'vertical',
    boxSizing: 'border-box',
    marginBottom: '20px',
    outline: 'none',
  },
  modalBtnRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  modalCancelBtn: {
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
    backgroundColor: '#f1f5f9',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  modalConfirmBtn: {
    padding: '8px 20px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};
