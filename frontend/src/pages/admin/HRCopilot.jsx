import React, { useState, useEffect, useRef, useCallback } from 'react';
import { queryCopilot, getCopilotPrompts } from '../../features/copilot/copilot.service';

/**
 * HRCopilot Component
 * Differentiator 3: Grounded AI Natural Language HR Data Assistant.
 * Owned by: Kaustubh (Team Leader)
 */
export default function HRCopilot() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [suggestedPrompts, setSuggestedPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [promptsLoading, setPromptsLoading] = useState(true);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // 1. Fetch starter prompt chips on mount
  useEffect(() => {
    let isMounted = true;
    const fetchPrompts = async () => {
      setPromptsLoading(true);
      try {
        const response = await getCopilotPrompts();
        const prompts = response?.data?.prompts || response?.prompts || response?.data || [];
        if (isMounted) {
          setSuggestedPrompts(prompts);
        }
      } catch (err) {
        console.error('Failed to load Copilot suggested prompts:', err);
        // Fallback default prompts if offline
        if (isMounted) {
          setSuggestedPrompts([
            { id: 'p1', category: 'Attendance', text: 'Which team has the lowest attendance rate this week?' },
            { id: 'p2', category: 'Staffing', text: 'Who has the highest absence rate this month?' },
            { id: 'p3', category: 'Forecast', text: 'How many employees are absent next Monday?' },
            { id: 'p4', category: 'Leave Risk', text: 'Which pending leaves could affect team staffing?' },
            { id: 'p5', category: 'Diagnostics', text: "Why is the Customer Support team's coverage low?" },
          ]);
        }
      } finally {
        if (isMounted) setPromptsLoading(false);
      }
    };

    fetchPrompts();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Submit Question to Backend Grounded Copilot API
  const handleSendQuestion = useCallback(
    async (questionText) => {
      const q = (questionText || inputText).trim();
      if (!q || isLoading) return;

      setError(null);
      const userMsg = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: q,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputText('');
      setIsLoading(true);

      try {
        // Consume Saksham's Copilot service
        const response = await queryCopilot(q);
        const data = response?.data || response;

        const copilotMsg = {
          id: `copilot-${Date.now()}`,
          sender: 'copilot',
          text: data.answer || 'Analysis complete with no summary returned.',
          queryType: data.queryType || 'DATA_QUERY',
          confidence: data.confidence ?? 0.95,
          relevantData: data.relevantData || null,
          suggestedFollowUps: data.suggestedFollowUps || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, copilotMsg]);
      } catch (err) {
        console.error('Copilot query error:', err);
        setError(err?.message || 'Failed to analyze query against HRMS database.');
        const errorMsg = {
          id: `error-${Date.now()}`,
          sender: 'system',
          text: 'Unable to reach the HR Copilot intelligence service. Please check your backend connection.',
          isError: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [inputText, isLoading]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendQuestion();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuestion();
    }
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.titleRow}>
            <h1 style={styles.title}>HR Copilot</h1>
            <span style={styles.badgeGrounded}>DATA GROUNDED</span>
          </div>
          <p style={styles.subtitle}>
            Ask natural language questions grounded in real-time attendance, staffing, and leave records.
          </p>
        </div>

        {messages.length > 0 && (
          <button
            onClick={() => {
              setMessages([]);
              setError(null);
            }}
            style={styles.clearBtn}
            title="Clear conversation history"
          >
            Clear Conversation
          </button>
        )}
      </div>

      {/* Suggested Prompt Chips */}
      <div style={styles.promptsSection}>
        <span style={styles.promptsLabel}>Suggested Insights:</span>
        <div style={styles.promptsList}>
          {suggestedPrompts.map((p) => (
            <button
              key={p.id || p.text}
              onClick={() => handleSendQuestion(p.text)}
              disabled={isLoading}
              style={styles.promptChip}
            >
              <svg style={styles.promptIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{p.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div style={styles.chatCard}>
        {/* Messages Stream */}
        <div style={styles.messagesStream}>
          {/* Empty Conversation Onboarding State */}
          {messages.length === 0 && (
            <div style={styles.onboardingState}>
              <div style={styles.aiAvatarBox}>
                <svg style={styles.aiAvatarIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 style={styles.onboardingTitle}>Grounded HR Intelligence at your fingertips</h3>
              <p style={styles.onboardingDesc}>
                Unlike generic chat models, HR Copilot interrogates your actual MongoDB database to deliver mathematically grounded answers regarding workforce health, attendance dips, and upcoming leave risks.
              </p>
              <div style={styles.exampleGrid}>
                <div style={styles.exampleCard} onClick={() => handleSendQuestion('Which team has the lowest attendance rate this week?')}>
                  <strong>📊 Coverage Diagnostics</strong>
                  <span>"Which team has lowest attendance this week?"</span>
                </div>
                <div style={styles.exampleCard} onClick={() => handleSendQuestion('Who has the highest absence rate this month?')}>
                  <strong>👥 Absence Analysis</strong>
                  <span>"Who has the highest absence rate this month?"</span>
                </div>
                <div style={styles.exampleCard} onClick={() => handleSendQuestion('Which pending leaves could affect team staffing?')}>
                  <strong>⚠️ Leave Risk</strong>
                  <span>"Which pending leaves could affect team staffing?"</span>
                </div>
              </div>
            </div>
          )}

          {/* Message List */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                ...styles.messageRow,
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              {/* Copilot Avatar */}
              {msg.sender !== 'user' && (
                <div style={styles.copilotAvatar}>
                  <svg style={styles.copilotAvatarIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              )}

              {/* Message Bubble */}
              <div
                style={{
                  ...styles.messageBubble,
                  ...(msg.sender === 'user' ? styles.userBubble : styles.copilotBubble),
                  ...(msg.isError ? styles.errorBubble : {}),
                }}
              >
                {/* Copilot Message Metadata (Classification & Confidence) */}
                {msg.sender === 'copilot' && (
                  <div style={styles.msgMetadata}>
                    <span style={styles.queryTypeTag}>{msg.queryType}</span>
                    <span style={styles.confidenceTag}>
                      {Math.round((msg.confidence || 0.95) * 100)}% Data Grounded
                    </span>
                  </div>
                )}

                {/* Message Body */}
                <p style={styles.messageText}>{msg.text}</p>

                {/* Supporting Data Card (Structured Breakdown) */}
                {msg.relevantData && (
                  <div style={styles.supportingDataCard}>
                    <div style={styles.supportingDataHeader}>
                      <svg style={styles.supportingDataIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>Supporting Evidence from Database</span>
                    </div>

                    {/* Table if comparison data exists */}
                    {Array.isArray(msg.relevantData.comparison) && (
                      <table style={styles.dataTable}>
                        <thead>
                          <tr>
                            <th style={styles.th}>Department</th>
                            <th style={styles.th}>Attendance Rate</th>
                            <th style={styles.th}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {msg.relevantData.comparison.map((row, i) => (
                            <tr key={i} style={styles.tr}>
                              <td style={styles.td}><strong>{row.department}</strong></td>
                              <td style={styles.td}>{row.rate}%</td>
                              <td style={styles.td}>
                                <span
                                  style={{
                                    ...styles.statusTag,
                                    backgroundColor: row.rate < 75 ? '#fee2e2' : row.rate < 85 ? '#fef3c7' : '#dcfce7',
                                    color: row.rate < 75 ? '#991b1b' : row.rate < 85 ? '#92400e' : '#166534',
                                  }}
                                >
                                  {row.status || (row.rate < 75 ? 'Low' : 'Optimal')}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {/* JSON Key-Values if no comparison table */}
                    {!Array.isArray(msg.relevantData.comparison) && (
                      <div style={styles.keyValueGrid}>
                        {Object.entries(msg.relevantData).map(([key, val]) => {
                          if (typeof val === 'object') return null;
                          return (
                            <div key={key} style={styles.kvItem}>
                              <span style={styles.kvKey}>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                              <strong style={styles.kvVal}>{String(val)}</strong>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Suggested Follow-Ups */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div style={styles.followUpsBox}>
                    <span style={styles.followUpsLabel}>Suggested Next Steps:</span>
                    <div style={styles.followUpButtons}>
                      {msg.suggestedFollowUps.map((followUp, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendQuestion(followUp)}
                          disabled={isLoading}
                          style={styles.followUpBtn}
                        >
                          → {followUp}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timestamp */}
                <div style={styles.msgFooter}>
                  <span style={styles.timestamp}>{msg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Typing / Loading Animation */}
          {isLoading && (
            <div style={styles.messageRow}>
              <div style={styles.copilotAvatar}>
                <svg style={styles.copilotAvatarIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div style={styles.typingBubble}>
                <span style={styles.typingDot} />
                <span style={{ ...styles.typingDot, animationDelay: '0.2s' }} />
                <span style={{ ...styles.typingDot, animationDelay: '0.4s' }} />
                <span style={styles.typingText}>Interrogating workforce database...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Question Input Form */}
        <form onSubmit={handleSubmit} style={styles.inputForm}>
          <div style={styles.inputWrapper}>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask an HR question (e.g., 'Which team has lowest attendance this week?')"
              rows={2}
              style={styles.textarea}
              disabled={isLoading}
            />
            <div style={styles.inputActionRow}>
              <span style={styles.inputHint}>Press Enter ↵ to send • Shift+Enter for new line</span>
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                style={{
                  ...styles.sendBtn,
                  opacity: !inputText.trim() || isLoading ? 0.6 : 1,
                }}
              >
                <svg style={styles.sendIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span>Ask Copilot</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Clean inline styles adhering to DayFlow design tokens
const styles = {
  container: {
    padding: '28px',
    maxWidth: '1100px',
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
    marginBottom: '20px',
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
  badgeGrounded: {
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.05em',
    color: '#0284c7',
    backgroundColor: '#e0f2fe',
    border: '1px solid #bae6fd',
    borderRadius: '9999px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  clearBtn: {
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  promptsSection: {
    marginBottom: '16px',
  },
  promptsLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    display: 'block',
    marginBottom: '8px',
  },
  promptsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  promptChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#334155',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '9999px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
  },
  promptIcon: {
    width: '13px',
    height: '13px',
    color: '#0284c7',
  },
  chatCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    height: '620px',
    overflow: 'hidden',
  },
  messagesStream: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  onboardingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    margin: 'auto 0',
    padding: '30px 20px',
  },
  aiAvatarBox: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    backgroundColor: '#e0f2fe',
    color: '#0284c7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  aiAvatarIcon: {
    width: '32px',
    height: '32px',
  },
  onboardingTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 8px 0',
  },
  onboardingDesc: {
    fontSize: '14px',
    color: '#64748b',
    maxWidth: '540px',
    margin: '0 0 24px 0',
    lineHeight: '1.5',
  },
  exampleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px',
    width: '100%',
    maxWidth: '750px',
  },
  exampleCard: {
    padding: '12px 14px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '12px',
    color: '#475569',
    transition: 'all 0.15s ease',
  },
  messageRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  copilotAvatar: {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
  },
  copilotAvatarIcon: {
    width: '18px',
    height: '18px',
  },
  messageBubble: {
    maxWidth: '82%',
    padding: '16px 20px',
    borderRadius: '14px',
    fontSize: '14px',
    lineHeight: '1.55',
  },
  userBubble: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    borderBottomRightRadius: '4px',
  },
  copilotBubble: {
    backgroundColor: '#f8fafc',
    color: '#1e293b',
    border: '1px solid #e2e8f0',
    borderBottomLeftRadius: '4px',
  },
  errorBubble: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    border: '1px solid #fecaca',
  },
  msgMetadata: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  queryTypeTag: {
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '0.04em',
    color: '#475569',
    backgroundColor: '#e2e8f0',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  confidenceTag: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#0369a1',
    backgroundColor: '#e0f2fe',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  messageText: {
    margin: '0 0 8px 0',
    whiteSpace: 'pre-line',
  },
  supportingDataCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '12px 14px',
    marginTop: '12px',
    marginBottom: '8px',
  },
  supportingDataHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '8px',
  },
  supportingDataIcon: {
    width: '15px',
    height: '15px',
    color: '#0284c7',
  },
  dataTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12px',
  },
  th: {
    textAlign: 'left',
    padding: '6px 8px',
    borderBottom: '1px solid #e2e8f0',
    color: '#64748b',
    fontWeight: '600',
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
  },
  td: {
    padding: '6px 8px',
    color: '#334155',
  },
  statusTag: {
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: '700',
  },
  keyValueGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '8px',
  },
  kvItem: {
    fontSize: '12px',
    backgroundColor: '#f8fafc',
    padding: '6px 8px',
    borderRadius: '6px',
  },
  kvKey: {
    color: '#64748b',
    display: 'block',
    textTransform: 'capitalize',
  },
  kvVal: {
    color: '#0f172a',
  },
  followUpsBox: {
    marginTop: '12px',
    paddingTop: '10px',
    borderTop: '1px solid #e2e8f0',
  },
  followUpsLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#64748b',
    display: 'block',
    marginBottom: '6px',
  },
  followUpButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  followUpBtn: {
    textAlign: 'left',
    padding: '4px 8px',
    fontSize: '12px',
    color: '#0284c7',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  msgFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '4px',
  },
  timestamp: {
    fontSize: '10px',
    color: '#94a3b8',
  },
  typingBubble: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    padding: '12px 18px',
    borderRadius: '14px',
  },
  typingDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#0284c7',
    animation: 'pulse 1s infinite ease-in-out',
  },
  typingText: {
    fontSize: '12px',
    color: '#64748b',
    marginLeft: '6px',
  },
  inputForm: {
    borderTop: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    padding: '16px 20px',
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '13px',
    fontFamily: 'inherit',
    color: '#1e293b',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    resize: 'none',
    outline: 'none',
    boxSizing: 'border-box',
  },
  inputActionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputHint: {
    fontSize: '11px',
    color: '#94a3b8',
  },
  sendBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 18px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#ffffff',
    backgroundColor: '#0284c7',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  sendIcon: {
    width: '15px',
    height: '15px',
  },
};
