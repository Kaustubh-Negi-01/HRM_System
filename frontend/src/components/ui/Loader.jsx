import React from 'react';
import './Loader.css';

export const Loader = ({
  size = 'md',
  text,
  fullPage = false,
  className = '',
}) => {
  const content = (
    <div className={`df-loader df-loader--${size} ${className}`}>
      <div className="df-loader__spinner" aria-hidden="true" />
      {text && <span className="df-loader__text">{text}</span>}
    </div>
  );

  if (fullPage) {
    return <div className="df-loader-fullpage">{content}</div>;
  }

  return content;
};

export const Skeleton = ({
  width = '100%',
  height = '16px',
  radius = 'sm',
  count = 1,
  className = '',
}) => {
  const items = Array.from({ length: count });

  return (
    <div className={`df-skeleton-group ${className}`}>
      {items.map((_, i) => (
        <div
          key={i}
          className={`df-skeleton df-skeleton--radius-${radius}`}
          style={{ width, height }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

export default Loader;
