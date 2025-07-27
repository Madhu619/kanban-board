// Mock react-dnd to avoid ESM import errors in Jest
jest.mock("react-dnd", () => ({
  useDrag: () => [{ isDragging: false }, () => {}],
}));
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BoardCard from "./BoardCard";
import { Task, TaskStatus } from "../../types";

describe("BoardCard", () => {
  //Sample task for testing
  const baseIssue: Task = {
    id: "1",
    title: "Test Issue",
    description: "Test Description",
    status: TaskStatus.BACKLOG,
    author: "Samanvi",
    priority: "High",
    assignee: "Sony",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("renders issue details", () => {
    render(<BoardCard issue={baseIssue} />);
    expect(screen.getByText(/Test Issue/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Description/i)).toBeInTheDocument();
    expect(screen.getByText(/Samanvi/i)).toBeInTheDocument();
    expect(screen.getByText(/High/i)).toBeInTheDocument();
    expect(screen.getByText(/Sony/i)).toBeInTheDocument();
    expect(screen.getByText(/View Issue/i)).toBeInTheDocument();
  });

  it("renders move buttons when not read-only", () => {
    render(<BoardCard issue={baseIssue} />);
    expect(
      screen.getByRole("button", { name: /Backlog/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /In Progress/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Done/i })).toBeInTheDocument();
  });

  it("Do not render move buttons when user is contributor", () => {
    render(<BoardCard issue={baseIssue} isReadOnly />);
    expect(screen.queryByRole("button", { name: /Backlog/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /In Progress/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /Done/i })).toBeNull();
  });

  it("calls onMove with correct status when buttons are clicked", () => {
    const onMove = jest.fn();
    render(<BoardCard issue={baseIssue} onMove={onMove} />);
    fireEvent.click(screen.getByRole("button", { name: /In Progress/i }));
    expect(onMove).toHaveBeenCalledWith(TaskStatus.IN_PROGRESS);
    fireEvent.click(screen.getByRole("button", { name: /Done/i }));
    expect(onMove).toHaveBeenCalledWith(TaskStatus.DONE);
  });

  it("disables button for current status", () => {
    render(<BoardCard issue={{ ...baseIssue, status: TaskStatus.DONE }} />);
    expect(screen.getByRole("button", { name: /Done/i })).toBeDisabled();
  });

  it("renders assignee name if assignee is object", () => {
    render(
      <BoardCard
        issue={{ ...baseIssue, assignee: { name: "Samanvi" } } as any}
      />
    );
    expect(screen.getByText(/Samanvi/i)).toBeInTheDocument();
  });
});
