import React, { useState } from "react";
import { ToastType } from "../../types";
import ToastContent from "./ToastComponents/ToastContent";
import CloseButton from "./ToastComponents/CloseButton";
import Animation from "./ToastComponents/Animation";
import "./Toast.css";

interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: ToastType;
}

/**
 *
 * @param message The message to display in the toast
 * @param actionLabel Optional label for an action button
 * @param onAction Optional callback for the action button
 * @param type The type of toast (info, success, error, warning)
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
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const handleClose = () => setVisible(false);

  return (
    <Animation>
      <div className={`toast toast-${type}`} role="alert">
        <ToastContent message={message} />
        {actionLabel && onAction && (
          <button className="toast-action" onClick={onAction}>
            {actionLabel}
          </button>
        )}
        <CloseButton onClick={handleClose} />
      </div>
    </Animation>
  );
};

export default Toast;
