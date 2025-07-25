import React from "react";
import { FaUser } from "react-icons/fa";
import "./AssigneeFilter.css";

interface AssigneeFilterProps {
  value: string | "ALL";
  assignees: string[];
  onChange: (v: string | "ALL") => void;
}

const AssigneeFilter: React.FC<AssigneeFilterProps> = ({
  value,
  assignees,
  onChange,
}) => (
  <div className="assignee-filter">
    <label className="assignee-label">Assignee:</label>
    <select
      className="assignee-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="ALL">All</option>
      {assignees.map((a) => (
        <option key={a} value={a}>
          {a}
        </option>
      ))}
    </select>
  </div>
);

export default AssigneeFilter;
