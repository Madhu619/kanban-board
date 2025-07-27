import React, { useState, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task, TaskStatus, ToastType } from "../types";
// import issuesData from "../data/issues.json";
import Toast from "../components/Toast/Toast";
import BoardCard from "../components/BoardCard/BoardCard";
import BoardColumn from "../components/BoardColumn/BoardColumn";
import BoardControls from "../components/BoardControls/BoardControls";
import { withAuth } from "../auth/withAuth";
import "./BoardView.css";
import {
  getAssignees,
  filterAndSortIssues,
  moveIssue as moveIssueLogic,
} from "../utils/boardLogic";
import { useUser } from "../constants/currentUser";
import { usePolling } from "../hooks/usePolling";
import {
  getPersistedIssues,
  getUserRole,
  persistIssues,
} from "../utils/boardHelper";
import { mockApi } from "../utils/api";

const statusColumns = [
  { key: TaskStatus.BACKLOG, label: "Backlog" },
  { key: TaskStatus.IN_PROGRESS, label: "In Progress" },
  { key: TaskStatus.DONE, label: "Done" },
];

interface BoardViewProps {
  username?: string;
}

/**
 *
 * @param username - Optional username to override the current user
 * @returns A BoardView component that displays the Kanban board with issues
 * @author Madhusudhana RK
 * @date 2025-07-23
 */

