import React from 'react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import './ActivityList.css';

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
          <div className="df-activity-item__icon-wrap">{icon}</div>
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
  title = 'Recent Activity',
  subtitle,
  actions,
  cardWrapped = true,
  className = '',
}) => {
  const content = (
    <div className={`df-activity-list ${className}`}>
      {items.map((item, idx) => (
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
