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
  const [sort, setSort] = useState<"score-high" | "score-low">("score-high");
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

  // Polling to fetch issues every 30 seconds
  // This will keep the board updated with any changes
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

  const assignees = getAssignees(issues);
  const filteredIssues = filterAndSortIssues(
    issues,
    search,
    assignee,
    "ALL"
  ).sort((a, b) => {
    const scoreDiff =
      sort === "score-high"
        ? (b.priorityScore ?? 0) - (a.priorityScore ?? 0)
        : (a.priorityScore ?? 0) - (b.priorityScore ?? 0);
    if (scoreDiff !== 0) return scoreDiff;
    // If scores match, newer issues first
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <BoardControls
        search={search}
        setSearch={setSearch}
        assignee={assignee}
        setAssignee={setAssignee}
        sort={sort}
        setSort={setSort}
        statusColumns={statusColumns}
        assignees={assignees}
      />
      <div className="board-sync-status">
        Last sync: {lastSync.toLocaleTimeString()} |
        <button className="btn" onClick={fetchIssues}>
          Sync Now
        </button>
      </div>
      {loading ? (
        <div className="loading-modal">
          <span className="loading-spinner" />
          <div className="loading-text">Loading board...</div>
        </div>
      ) : error ? (
        <div className="board-error">{error}</div>
      ) : (
        <div className="board-view">
          {statusColumns.map((col) => (
            <BoardColumn
              key={col.key}
              label={col.label}
              issues={filteredIssues.filter(
                (issue) => issue.status === col.key
              )}
              onDropIssue={
                isReadOnly ? () => {} : (id) => handleDropOrMove(id, col.key)
              }
            >
              {filteredIssues
                .filter((issue) => issue.status === col.key)
                .map((issue) => (
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
