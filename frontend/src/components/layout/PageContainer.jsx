import React from 'react';
import './PageContainer.css';

export const PageHeader = ({
  title,
  subtitle,
  actions,
  badge,
  className = '',
}) => {
  if (!title && !subtitle && !actions && !badge) return null;

  return (
    <div className={`df-page-header ${className}`}>
      <div className="df-page-header__content">
        <div className="df-page-header__title-row">
          {title && <h1 className="df-page-header__title">{title}</h1>}
          {badge && <span className="df-page-header__badge">{badge}</span>}
        </div>
        {subtitle && <p className="df-page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="df-page-header__actions">{actions}</div>}
    </div>
  );
};

export const PageContainer = ({
  title,
  subtitle,
  actions,
  badge,
  children,
  maxWidth,
  className = '',
}) => {
  return (
    <main
      className={`df-page-container ${className}`}
      style={maxWidth ? { maxWidth } : undefined}
    >
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={actions}
        badge={badge}
      />
      <div className="df-page-content">
        {children}
      </div>
    </main>
  );
};

export default PageContainer;
