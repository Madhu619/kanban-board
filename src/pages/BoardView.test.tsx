import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BoardView from "./BoardView";

// Move mock data outside of jest.mock factory
const mockIssues = [
  {
    id: "1",
    title: "Test Issue",
    status: "backlog",
    assignee: "Alice",
    severity: 2,
    createdAt: new Date("2025-07-20T10:00:00Z"),
    updatedAt: new Date("2025-07-20T10:00:00Z"),
    author: "Madhu",
    priority: "high",
    userDefinedRank: 1,
    priorityScore: 10,
    description: "desc",
  },
];

jest.mock("../utils/api", () => ({
  mockApi: jest.fn((data) => Promise.resolve({ data })),
}));

jest.mock("../auth/withAuth", () => ({
  __esModule: true,
  withAuth: (Comp: any) => Comp,
}));

jest.mock("react-dnd", () => ({
  DndProvider: ({ children }: any) => <div>{children}</div>,
  useDrag: () => [{ isDragging: false }, () => {}],
  useDrop: () => [null, () => {}],
}));

jest.mock("react-dnd-html5-backend", () => ({ HTML5Backend: {} }));

jest.mock("../components/BoardCard/BoardCard", () => (props: any) => (
  <div data-testid="board-card">{props.issue.title}</div>
));

jest.mock("../components/BoardColumn/BoardColumn", () => (props: any) => (
  <div data-testid="board-column">{props.children}</div>
));

jest.mock("../components/BoardControls/BoardControls", () => (props: any) => (
  <div data-testid="board-controls" />
));

jest.mock("../components/Toast/Toast", () => (props: any) => (
  <div data-testid="toast">{props.message}</div>
));

jest.mock("../constants/currentUser", () => ({
  useUser: () => ({ username: "madhu" }),
}));

jest.mock("../hooks/usePolling", () => ({
  usePolling: jest.fn(),
}));

jest.mock("../utils/boardHelper", () => ({
  getPersistedIssues: jest.fn(() => mockIssues),
  persistIssues: jest.fn(),
  getUserRole: () => "admin",
  getAssignees: (issues: any[]) => issues.map((i) => i.assignee),
  filterAndSortIssues: (issues: any[]) => issues,
  moveIssue: (issues: any[], id: string, newStatus: string) => issues,
}));

describe("BoardView", () => {
  it("renders loading spinner, then board columns and cards", async () => {
    render(<BoardView />);
    expect(screen.getByText(/Loading board/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByTestId("board-column")).toBeInTheDocument()
    );
    expect(screen.getByTestId("board-card")).toHaveTextContent("Test Issue");
  });

  it("shows error if mockApi returns error", async () => {
    const { mockApi } = require("../utils/api");
    mockApi.mockImplementationOnce(() =>
      Promise.resolve({ error: "Simulated error" })
    );
    render(<BoardView />);
    await waitFor(() =>
      expect(screen.getByText(/Simulated error/i)).toBeInTheDocument()
    );
  });
});
