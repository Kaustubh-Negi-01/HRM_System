import React, { useState, useEffect, useCallback } from 'react';
import { getWorkforcePulse, getWorkforceTrends } from '../../features/workforce/workforce.service';

/**
 * WorkforcePulse Component
 * Differentiator 1: Live snapshot of workforce health, coverage & staffing risks.
 * Owned by: Kaustubh (Team Leader)
 */
export default function WorkforcePulse() {
  const [pulseData, setPulseData] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [trendDays, setTrendDays] = useState(7);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchPulseAndTrends = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Consume Saksham's feature service functions
      const [pulseResponse, trendsResponse] = await Promise.all([
        getWorkforcePulse(),
        getWorkforceTrends(trendDays),
      ]);

      const pulse = pulseResponse?.data || pulseResponse;
      const trends = trendsResponse?.data?.trend || trendsResponse?.trend || [];

      setPulseData(pulse);
      setTrendData(trends);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to load Workforce Pulse data:', err);
      setError(err?.message || 'Failed to retrieve workforce metrics from the server.');
    } finally {
      setIsLoading(false);
    }
  }, [trendDays]);

  useEffect(() => {
    fetchPulseAndTrends();
  }, [fetchPulseAndTrends]);

  // Helper for risk badge colors
  const getRiskBadgeStyles = (risk) => {
    switch (risk?.toUpperCase()) {
      case 'LOW':
        return { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' };
      case 'MEDIUM':
        return { bg: '#fffbeb', text: '#d97706', border: '#fde68a' };
      case 'HIGH':
      case 'CRITICAL':
        return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' };
      default:
        return { bg: '#f3f4f6', text: '#4b5563', border: '#e5e7eb' };
    }
  };

  // Helper for alert severity
  const getAlertSeverityStyles = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
      case 'critical':
        return { bg: '#fef2f2', border: '#f87171', badgeBg: '#fee2e2', text: '#991b1b', iconColor: '#dc2626' };
      case 'medium':
        return { bg: '#fffbeb', border: '#fbbf24', badgeBg: '#fef3c7', text: '#92400e', iconColor: '#d97706' };
      case 'low':
      case 'info':
      default:
        return { bg: '#eff6ff', border: '#60a5fa', badgeBg: '#dbeafe', text: '#1e40af', iconColor: '#2563eb' };
    }
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.titleRow}>
            <h1 style={styles.title}>Workforce Pulse</h1>
            <span style={styles.liveBadge}>
              <span style={styles.liveDot} /> LIVE PULSE
            </span>
          </div>
          <p style={styles.subtitle}>
            Real-time organizational health, capacity coverage, and automated staffing risk diagnostics.
          </p>
        </div>

        <div style={styles.headerActions}>
          {lastRefreshed && (
            <span style={styles.refreshText}>Updated at {lastRefreshed}</span>
          )}
          <button
            onClick={fetchPulseAndTrends}
            disabled={isLoading}
            style={styles.refreshBtn}
            title="Refresh workforce metrics"
          >
            <svg style={{ ...styles.icon, ...(isLoading ? styles.spinning : {}) }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{isLoading ? 'Syncing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={styles.errorBanner}>
          <div style={styles.errorContent}>
            <svg style={styles.errorIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <strong style={styles.errorTitle}>Error Loading Workforce Metrics</strong>
              <p style={styles.errorMessage}>{error}</p>
            </div>
          </div>
          <button onClick={fetchPulseAndTrends} style={styles.retryBtn}>Retry</button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && !pulseData && (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Synthesizing live workforce intelligence...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && !pulseData && (
        <div style={styles.emptyCard}>
          <svg style={styles.emptyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 style={styles.emptyTitle}>No Workforce Records Found</h3>
          <p style={styles.emptyDesc}>Attendance logs and employee profiles are required to calculate pulse metrics.</p>
          <button onClick={fetchPulseAndTrends} style={styles.primaryBtn}>Check Again</button>
        </div>
      )}

      {/* Main Dashboard Content */}
      {pulseData && (
        <div style={styles.mainGrid}>
          {/* Top KPI Cards */}
          <div style={styles.kpiGrid}>
            {/* KPI 1: Overall Attendance */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardLabel}>Overall Attendance</span>
                <div style={{ ...styles.iconBox, backgroundColor: '#eff6ff', color: '#2563eb' }}>
                  <svg style={styles.kpiIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div style={styles.kpiValueRow}>
                <span style={styles.kpiBigNumber}>{pulseData.overallAttendance ?? 0}%</span>
                <span style={styles.kpiSubtitle}>
                  {pulseData.presentCount ?? 0} of {pulseData.totalEmployees ?? 0} present
                </span>
              </div>
              <div style={styles.progressBarBg}>
                <div
                  style={{
                    ...styles.progressBarFill,
                    width: `${Math.min(pulseData.overallAttendance ?? 0, 100)}%`,
                    backgroundColor: pulseData.overallAttendance >= 90 ? '#10b981' : pulseData.overallAttendance >= 75 ? '#f59e0b' : '#ef4444',
                  }}
                />
              </div>
            </div>

            {/* KPI 2: Team Coverage */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardLabel}>Team Coverage</span>
                <div style={{ ...styles.iconBox, backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                  <svg style={styles.kpiIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div style={styles.kpiValueRow}>
                <span style={styles.kpiBigNumber}>{pulseData.teamCoverage ?? 0}%</span>
                <span style={styles.kpiSubtitle}>Operational capacity</span>
              </div>
              <div style={styles.progressBarBg}>
                <div
                  style={{
                    ...styles.progressBarFill,
                    width: `${Math.min(pulseData.teamCoverage ?? 0, 100)}%`,
                    backgroundColor: pulseData.teamCoverage >= 85 ? '#10b981' : pulseData.teamCoverage >= 70 ? '#f59e0b' : '#ef4444',
                  }}
                />
              </div>
            </div>

            {/* KPI 3: Leave Load */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardLabel}>Leave Load</span>
                <div style={{ ...styles.iconBox, backgroundColor: '#fef3c7', color: '#d97706' }}>
                  <svg style={styles.kpiIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div style={styles.kpiValueRow}>
                <span style={styles.kpiBigNumber}>{pulseData.leaveLoad ?? 0}%</span>
                <span style={styles.kpiSubtitle}>{pulseData.absentCount ?? 0} scheduled out</span>
              </div>
              <div style={styles.progressBarBg}>
                <div
                  style={{
                    ...styles.progressBarFill,
                    width: `${Math.min(pulseData.leaveLoad ?? 0, 100)}%`,
                    backgroundColor: pulseData.leaveLoad <= 10 ? '#10b981' : pulseData.leaveLoad <= 20 ? '#f59e0b' : '#ef4444',
                  }}
                />
              </div>
            </div>

            {/* KPI 4: Workforce Risk Level */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardLabel}>Absence Risk Level</span>
                <div style={{ ...styles.iconBox, backgroundColor: '#fee2e2', color: '#dc2626' }}>
                  <svg style={styles.kpiIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <div style={styles.kpiValueRow}>
                {(() => {
                  const badge = getRiskBadgeStyles(pulseData.absenceRisk);
                  return (
                    <span style={{ ...styles.riskBadge, backgroundColor: badge.bg, color: badge.text, borderColor: badge.border }}>
                      {pulseData.absenceRisk || 'LOW'}
                    </span>
                  );
                })()}
                <span style={styles.kpiSubtitle}>
                  {pulseData.absenceRisk === 'HIGH' ? 'Critical coverage deficit' : pulseData.absenceRisk === 'MEDIUM' ? 'Moderate attention needed' : 'Normal capacity'}
                </span>
              </div>
              <div style={styles.riskHint}>
                Derived from real-time departmental thresholds
              </div>
            </div>
          </div>

          {/* Section: Live Workforce Alerts */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                <svg style={styles.sectionIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Active Workforce Alerts ({pulseData.alerts?.length || 0})
              </h2>
              <span style={styles.sectionDesc}>Automated warnings requiring HR review</span>
            </div>

            {(!pulseData.alerts || pulseData.alerts.length === 0) ? (
              <div style={styles.cleanAlertsBox}>
                <svg style={{ width: 24, height: 24, color: '#10b981', marginRight: 12 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ color: '#065f46', fontSize: 14, fontWeight: 500 }}>
                  All systems optimal: No active workforce or coverage alerts at this time.
                </span>
              </div>
            ) : (
              <div style={styles.alertsList}>
                {pulseData.alerts.map((alert) => {
                  const style = getAlertSeverityStyles(alert.severity);
                  return (
                    <div
                      key={alert.id || Math.random()}
                      style={{
                        ...styles.alertCard,
                        backgroundColor: style.bg,
                        borderColor: style.border,
                      }}
                    >
                      <div style={styles.alertHeaderRow}>
                        <div style={styles.alertTitleWrapper}>
                          <span
                            style={{
                              ...styles.severityBadge,
                              backgroundColor: style.badgeBg,
                              color: style.text,
                            }}
                          >
                            {(alert.severity || 'INFO').toUpperCase()}
                          </span>
                          <h4 style={styles.alertTitle}>{alert.title || alert.type}</h4>
                        </div>
                        {alert.department && (
                          <span style={styles.deptTag}>{alert.department}</span>
                        )}
                      </div>
                      <p style={styles.alertMessage}>{alert.message}</p>
                      {alert.timestamp && (
                        <span style={styles.alertTimestamp}>
                          Flagged at {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2-Column Grid: Department Breakdown & Attendance Trends */}
          <div style={styles.twoColGrid}>
            {/* Column 1: Department Coverage Breakdown */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.cardTitle}>Department Capacity Breakdown</h3>
                  <span style={styles.cardDesc}>Present vs. scheduled leaves per team</span>
                </div>
              </div>

              {(!pulseData.departmentBreakdown || pulseData.departmentBreakdown.length === 0) ? (
                <p style={styles.mutedText}>No departmental data available.</p>
              ) : (
                <div style={styles.deptList}>
                  {pulseData.departmentBreakdown.map((dept) => {
                    const badge = getRiskBadgeStyles(dept.risk || (dept.coveragePercent < 75 ? 'HIGH' : dept.coveragePercent < 85 ? 'MEDIUM' : 'LOW'));
                    return (
                      <div key={dept.department} style={styles.deptItem}>
                        <div style={styles.deptHeader}>
                          <div style={styles.deptNameRow}>
                            <span style={styles.deptName}>{dept.department}</span>
                            <span style={{ ...styles.miniBadge, backgroundColor: badge.bg, color: badge.text, borderColor: badge.border }}>
                              {dept.coveragePercent ?? 0}% Coverage
                            </span>
                          </div>
                          <span style={styles.deptStats}>
                            {dept.present ?? 0} / {dept.total ?? 0} Present ({dept.onLeave ?? 0} on leave)
                          </span>
                        </div>
                        <div style={styles.deptProgressBg}>
                          <div
                            style={{
                              ...styles.deptProgressFill,
                              width: `${Math.min(dept.coveragePercent ?? 0, 100)}%`,
                              backgroundColor: (dept.coveragePercent >= 85) ? '#10b981' : (dept.coveragePercent >= 75) ? '#f59e0b' : '#ef4444',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Column 2: 7-Day Attendance Trend */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.cardTitle}>Attendance Stability Trend</h3>
                  <span style={styles.cardDesc}>Rolling attendance trajectory</span>
                </div>
                <div style={styles.filterGroup}>
                  {[7, 14].map((days) => (
                    <button
                      key={days}
                      onClick={() => setTrendDays(days)}
                      style={{
                        ...styles.filterBtn,
                        ...(trendDays === days ? styles.filterBtnActive : {}),
                      }}
                    >
                      {days}D
                    </button>
                  ))}
                </div>
              </div>

              {trendData.length === 0 ? (
                <p style={styles.mutedText}>No historical trend data available.</p>
              ) : (
                <div style={styles.trendVisualWrapper}>
                  <div style={styles.trendBarsContainer}>
                    {trendData.map((item, idx) => {
                      const rate = item.attendanceRate ?? 0;
                      const barHeight = Math.max(rate, 15);
                      return (
                        <div key={idx} style={styles.trendCol} title={`${item.date || item.day}: ${rate}% attendance (${item.presentCount ?? 0} present)`}>
                          <span style={styles.trendRateLabel}>{rate}%</span>
                          <div style={styles.trendBarBg}>
                            <div
                              style={{
                                ...styles.trendBarFill,
                                height: `${barHeight}%`,
                                backgroundColor: rate >= 90 ? '#3b82f6' : rate >= 75 ? '#f59e0b' : '#ef4444',
                              }}
                            />
                          </div>
                          <span style={styles.trendDayLabel}>{item.day || item.date?.slice(-5) || `D${idx+1}`}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={styles.trendLegend}>
                    <div style={styles.legendItem}>
                      <span style={{ ...styles.legendDot, backgroundColor: '#3b82f6' }} />
                      <span>&gt;=90% Optimal</span>
                    </div>
                    <div style={styles.legendItem}>
                      <span style={{ ...styles.legendDot, backgroundColor: '#f59e0b' }} />
                      <span>75-89% Moderate</span>
                    </div>
                    <div style={styles.legendItem}>
                      <span style={{ ...styles.legendDot, backgroundColor: '#ef4444' }} />
                      <span>&lt;75% Warning</span>
                    </div>
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
    marginBottom: '28px',
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
  liveBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.05em',
    color: '#059669',
    backgroundColor: '#ecfdf5',
    border: '1px solid #a7f3d0',
    borderRadius: '9999px',
  },
  liveDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    display: 'inline-block',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  refreshText: {
    fontSize: '12px',
    color: '#94a3b8',
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
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  icon: {
    width: '16px',
    height: '16px',
  },
  spinning: {
    animation: 'spin 1s linear infinite',
  },
  errorBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    marginBottom: '24px',
  },
  errorContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  errorIcon: {
    width: '24px',
    height: '24px',
    color: '#dc2626',
    flexShrink: 0,
  },
  errorTitle: {
    fontSize: '14px',
    color: '#991b1b',
    display: 'block',
  },
  errorMessage: {
    fontSize: '13px',
    color: '#b91c1c',
    margin: '2px 0 0 0',
  },
  retryBtn: {
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#dc2626',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #e2e8f0',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    marginBottom: '16px',
  },
  loadingText: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500',
  },
  emptyCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
  },
  emptyIcon: {
    width: '48px',
    height: '48px',
    color: '#94a3b8',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 8px 0',
  },
  emptyDesc: {
    fontSize: '14px',
    color: '#64748b',
    maxWidth: '400px',
    margin: '0 0 20px 0',
  },
  primaryBtn: {
    padding: '8px 18px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#2563eb',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  mainGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    border: '1px solid #e2e8f0',
    padding: '22px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '14px',
  },
  cardLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 2px 0',
  },
  cardDesc: {
    fontSize: '12px',
    color: '#64748b',
  },
  iconBox: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiIcon: {
    width: '20px',
    height: '20px',
  },
  kpiValueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '10px',
    marginBottom: '12px',
  },
  kpiBigNumber: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.03em',
  },
  kpiSubtitle: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
  },
  progressBarBg: {
    height: '6px',
    backgroundColor: '#f1f5f9',
    borderRadius: '9999px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '9999px',
    transition: 'width 0.4s ease',
  },
  riskBadge: {
    fontSize: '16px',
    fontWeight: '800',
    padding: '4px 12px',
    borderRadius: '8px',
    borderWidth: '1px',
    borderStyle: 'solid',
    letterSpacing: '0.05em',
  },
  riskHint: {
    fontSize: '11px',
    color: '#94a3b8',
    marginTop: '6px',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    border: '1px solid #e2e8f0',
    padding: '24px',
  },
  sectionHeader: {
    marginBottom: '18px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '17px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 4px 0',
  },
  sectionIcon: {
    width: '20px',
    height: '20px',
    color: '#f59e0b',
  },
  sectionDesc: {
    fontSize: '13px',
    color: '#64748b',
  },
  cleanAlertsBox: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 18px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '10px',
  },
  alertsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  alertCard: {
    padding: '16px 18px',
    borderRadius: '12px',
    borderWidth: '1px',
    borderStyle: 'solid',
  },
  alertHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '8px',
  },
  alertTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  severityBadge: {
    fontSize: '10px',
    fontWeight: '800',
    padding: '2px 8px',
    borderRadius: '6px',
    letterSpacing: '0.05em',
  },
  alertTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  deptTag: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#475569',
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: '2px 8px',
    borderRadius: '6px',
  },
  alertMessage: {
    fontSize: '13px',
    color: '#334155',
    margin: '0 0 6px 0',
    lineHeight: '1.45',
  },
  alertTimestamp: {
    fontSize: '11px',
    color: '#64748b',
  },
  twoColGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
  },
  deptList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '10px',
  },
  deptItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  deptHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
  },
  deptNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  deptName: {
    fontWeight: '600',
    color: '#1e293b',
  },
  miniBadge: {
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '6px',
    borderWidth: '1px',
    borderStyle: 'solid',
  },
  deptStats: {
    color: '#64748b',
    fontSize: '12px',
  },
  deptProgressBg: {
    height: '8px',
    backgroundColor: '#f1f5f9',
    borderRadius: '9999px',
    overflow: 'hidden',
  },
  deptProgressFill: {
    height: '100%',
    borderRadius: '9999px',
  },
  filterGroup: {
    display: 'flex',
    gap: '4px',
    backgroundColor: '#f1f5f9',
    padding: '2px',
    borderRadius: '8px',
  },
  filterBtn: {
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#64748b',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  filterBtnActive: {
    color: '#1e293b',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
  },
  trendVisualWrapper: {
    marginTop: '16px',
  },
  trendBarsContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '8px',
    height: '160px',
    padding: '10px 0',
    borderBottom: '1px solid #e2e8f0',
  },
  trendCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  trendRateLabel: {
    fontSize: '10px',
    fontWeight: '600',
    color: '#64748b',
    marginBottom: '4px',
  },
  trendBarBg: {
    width: '100%',
    maxWidth: '28px',
    height: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: '6px 6px 0 0',
    display: 'flex',
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  trendBarFill: {
    width: '100%',
    borderRadius: '4px 4px 0 0',
    transition: 'height 0.3s ease',
  },
  trendDayLabel: {
    fontSize: '11px',
    color: '#64748b',
    marginTop: '8px',
    fontWeight: '500',
  },
  trendLegend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginTop: '14px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: '#64748b',
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  mutedText: {
    fontSize: '13px',
    color: '#94a3b8',
    textAlign: 'center',
    padding: '24px 0',
  },
};
