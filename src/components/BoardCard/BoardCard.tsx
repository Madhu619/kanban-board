import React from "react";
import { useDrag } from "react-dnd";
import { Task, TaskStatus } from "../../types";
import "./BoardCard.css";
interface CardIssueProps {
  issue: Task;
  onMove?: (status: TaskStatus) => void;
  isReadOnly?: boolean;
}

const ITEM_TYPE = "CARD";

/**
 *
 * @param issue The issue to display in the card
 * @param onMove Callback to handle moving the issue to a new status
 * @param isReadOnly Whether the card is read-only (no drag/drop)
 * @returns A draggable card component for displaying issues on the board
 * @author Madhusudhana RK
 * @date 2025-07-23
 */

const BoardCard: React.FC<CardIssueProps> = ({ issue, onMove, isReadOnly }) => {
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
      ref={
        isReadOnly ? undefined : (drag as unknown as React.Ref<HTMLDivElement>)
      }
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
        {typeof issue.assignee === "string" ? (
          <span className="card-issue-meta-assignee">{issue.assignee}</span>
        ) : issue.assignee && issue.assignee.name ? (
          <span className="card-issue-meta-assignee">
            {issue.assignee.name}
          </span>
        ) : (
          "-"
        )}
      </div>
      <div className="card-issue-meta">
        {!isReadOnly && (
          <>
            <button
              onMouseDown={(e) => e.nativeEvent.stopImmediatePropagation()}
              onClick={(e) => {
                e.nativeEvent.stopImmediatePropagation();
                onMove && onMove(TaskStatus.BACKLOG);
              }}
              disabled={issue.status === TaskStatus.BACKLOG}
            >
              Backlog
            </button>
            <button
              onMouseDown={(e) => e.nativeEvent.stopImmediatePropagation()}
              onClick={(e) => {
                e.nativeEvent.stopImmediatePropagation();
                onMove && onMove(TaskStatus.IN_PROGRESS);
              }}
              disabled={issue.status === TaskStatus.IN_PROGRESS}
            >
              In Progress
            </button>
            <button
              onMouseDown={(e) => e.nativeEvent.stopImmediatePropagation()}
              onClick={(e) => {
                e.nativeEvent.stopImmediatePropagation();
                onMove && onMove(TaskStatus.DONE);
              }}
              disabled={issue.status === TaskStatus.DONE}
            >
              Done
            </button>
          </>
        )}
      </div>
      <div className="card-issue-link-container">
        <a href={`/issue/${issue.id}`} className="card-issue-link">
          View Issue &gt;
        </a>
      </div>
    </div>
  );
};

export default BoardCard;
