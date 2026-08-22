import React from 'react';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Loader';
import EmptyState from '../ui/EmptyState';
import './ChartCard.css';

export const ChartCard = ({
  title,
  subtitle,
  actions,
  children,
  loading = false,
  empty = false,
  emptyTitle = 'No chart data available',
  minHeight = 280,
  className = '',
}) => {
  return (
    <Card
      title={title}
      subtitle={subtitle}
      actions={actions}
      className={`df-chart-card ${className}`}
    >
      <div className="df-chart-card__container" style={{ minHeight }}>
        {loading ? (
          <div className="df-chart-card__loading">
            <Skeleton height={`${minHeight - 40}px`} width="100%" radius="md" />
          </div>
        ) : empty ? (
          <EmptyState title={emptyTitle} />
        ) : (
          children
        )}
      </div>
    </Card>
  );
};

export default ChartCard;
