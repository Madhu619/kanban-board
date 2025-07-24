import React from "react";
import { ToastType } from "../../types";
import "./Toast.css";

interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: ToastType;
}

/**
 *
 * @param param0.message The message to display in the toast
 * @param param0.actionLabel Optional label for an action button
 * @param param0.onAction Optional callback for the action button
 * @param param0.type The type of toast (info, success, error, warning)
 * @returns A styled toast component that displays a message and an optional action button
 * @author Madhusudhana RK
 * @date 2025-07-23
 */

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
