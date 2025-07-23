import React, { useEffect, useState, useRef } from "react";
import { Task, TaskStatus, ToastType } from "../types";
import issuesData from "../data/issues.json";
import Toast from "../components/Toast/Toast";
import BoardCard from "../components/BoardCard/BoardCard";
import BoardColumn from "../components/BoardColumn/BoardColumn";
import BoardControls from "../components/BoardControls/BoardControls";
import { withAuth } from "../auth/withAuth";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./BoardView.css";
import {
  getAssignees,
  filterAndSortIssues,
  moveIssue as moveIssueLogic,
  getUserRole,
} from "../utils/boardLogic";

const statusColumns = [
  { key: TaskStatus.BACKLOG, label: "Backlog" },
  { key: TaskStatus.IN_PROGRESS, label: "In Progress" },
  { key: TaskStatus.DONE, label: "Done" },
];

interface BoardViewProps {
  username?: string;
}

const BoardView: React.FC<BoardViewProps> = ({ username }) => {
  const currentUsername =
    username || localStorage.getItem("kanban-username") || "guest";
  const role = getUserRole(currentUsername || "guest");
  const isReadOnly = role === "contributor";
  const [issues, setIssues] = useState<Task[]>([]);
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
  // Live search by title/tags, filter by assignee/severity, sort by score
  const [search, setSearch] = useState("");
  const [assignee, setAssignee] = useState<string | "ALL">("ALL");
  const [sort, setSort] = useState<"score-high" | "score-low">("score-high");
  const undoTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIssues(
      (issuesData as any[]).map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt || item.createdAt),
      }))
    );
  }, []);

  const moveIssue = (id: string, newStatus: TaskStatus) => {
    setIssues((prev) =>
      moveIssueLogic(prev, id, newStatus, setPending, setShowUndo, (toastObj) =>
        setToast({
          message: toastObj.message,
          type:
            typeof toastObj.type === "string"
              ? (toastObj.type as ToastType)
              : toastObj.type,
        })
      )
    );
    // async save wait upto 5 seconds
    if (undoTimeout.current) clearTimeout(undoTimeout.current);
    undoTimeout.current = setTimeout(() => {
      //setPending(null);
      //setShowUndo(false);
    }, 5000);
  };

  const handleDrop = (id: string, status: TaskStatus) => {
    moveIssue(id, status);
  };

  const handleMove = (id: string, status: TaskStatus) => {
    moveIssue(id, status);
  };

  const handleUndo = () => {
    if (pending) {
      setIssues((prev) =>
        prev.map((i) =>
          i.id === pending.id ? { ...i, status: pending.prevStatus } : i
        )
      );
      setPending(null);
      setShowUndo(false);
      if (undoTimeout.current) clearTimeout(undoTimeout.current);
    }
  };

  // Use generic business logic helpers
  const assignees = getAssignees(issues);
  // Filter and sort issues based on search, assignee, and sort criteria
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
      <div className="board-view">
        {statusColumns.map((col) => (
          <BoardColumn
            key={col.key}
            status={col.key}
            label={col.label}
            issues={filteredIssues.filter((issue) => issue.status === col.key)}
            onDropIssue={
              isReadOnly ? () => {} : (id) => handleDrop(id, col.key)
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
                      : (status) => handleMove(issue.id, status)
                  }
                  isReadOnly={isReadOnly}
                />
              ))}
          </BoardColumn>
        ))}
      </div>
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
