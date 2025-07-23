import React from "react";
import { ToastType } from "../../types";
import "./Toast.css";

interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: ToastType;
}

const Toast: React.FC<ToastProps> = ({
  message,
  actionLabel,
  onAction,
  type = "info",
}) => {
  return (
    <div className={`toast toast-${type}`} role="alert">
      <span>{message}</span> |
      {actionLabel && onAction && (
        <button className="toast-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Toast;
