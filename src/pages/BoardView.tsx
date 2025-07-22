import React, { useEffect, useState, useRef } from "react";
import { Task, TaskStatus, ToastType, TOAST_MAP } from "../types";
import issuesData from "../data/issues.json";
import Toast from "../components/Toast/Toast";
import BoardIssue from "../components/BoardIssue/BoardCard";
import BoardColumn from "../components/BoardColumn/BoardColumn";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./BoardView.css";

const statusColumns = [
  { key: TaskStatus.BACKLOG, label: "Backlog" },
  { key: TaskStatus.IN_PROGRESS, label: "In Progress" },
  { key: TaskStatus.DONE, label: "Done" },
];

const BoardView: React.FC = () => {
  const [issues, setIssues] = useState<Task[]>([]);
  const [pending, setPending] = useState<{
    id: string;
    prevStatus: TaskStatus;
    newStatus: TaskStatus;
  } | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType }>({
    message: "",
    type: "info",
  });
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
    setIssues((prev) => {
      const issue = prev.find((i) => i.id === id);
      if (!issue || issue.status === newStatus) return prev;
      setPending({ id, prevStatus: issue.status, newStatus });
      setShowUndo(true);
      // Use mapping for toast
      const toastData = TOAST_MAP[newStatus] || {
        message: "Issue moved!",
        type: "info",
      };
      setToast(toastData);
      // Optimistically update
      return prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i));
    });
    // Simulate async save
    if (undoTimeout.current) clearTimeout(undoTimeout.current);
    undoTimeout.current = setTimeout(() => {
      /** this section is under testing ... RK-Madhu */
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="board-view">
        {statusColumns.map((col) => (
          <BoardColumn
            key={col.key}
            status={col.key}
            label={col.label}
            issues={issues.filter((issue) => issue.status === col.key)}
            onDropIssue={(id) => handleDrop(id, col.key)}
          >
            {issues
              .filter((issue) => issue.status === col.key)
              .map((issue) => (
                <BoardIssue
                  key={issue.id}
                  issue={issue}
                  onMove={(status) => handleMove(issue.id, status)}
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

export default BoardView;
