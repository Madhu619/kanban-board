import React from "react";
import "./SeverityBadge.css";

interface SeverityBadgeProps {
  severity: number;
}

const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => (
  <span className={`severity-badge severity-${severity}`}>
    Severity {severity}
  </span>
);

export default SeverityBadge;
