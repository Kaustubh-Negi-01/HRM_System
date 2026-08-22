import React from 'react';
import './PageContainer.css';

export const PageHeader = ({
  title,
  subtitle,
  actions,
  action,
  badge,
  className = '',
}) => {
  const headerActions = actions || action;
  if (!title && !subtitle && !headerActions && !badge) return null;

  return (
    <div className={`df-page-header ${className}`}>
      <div className="df-page-header__content">
        <div className="df-page-header__title-row">
          {title && <h1 className="df-page-header__title">{title}</h1>}
          {badge && <span className="df-page-header__badge">{badge}</span>}
        </div>
        {subtitle && <p className="df-page-header__subtitle">{subtitle}</p>}
      </div>
      {headerActions && <div className="df-page-header__actions">{headerActions}</div>}
    </div>
  );
};

export const PageContainer = ({
  title,
  subtitle,
  actions,
  action,
  badge,
  children,
  maxWidth,
  className = '',
}) => {
  const headerActions = actions || action;
  return (
    <main
      className={`df-page-container ${className}`}
      style={maxWidth ? { maxWidth } : undefined}
    >
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={headerActions}
        badge={badge}
      />
      <div className="df-page-content">
        {children}
      </div>
    </main>
  );
};

export default PageContainer;
