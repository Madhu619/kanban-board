import React from "react";
import "./SortDropdown.css";

interface SortDropdownProps {
  value: "score-high" | "score-low";
  onChange: (v: "score-high" | "score-low") => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => (
  <div className="sort-dropdown">
    <label className="sort-label">Sort:</label>
    <select
      className="sort-select"
      value={value}
      onChange={(e) => onChange(e.target.value as "score-high" | "score-low")}
    >
      <option value="score-high">Score High to Low</option>
      <option value="score-low">Score Low to High</option>
    </select>
  </div>
);

export default SortDropdown;
