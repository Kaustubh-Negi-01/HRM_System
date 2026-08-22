import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Table from '../../components/ui/Table';
import copilotService from '../../features/copilot/copilot.service';
import {
  Bot,
  Send,
  Sparkles,
  User,
  ArrowRight,
  RefreshCw,
  Zap,
  HelpCircle,
} from 'lucide-react';

export const HRCopilot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content:
        'Hello! I am your **DayFlow HR Copilot** 🤖. I have access to your organization\'s live attendance logs, pending leave applications, payroll cycles, and Workforce Pulse telemetry.\n\nAsk me anything about your workforce, or click a suggestion below!',
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = copilotService.getSuggestedPrompts();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim() || loading) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await copilotService.askQuestion(query, messages);
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an issue analyzing the dataset. Please try again.',
          timestamp: 'Now',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="AI HR Copilot Assistant"
      subtitle="Ask complex natural-language questions directly over your real-time workforce, leave, and payroll datasets."
    >
      <div
        className="glass-panel"
        style={{
          height: 'calc(100vh - 230px)',
          minHeight: '520px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(11, 15, 25, 0.98) 100%)',
          boxShadow: 'var(--shadow-glow)',
        }}
      >
        {/* Chat Messages Log */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  gap: '1rem',
                }}
              >
                {!isUser && (
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      background: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      flexShrink: 0,
                      boxShadow: '0 0 12px rgba(99, 102, 241, 0.4)',
                    }}
                  >
                    <Bot size={20} />
                  </div>
                )}

                <div
                  style={{
                    maxWidth: isUser ? '70%' : '80%',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: isUser ? 'var(--primary)' : 'rgba(30, 41, 59, 0.7)',
                    border: isUser ? 'none' : '1px solid var(--border-subtle)',
                    color: '#FFFFFF',
                  }}
                >
                  <div className="flex items-center justify-between gap-4" style={{ marginBottom: '0.25rem' }}>
                    <span className="text-xs font-bold" style={{ opacity: 0.8 }}>
                      {isUser ? 'You' : 'DayFlow Copilot'}
                    </span>
                    <span className="text-xs" style={{ opacity: 0.5, fontSize: '0.6875rem' }}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Message Content */}
                  <div
                    className="text-sm"
                    style={{
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      marginTop: '0.25rem',
                    }}
                  >
                    {msg.content}
                  </div>

                  {/* Embedded Data Table (if generated by AI) */}
                  {msg.dataTable && (
                    <div
                      style={{
                        marginTop: '1rem',
                        overflowX: 'auto',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      }}
                    >
                      <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            {msg.dataTable.headers.map((h, i) => (
                              <th key={i} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--text-secondary)' }}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {msg.dataTable.rows.map((row, rIdx) => (
                            <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} style={{ padding: '0.5rem 0.75rem', color: 'var(--text-primary)' }}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Embedded Action Button (if generated by AI) */}
                  {msg.actionRecommendation && (
                    <div style={{ marginTop: '0.875rem' }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={ArrowRight}
                        iconPosition="right"
                        onClick={() => navigate(msg.actionRecommendation.link)}
                      >
                        {msg.actionRecommendation.label}
                      </Button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-primary)',
                      flexShrink: 0,
                    }}
                  >
                    <User size={18} />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3 animate-fade-in">
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <Bot size={20} />
              </div>
              <div
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <span className="text-xs text-cyan font-mono animate-pulse">
                  Querying HRMS intelligence models & cross-referencing attendance...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div
          style={{
            padding: '0.75rem 2rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
          }}
        >
          <span className="text-xs font-bold text-muted flex items-center gap-1" style={{ whiteSpace: 'nowrap' }}>
            <Zap size={12} style={{ color: 'var(--pulse-cyan)' }} /> Suggested:
          </span>
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                color: '#A5B4FC',
                fontSize: '0.75rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)',
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div
          style={{
            padding: '1rem 2rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: '#0B0F19',
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <div style={{ flex: 1 }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about team burnout, leave overlaps, attendance anomalies, or payroll costs..."
                style={{
                  width: '100%',
                  padding: '0.75rem 1.25rem',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Send}
              disabled={!inputValue.trim() || loading}
            >
              Ask
            </Button>
          </form>
        </div>
      </div>
    </PageContainer>
  );
};

export default HRCopilot;
