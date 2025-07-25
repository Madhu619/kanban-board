import React from "react";

interface BoardColumnHeaderProps {
  label: string;
}

const BoardColumnHeader: React.FC<BoardColumnHeaderProps> = ({ label }) => (
  <div className="board-column-header-sticky">{label}</div>
);

export default BoardColumnHeader;
