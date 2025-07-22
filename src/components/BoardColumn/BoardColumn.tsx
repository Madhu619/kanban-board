import React from "react";
import { Task, TaskStatus } from "../../types";
import { useDrop } from "react-dnd";
import "./BoardColumn.css";

const ITEM_TYPE = "CARD";

interface BoardColumnProps {
  status: TaskStatus;
  label: string;
  issues: Task[];
  onDropIssue: (id: string) => void;
  children: React.ReactNode;
}

const BoardColumn: React.FC<BoardColumnProps> = ({
  status,
  label,
  issues,
  onDropIssue,
  children,
}) => {
  const [, drop] = useDrop(
    () => ({
      accept: ITEM_TYPE,
      drop: (item: { id: string }) => {
        onDropIssue(item.id);
      },
    }),
    [onDropIssue]
  );

  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className="board-column"
    >
      <h2 className="board-column-label">{label}</h2>
      {issues.length === 0 && <p style={{ color: "#888" }}>No issues</p>}
      {children}
    </div>
  );
};

export default BoardColumn;
