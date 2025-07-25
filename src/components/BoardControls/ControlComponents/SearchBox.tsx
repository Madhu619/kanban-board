import React from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBox.css";

interface SearchBoxProps {
  value: string;
  onChange: (v: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange }) => (
  <div className="search-box">
    <input
      type="text"
      className="search-input"
      placeholder="Search issues..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default SearchBox;
