import React from 'react';
import { AlertTriangle, HelpCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const ConfirmDialog = ({
  open = false,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone. Please confirm to proceed.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  loading = false,
  icon,
}) => {
  const defaultIcon = confirmVariant === 'danger'
    ? <AlertTriangle size={24} style={{ color: 'var(--danger)' }} />
    : <HelpCircle size={24} style={{ color: 'var(--primary)' }} />;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      closeOnEsc={!loading}
      closeOnOverlayClick={!loading}
      footer={
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            size="sm"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0, marginTop: '2px' }}>
          {icon || defaultIcon}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <h4 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text)' }}>
            {title}
          </h4>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {description}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
