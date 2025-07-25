import React from "react";
import { useDrag } from "react-dnd";
import { Task, TaskStatus } from "../../types";
import "./BoardCard.css";
import PriorityBadge from "./PriorityBadge/PriorityBadge";
import SeverityBadge from "./SeverityBadge/SeverityBadge";
import AssigneeAvatar from "./AssigneeAvatar/AssigneeAvatar";

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
      className={`card-issue${isDragging ? " dragging" : ""}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      tabIndex={0}
    >
      <div className="card-issue-header">
        <div className="card-issue-title">{issue.title}</div>
        {issue.priority && <PriorityBadge priority={String(issue.priority)} />}
        {typeof issue.severity === "number" && (
          <SeverityBadge severity={issue.severity} />
        )}
      </div>
      <div className="card-issue-desc">{issue.description}</div>
      <div className="card-issue-meta-row">
        <div className="card-issue-meta">
          <span className="card-issue-avatar" title={issue.author}>
            {issue.author ? issue.author[0].toUpperCase() : "-"}
          </span>
          <span className="card-issue-meta-label">Author:</span>
          <span className="card-issue-meta-author">{issue.author || "-"}</span>
        </div>
        <div className="card-issue-meta">
          <AssigneeAvatar
            assignee={
              typeof issue.assignee === "string"
                ? issue.assignee
                : issue.assignee &&
                  typeof issue.assignee === "object" &&
                  issue.assignee.name
                ? issue.assignee.name
                : "-"
            }
          />
          <span className="card-issue-meta-label">Assignee:</span>
          <span className="card-issue-meta-assignee">
            {typeof issue.assignee === "string"
              ? issue.assignee
              : issue.assignee &&
                typeof issue.assignee === "object" &&
                issue.assignee.name
              ? issue.assignee.name
              : "-"}
          </span>
        </div>
      </div>
      <div className="card-issue-controls">
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
          {"View Issue >"}
        </a>
      </div>
    </div>
  );
};

export default BoardCard;
