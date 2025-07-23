import React from "react";
import { TaskStatus } from "../../types";
import "./BoardControls.css";

/**
 * Props for BoardControls component
 *
 * @property search - Current search query string for live filtering by title or tags.
 * @property setSearch - Function to update the search query.
 * @property assignee - Current assignee filter (string or "ALL") to filter issues by assignee.
 * @property setAssignee - Function to update the assignee filter.
 * @property severity - Current severity filter (string or "ALL") to filter issues by severity.
 * @property setSeverity - Function to update the severity filter.
 * @property sort - Current sort option ("score") to sort issues by computed priority score.
 * @property setSort - Function to update the sort option.
 * @property statusColumns - Array of status columns available on the board, each with a key and label.
 * @property assignees - Array of unique assignees for filter dropdown.
 * @property severities - Array of unique severities for filter dropdown.
 */
interface BoardControlsProps {
  /** Current search query string for live filtering by title or tags. */
  search: string;
  /** Function to update the search query. */
  setSearch: (v: string) => void;
  /** Current assignee filter (string or "ALL") to filter issues by assignee. */
  assignee: string | "ALL";
  /** Function to update the assignee filter. */
  setAssignee: (v: string | "ALL") => void;
  /** Current sort option ("score-high" or "score-low") to sort issues by priority score. */
  sort: "score-high" | "score-low";
  /** Function to update the sort option. */
  setSort: (v: "score-high" | "score-low") => void;
  /** Array of status columns available on the board, each with a key and label. */
  statusColumns: { key: TaskStatus; label: string }[];
  /** Array of unique assignees for filter dropdown. */
  assignees: string[];
}

const BoardControls: React.FC<BoardControlsProps> = ({
  search,
  setSearch,
  assignee,
  setAssignee,
  sort,
  setSort,
  statusColumns,
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
        {assignees.map((a) => (
          <option key={a} value={a}>
            {a}
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
        title={
          sort === "score-high"
            ? "Sort by Priority: High to Low"
            : "Sort by Priority: Low to High"
        }
        aria-label={
          sort === "score-high"
            ? "Sort by Priority: High to Low"
            : "Sort by Priority: Low to High"
        }
      >
        <span className="board-sort-arrow" aria-hidden="true">
          {sort === "score-high" ? "↑" : "↓"}
        </span>
        <span className="board-sort-label">
          Sort by Priority Score
          {sort === "score-high" ? " (High → Low)" : " (Low → High)"}
        </span>
      </button>
    </div>
  );
};

export default BoardControls;
