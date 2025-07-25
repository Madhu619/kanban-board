import React from "react";

interface AnimationProps {
  children: React.ReactNode;
}

// Simple fade-in animation wrapper
const Animation: React.FC<AnimationProps> = ({ children }) => (
  <div className="toast-fade-in">{children}</div>
);

export default Animation;
