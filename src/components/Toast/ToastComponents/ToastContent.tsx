import React from "react";

interface ToastContentProps {
  message: string;
}

const ToastContent: React.FC<ToastContentProps> = ({ message }) => (
  <span className="toast-message">{message}</span>
);

export default ToastContent;
