import React from "react";

interface CloseButtonProps {
  onClick: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => (
  <button
    className="toast-close"
    onClick={onClick}
    aria-label="Close notification"
  >
    ×
  </button>
);

export default CloseButton;