const BoardView: React.FC<BoardViewProps> = ({ username }) => {
  const { username: contextUsername } = useUser();
  const currentUsername = username || contextUsername || "guest";
  const role = getUserRole(currentUsername || "guest");
  const isReadOnly = role === "contributor";
  const [issues, setIssues] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<{
    id: string;
    prevStatus: TaskStatus;
    newStatus: TaskStatus;
  } | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType }>({
    message: "",
    type: "info" as ToastType,
  });
  // State for search, filter, and sort
  const [search, setSearch] = useState("");
  const [assignee, setAssignee] = useState<string | "ALL">("ALL");
  type SortType = "score-high" | "score-low" | "priority-high" | "priority-low";
  const [sort, setSort] = useState<SortType>("score-high");
  const undoTimeout = useRef<NodeJS.Timeout | null>(null);
  const [lastSync, setLastSync] = useState<Date>(new Date());

  // Function to fetch issues with simulated delay
  const fetchIssues = () => {
    setLoading(true);
    setError(null);
    setIssues([]);
    mockApi(getPersistedIssues(), 1200, false)
      .then((res) => {
        if (res.error) {
          setError(res.error);
          setIssues([]);
        } else {
          setIssues(res.data || []);
        }
        setLastSync(new Date());
      })
      .catch(() => {
        setError("Unknown error");
        setIssues([]);
        setLastSync(new Date());
      })
      .finally(() => setLoading(false));
  };

  // On mount, load issues from localStorage or fallback
  React.useEffect(() => {
    fetchIssues();
    // eslint-disable-next-line
  }, []);

  // Reset page to 1 when search/filter/sort changes
  React.useEffect(() => {
    setPage(1);
  }, [search, assignee, sort]);

  // Polling to fetch issues every 30 seconds - More the time, more issues can be seen.
  // This will keep the board updated with any changes
  // Comment below line in case of debugging or testing
  usePolling(fetchIssues, 30000, []);

  const moveIssue = (id: string, newStatus: TaskStatus) => {
    setIssues((prev) => {
      const updated = moveIssueLogic(
        prev,
        id,
        newStatus,
        setPending,
        setShowUndo,
        (toastObj) =>
          setToast({
            message: toastObj.message,
            type:
              typeof toastObj.type === "string"
                ? (toastObj.type as ToastType)
                : toastObj.type,
          })
      );
      persistIssues(updated);
      return updated;
    });
    // async save wait upto 5 seconds
    if (undoTimeout.current) clearTimeout(undoTimeout.current);

    undoTimeout.current = setTimeout(() => {
      setPending(null);
      setShowUndo(false);
    }, 5000);
  };

  const handleDropOrMove = (id: string, status: TaskStatus) => {
    moveIssue(id, status);
  };

  const handleUndo = () => {
    if (pending) {
      setIssues((prev) => {
        const updated = prev.map((i) =>
          i.id === pending.id ? { ...i, status: pending.prevStatus } : i
        );
        persistIssues(updated);
        return updated;
      });
      setPending(null);
      setShowUndo(false);
      if (undoTimeout.current) clearTimeout(undoTimeout.current);
    }
  };

  // Pagination state /** Form here to line 188 works only when the total issues > 10 */
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const assignees = getAssignees(issues);
  // Filter issues for search/assignee only (no sort)
  const filteredIssues = filterAndSortIssues(issues, search, assignee, "ALL");

  // Paginate per status column, with per-column sorting if needed
  const paginatedByStatus: Record<string, Task[]> = {};
  statusColumns.forEach((col) => {
    let colIssues = filteredIssues.filter((issue) => issue.status === col.key);
    colIssues = colIssues.slice().sort((a, b) => {
      const aScore = typeof a.priorityScore === "number" ? a.priorityScore : 0;
      const bScore = typeof b.priorityScore === "number" ? b.priorityScore : 0;
      const diff = sort === "score-high" ? bScore - aScore : aScore - bScore;
      if (diff !== 0) return diff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    paginatedByStatus[col.key] = colIssues.slice(
      (page - 1) * pageSize,
      page * pageSize
    );
  });

  // Calculate total pages based on largest column in the Board View.
  const totalPages = Math.max(
    ...statusColumns.map((col) =>
      Math.ceil(
        filteredIssues.filter((issue) => issue.status === col.key).length /
          pageSize
      )
    )
  );

  // Debug: Print distribution of priorities across statuses
  // remove this in production - Madhusudhana RK
  React.useEffect(() => {
    if (!issues.length) return;
    const dist: Record<string, Record<string, number>> = {
      backlog: { high: 0, medium: 0, low: 0 },
      "in-progress": { high: 0, medium: 0, low: 0 },
      done: { high: 0, medium: 0, low: 0 },
    };
    issues.forEach((issue) => {
      const status = String(issue.status).toLowerCase();
      const priority =
        typeof issue.priority === "string"
          ? issue.priority.toLowerCase()
          : "unknown";
      if (dist[status] && dist[status][priority] !== undefined) {
        dist[status][priority]++;
      }
    });
    // eslint-disable-next-line no-console
    console.log("Priority distribution by status:", dist);
  }, [issues]);

  console.log("Filtered Issues:", filteredIssues); // remove in production Madhusudhana RK

  return (
    <DndProvider backend={HTML5Backend}>
      <BoardControls
        search={search}
        setSearch={setSearch}
        assignee={assignee}
        setAssignee={setAssignee}
        sort={
          sort === "score-high" || sort === "score-low" ? sort : "score-high"
        }
        setSort={setSort}
        statusColumns={statusColumns}
        assignees={assignees}
      />
      <div className="board-top-section">
        <div className="board-sync-status">
          Last sync: {lastSync.toLocaleTimeString()} |
          <button className="btn" onClick={fetchIssues}>
            Sync Now
          </button>
        </div>
        {totalPages > 1 && filteredIssues.length > 0 && (
          <div
            className="pagination-controls"
            style={{ textAlign: "center", margin: "1rem 0" }}
          >
            <button
              className="btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span style={{ margin: "0 1rem" }}>
              Page {page} of {totalPages}
            </span>
            <button
              className="btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
      {loading ? (
        <div className="loading-modal">
          <span className="loading-spinner" />
          <div className="loading-text">Loading board...</div>
        </div>
      ) : error ? (
        <div className="board-error">{error}</div>
      ) : (
        <>
          <div className="board-view">
            {statusColumns.map((col) => (
              <BoardColumn
                key={col.key}
                label={col.label}
                issues={paginatedByStatus[col.key]}
                onDropIssue={
                  isReadOnly ? () => {} : (id) => handleDropOrMove(id, col.key)
                }
              >
                {paginatedByStatus[col.key].map((issue) => (
                  <BoardCard
                    key={issue.id}
                    issue={issue}
                    onMove={
                      isReadOnly
                        ? undefined
                        : (status) => handleDropOrMove(issue.id, status)
                    }
                    isReadOnly={isReadOnly}
                  />
                ))}
              </BoardColumn>
            ))}
          </div>
        </>
      )}
      {showUndo && pending && (
        <Toast
          message={toast.message}
          actionLabel="Undo"
          onAction={handleUndo}
          type={toast.type}
        />
      )}
    </DndProvider>
  );
};

export default withAuth(BoardView, "/board");
