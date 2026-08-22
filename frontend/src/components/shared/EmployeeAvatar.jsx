import React from 'react';
import { Avatar } from '../ui/Avatar';
import './EmployeeAvatar.css';

export const EmployeeAvatar = ({
  name = '',
  email = '',
  role = '',
  department = '',
  avatarUrl = '',
  status,
  size = 'md',
  showDetails = true,
  subtitle,
  className = '',
  onClick,
}) => {
  const displaySubtitle = subtitle || role || department || email;

  return (
    <div
      className={`df-employee-avatar-wrapper ${onClick ? 'df-employee-avatar-wrapper--clickable' : ''} ${className}`}
      onClick={onClick}
    >
      <Avatar
        src={avatarUrl}
        name={name}
        size={size}
        status={status}
      />
      {showDetails && (
        <div className="df-employee-avatar__details">
          <span className="df-employee-avatar__name">{name || 'Unnamed Employee'}</span>
          {displaySubtitle && (
            <span className="df-employee-avatar__subtitle">{displaySubtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeAvatar;
