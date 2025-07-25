import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { Task } from "../../types";
import BoardColumnHeader from "./BoardColumnHeader/BoardColumnHeader";
import "./BoardColumn.css";

const ITEM_TYPE = "CARD";

interface BoardColumnProps {
  label: string;
  issues: Task[];
  onDropIssue: (id: string) => void;
  children: React.ReactNode;
  color?: string;
}

/**
 *
 * @param The properties for the board column
 * @param label The label for the column
 * @param issues The list of issues in this column
 * @param onDropIssue Callback to handle dropping an issue into this column
 * @param children Any additional children to render inside the column
 * @returns A column component for displaying issues on the board
 * @author Madhusudhana RK
 * @date 2025-07-23
 */

const BoardColumn: React.FC<BoardColumnProps> = ({
  label,
  issues,
  onDropIssue,
  children,
  color = "#f7fafd",
}) => {
  const [isOver, setIsOver] = useState(false);
  const [, drop] = useDrop(
    () => ({
      accept: ITEM_TYPE,
      drop: (item: { id: string }) => {
        onDropIssue(item.id);
      },
      hover: () => setIsOver(true),
      collect: (monitor) => {
        if (!monitor.isOver()) setIsOver(false);
        return {};
      },
    }),
    [onDropIssue]
  );

  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className={`board-column${isOver ? " board-column-drag-over" : ""}`}
    >
      <BoardColumnHeader label={label} />
      {issues.length === 0 && <p style={{ color: "#888" }}>No issues</p>}
      {children}
    </div>
  );
};

export default BoardColumn;
