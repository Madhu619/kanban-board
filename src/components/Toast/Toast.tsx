import React from "react";
import "./Toast.css";

interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: "success" | "error" | "info" | "warning";
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
