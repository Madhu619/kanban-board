import React from "react";
import "./SubmitButton.css";

interface SubmitButtonProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  onClick,
  type = "button",
  children,
}) => (
  <button className="cta-button" onClick={onClick} type={type}>
    {children}
  </button>
);

export default SubmitButton;
