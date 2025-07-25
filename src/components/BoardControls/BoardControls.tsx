import React from "react";
import { TaskStatus } from "../../types";
import "./BoardControls.css";

interface BoardControlsProps {
  search: string;
  setSearch: (v: string) => void;
  assignee: string | "ALL";
  setAssignee: (v: string | "ALL") => void;
  sort: "score-high" | "score-low";
  setSort: (v: "score-high" | "score-low") => void;
  statusColumns: { key: TaskStatus; label: string }[];
  assignees: string[];
}

/**
 * BoardControls component for managing board search , filters and sorting
 * @param search The current search query
 * @param setSearch Function to update the search query
 * @param assignee The currently selected assignee filter
 * @param setAssignee Function to update the assignee filter
 * @param sort The current sort order
 * @param setSort Function to update the sort order
 * @param assignees The list of available assignees for filtering
 * @returns A set of controls for managing the board view
 *
 * @author Madhusudhana RK
 * @date 2025-07-23
 */

const BoardControls: React.FC<BoardControlsProps> = ({
  search,
  setSearch,
  assignee,
  setAssignee,
  sort,
  setSort,
  assignees,
}) => {
  return (
    <div
      className="board-view-controls"
      role="region"
      aria-label="Board Controls"
    >
      <label htmlFor="board-search-input" className="visually-hidden">
        Search Issues
      </label>
      <input
        id="board-search-input"
        type="search"
        placeholder="Search by title or tags..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="board-search-input"
        aria-label="Search Issues"
        autoComplete="off"
      />
      <label htmlFor="board-filter-select" className="visually-hidden">
        Filter by Assignee
      </label>
      <select
        id="board-filter-select"
        value={assignee}
        onChange={(e) => setAssignee(e.target.value as string | "ALL")}
        className="board-filter-select"
        aria-label="Filter by Assignee"
      >
        <option value="ALL">All Assignees</option>
        {assignees.map((assign) => (
          <option key={assign} value={assign}>
            {assign}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="board-sort-toggle"
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.preventDefault();
          setSort(sort === "score-high" ? "score-low" : "score-high");
        }}
        title={sort === "score-high" ? "High to Low" : "Low to High"}
        aria-label={sort === "score-high" ? "High to Low" : "Low to High"}
      >
        <span className="board-sort-arrow" aria-hidden="true">
          {sort === "score-high" ? "↑" : "↓"}
        </span>
        <span className="board-sort-label">
          Sort by
          {sort === "score-high" ? " (High → Low)" : " (Low → High)"}
        </span>
      </button>
    </div>
  );
};

export default BoardControls;
