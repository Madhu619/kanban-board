import React from "react";
import "./PriorityBadge.css";

interface PriorityBadgeProps {
  priority: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => (
  <span className={`priority-badge priority-${priority.toLowerCase()}`}>
    {priority}
  </span>
);

export default PriorityBadge;
