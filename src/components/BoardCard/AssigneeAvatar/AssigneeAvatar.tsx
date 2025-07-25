import React from "react";
import "./AssigneeAvatar.css";

interface AssigneeAvatarProps {
  assignee: string;
}

const AssigneeAvatar: React.FC<AssigneeAvatarProps> = ({ assignee }) => (
  <span className="assignee-avatar" title={assignee}>
    {assignee.charAt(0).toUpperCase()}
  </span>
);

export default AssigneeAvatar;
