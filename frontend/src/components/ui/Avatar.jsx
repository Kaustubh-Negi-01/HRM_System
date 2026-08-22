import React, { useState } from 'react';
import './Avatar.css';

export const Avatar = ({
  src,
  name = '',
  size = 'md',
  status,
  shape = 'circle',
  className = '',
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (str) => {
    if (!str) return '?';
    const parts = str.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const showImage = src && !imageError;

  return (
    <div
      className={`df-avatar df-avatar--${size} df-avatar--${shape} ${className}`}
      {...props}
    >
      {showImage ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className="df-avatar__img"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="df-avatar__initials" aria-label={name}>
          {getInitials(name)}
        </span>
      )}
      {status && (
        <span
          className={`df-avatar__status df-avatar__status--${status}`}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};

export default Avatar;
