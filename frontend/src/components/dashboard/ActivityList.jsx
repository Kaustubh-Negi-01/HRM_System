import React from 'react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import './ActivityList.css';

const DEFAULT_ACTIVITIES = [
  {
    id: 'act_1',
    name: 'Priya Sharma',
    action: 'submitted',
    target: 'Leave Request (3 days)',
    description: '• High conflict risk detected',
    timestamp: '10 mins ago',
    badge: 'LEAVE',
    badgeVariant: 'warning',
  },
  {
    id: 'act_2',
    name: 'Alex Chen',
    action: 'clocked in',
    target: 'Engineering HQ',
    description: '• On time (08:58 AM)',
    timestamp: '25 mins ago',
    badge: 'PRESENT',
    badgeVariant: 'success',
  },
  {
    id: 'act_3',
    name: 'Workforce Pulse',
    action: 'alert',
    target: 'DevOps Squad',
    description: '• 18.5h weekly overtime flagged',
    timestamp: '1 hour ago',
    badge: 'PULSE',
    badgeVariant: 'danger',
  },
  {
    id: 'act_4',
    name: 'Saksham Singh',
    action: 'disbursed',
    target: 'July Payroll Batch',
    description: '• 52 slips verified',
    timestamp: '3 hours ago',
    badge: 'PAYROLL',
    badgeVariant: 'primary',
  },
];

const renderIconProp = (icon, size = 16) => {
  if (!icon) return null;
  if (React.isValidElement(icon)) return icon;
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && (icon.$$typeof || icon.render))) {
    const IconComp = icon;
    return <IconComp size={size} />;
  }
  return null;
};

export const ActivityItem = ({
  avatar,
  name,
  description,
  action,
  target,
  timestamp,
  badge,
  badgeVariant = 'primary',
  icon,
  className = '',
}) => {
  return (
    <div className={`df-activity-item ${className}`}>
      <div className="df-activity-item__avatar">
        {icon ? (
          <div className="df-activity-item__icon-wrap">{renderIconProp(icon)}</div>
        ) : (
          <Avatar src={avatar} name={name} size="sm" />
        )}
      </div>

      <div className="df-activity-item__content">
        <p className="df-activity-item__text">
          {name && <strong className="df-activity-item__name">{name} </strong>}
          {action && <span className="df-activity-item__action">{action} </span>}
          {target && <span className="df-activity-item__target">{target} </span>}
          {description && <span className="df-activity-item__desc">{description}</span>}
        </p>
        {timestamp && <span className="df-activity-item__timestamp">{timestamp}</span>}
      </div>

      {badge && (
        <div className="df-activity-item__badge">
          <Badge variant={badgeVariant} size="sm">
            {badge}
          </Badge>
        </div>
      )}
    </div>
  );
};

export const ActivityList = ({
  items = [],
  title = 'Recent Activity Feed',
  subtitle = 'Real-time telemetry and HR operations',
  actions,
  cardWrapped = true,
  className = '',
}) => {
  const displayItems = items && items.length > 0 ? items : DEFAULT_ACTIVITIES;

  const content = (
    <div className={`df-activity-list ${className}`}>
      {displayItems.map((item, idx) => (
        <ActivityItem
          key={item.id || idx}
          avatar={item.avatar}
          name={item.name}
          action={item.action}
          target={item.target}
          description={item.description}
          timestamp={item.timestamp}
          badge={item.badge}
          badgeVariant={item.badgeVariant}
          icon={item.icon}
        />
      ))}
    </div>
  );

  if (cardWrapped) {
    return (
      <Card title={title} subtitle={subtitle} actions={actions}>
        {content}
      </Card>
    );
  }

  return content;
};

export default ActivityList;
