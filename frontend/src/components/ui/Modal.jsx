import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import './Modal.css';

export const Modal = ({
  open = false,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  closeOnEsc = true,
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = '',
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (closeOnEsc && e.key === 'Escape' && open && onClose) {
        onClose();
      }
    };

    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, closeOnEsc, onClose]);

  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="df-modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'df-modal-title' : undefined}
    >
      <div
        ref={modalRef}
        className={`df-modal-container df-modal-container--${size} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="df-modal__header">
            <div className="df-modal__titles">
              {title && <h2 id="df-modal-title" className="df-modal__title">{title}</h2>}
              {subtitle && <p className="df-modal__subtitle">{subtitle}</p>}
            </div>
            {showCloseButton && (
              <button
                type="button"
                className="df-modal__close-btn"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        <div className="df-modal__body">
          {children}
        </div>

        {footer && (
          <div className="df-modal__footer">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
