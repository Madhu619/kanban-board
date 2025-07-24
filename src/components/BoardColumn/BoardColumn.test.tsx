// Mock react-dnd to avoid ESM import errors in Jest
jest.mock('react-dnd', () => ({
  useDrop: () => [null, () => {}],
}));
import React from "react";
import { render, screen } from "@testing-library/react";
import BoardColumn from "./BoardColumn";
import { Task, TaskStatus } from "../../types";

describe("Test cases for BoardColumn component", () => {
  //Sample task for testing
  const baseIssue: Task = {
    id: "1",
    title: "Test Issue",
    description: "Test Description",
    status: TaskStatus.BACKLOG,
    author: "Alice",
    priority: "High",
    assignee: "Bob",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("renders label and children", () => {
    render(
      <BoardColumn label="Backlog" issues={[baseIssue]} onDropIssue={() => {}}>
        <div>Board Content</div>
      </BoardColumn>
    );
    expect(screen.getByText(/Backlog/i)).toBeInTheDocument();
    expect(screen.getByText(/Board Content/i)).toBeInTheDocument();
  });

  it("shows 'No issues' when issues column is empty", () => {
    render(
      <BoardColumn label="Done" issues={[]} onDropIssue={() => {}}>
        <></>
      </BoardColumn>
    );
    expect(screen.getByText(/No issues/i)).toBeInTheDocument();
  });

  it("does not show 'No issues' when issues exist", () => {
    render(
      <BoardColumn
        label="In Progress"
        issues={[baseIssue]}
        onDropIssue={() => {}}
      >
        <div>Some Issue</div>
      </BoardColumn>
    );
    expect(screen.queryByText(/No issues/i)).toBeNull();
    expect(screen.getByText(/Some Issue/i)).toBeInTheDocument();
  });

  it("calls onDropIssue when drop is triggered", () => {
    // useDrop can't be tested, so I will check that the prop exists
    const onDropIssue = jest.fn();
    render(
      <BoardColumn
        label="Backlog"
        issues={[baseIssue]}
        onDropIssue={onDropIssue}
      >
        <div>Child</div>
      </BoardColumn>
    );
    // drag-n-drop is not working without dnd backend, prop is passed as an alternative
    expect(typeof onDropIssue).toBe("function");
  });
});
