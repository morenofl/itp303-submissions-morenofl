import React from 'react';
import './Confirm.css';

export default function Confirm({
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Yes",
  cancelLabel
}) {
  return (
    <div className="leave-popup">
      <div className="leave-card">
        <p>{message}</p>
        <div className="leave-buttons">
          <button className="btn pinkButton" onClick={onConfirm}>{confirmLabel}</button>
          <button className="btn cancelButton" onClick={onCancel}>{cancelLabel}</button>
        </div>
      </div>
    </div>
  );
}
