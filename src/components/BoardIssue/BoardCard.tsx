import React from "react";
import { Task, TaskStatus } from "../../types";
import { useDrag } from "react-dnd";
import "./BoardCard.css";

const ITEM_TYPE = "CARD";

interface CardIssueProps {
  issue: Task;
  onMove: (status: TaskStatus) => void;
}

const BoardCard: React.FC<CardIssueProps> = ({ issue, onMove }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ITEM_TYPE,
      item: { id: issue.id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [issue.id]
  );

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      className="card-issue"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="card-issue-title">{issue.title}</div>
      <div className="card-issue-desc">{issue.description}</div>
      <div className="card-issue-meta">
        Author:{" "}
        <span className="card-issue-meta-author"> {issue.author || "-"} </span>|
        Priority: {issue.priority || "-"}
      </div>
      <div className="card-issue-meta">
        Assignee:{" "}
        {typeof issue.assignee === "string"
          ? issue.assignee
          : issue.assignee?.name || "-"}
      </div>
      <div className="card-issue-meta">
        {/* Fallback for button-based movement */}
        <button
          onClick={() => onMove(TaskStatus.BACKLOG)}
          disabled={issue.status === TaskStatus.BACKLOG}
        >
          Backlog
        </button>
        <button
          onClick={() => onMove(TaskStatus.IN_PROGRESS)}
          disabled={issue.status === TaskStatus.IN_PROGRESS}
        >
          In Progress
        </button>
        <button
          onClick={() => onMove(TaskStatus.DONE)}
          disabled={issue.status === TaskStatus.DONE}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default BoardCard;
