import React from 'react';
import { Button } from './Button';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false
}: ConfirmDialogProps) {
  return (
    <div className="p-6 max-w-md">
      <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
      <div className="mt-2">
        <p className="text-sm text-gray-500">
          {message}
        </p>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <Button onClick={onCancel} variant="outline">
          {cancelLabel}
        </Button>
        <Button 
          onClick={onConfirm} 
          variant={isDestructive ? 'destructive' : 'default'}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}
