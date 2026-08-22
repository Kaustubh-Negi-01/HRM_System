import React, { useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User } from 'lucide-react';
import { Card } from '../../ui/Card';
import './Copilot.css';

export const TypingIndicator = () => (
  <div className="df-copilot-typing">
    <span className="df-copilot-typing__dot" />
    <span className="df-copilot-typing__dot" />
    <span className="df-copilot-typing__dot" />
  </div>
);

export const SuggestedQuestion = ({ question, onClick }) => (
  <button
    type="button"
    className="df-copilot-suggestion"
    onClick={() => onClick && onClick(question)}
  >
    <Sparkles size={13} className="df-copilot-suggestion__icon" />
    <span>{question}</span>
  </button>
);

export const ChatMessage = ({
  sender = 'assistant', // 'user' | 'assistant'
  text,
  timestamp,
  dataCard,
  suggestions = [],
  onSuggestionClick,
}) => {
  const isUser = sender === 'user';

  return (
    <div className={`df-copilot-msg df-copilot-msg--${sender}`}>
      <div className="df-copilot-msg__avatar">
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      <div className="df-copilot-msg__body">
        <div className="df-copilot-msg__bubble">
          <p className="df-copilot-msg__text">{text}</p>
          {dataCard && <div className="df-copilot-msg__datacard">{dataCard}</div>}
        </div>

        {timestamp && <span className="df-copilot-msg__timestamp">{timestamp}</span>}

        {suggestions && suggestions.length > 0 && (
          <div className="df-copilot-msg__suggestions">
            {suggestions.map((q, idx) => (
              <SuggestedQuestion
                key={idx}
                question={q}
                onClick={onSuggestionClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const ChatInput = ({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = 'Ask HR Copilot about workforce, leaves, attendance, or payroll...',
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (onSend && value?.trim() && !disabled) {
        onSend(value);
      }
    }
  };

  return (
    <div className="df-copilot-input-bar">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="df-copilot-input"
      />
      <button
        type="button"
        className="df-copilot-send-btn"
        disabled={disabled || !value?.trim()}
        onClick={() => onSend && onSend(value)}
        aria-label="Send message"
      >
        <Send size={16} />
      </button>
    </div>
  );
};

export const CopilotContainer = ({
  messages = [],
  inputValue = '',
  onInputChange,
  onSend,
  isThinking = false,
  suggestedQuestions = [
    'Who has the highest absence rate this month?',
    'Which team has the lowest attendance today?',
    'How many employees are on leave next Monday?',
    'Analyze leave impact on Engineering for Q3',
  ],
  title = 'HR Copilot',
  subtitle = 'Natural language workforce intelligence assistant',
  className = '',
}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} style={{ color: 'var(--primary)' }} />
          <span>{title}</span>
        </div>
      }
      subtitle={subtitle}
      className={`df-copilot-container ${className}`}
    >
      <div className="df-copilot-feed">
        {messages.length === 0 ? (
          <div className="df-copilot-welcome">
            <div className="df-copilot-welcome__icon">
              <Bot size={36} />
            </div>
            <h3 className="df-copilot-welcome__title">Ask Dayflow Copilot anything</h3>
            <p className="df-copilot-welcome__desc">
              Query realtime attendance stats, evaluate team leave risk, examine payroll records, or analyze workforce trends in plain English.
            </p>
            <div className="df-copilot-welcome__suggestions">
              {suggestedQuestions.map((q, idx) => (
                <SuggestedQuestion
                  key={idx}
                  question={q}
                  onClick={(val) => onSend && onSend(val)}
                />
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <ChatMessage
              key={msg.id || idx}
              sender={msg.sender}
              text={msg.text}
              timestamp={msg.timestamp}
              dataCard={msg.dataCard}
              suggestions={msg.suggestions}
              onSuggestionClick={onSend}
            />
          ))
        )}

        {isThinking && (
          <div className="df-copilot-msg df-copilot-msg--assistant">
            <div className="df-copilot-msg__avatar">
              <Bot size={16} />
            </div>
            <div className="df-copilot-msg__body">
              <div className="df-copilot-msg__bubble">
                <TypingIndicator />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="df-copilot-footer">
        <ChatInput
          value={inputValue}
          onChange={onInputChange}
          onSend={onSend}
          disabled={isThinking}
        />
      </div>
    </Card>
  );
};

export default CopilotContainer;
