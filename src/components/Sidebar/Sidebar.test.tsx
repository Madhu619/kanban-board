// Mock react-dnd to avoid ESM import errors in Jest (precautionary)
jest.mock("react-dnd", () => ({
  useDrag: () => [{ isDragging: false }, () => {}],
  useDrop: () => [null, () => {}],
}));
import React from "react";
import { render, screen } from "@testing-library/react";
import Sidebar from "./Sidebar";

// Helper to mock localStorage
function setLocalStorage(key: string, value: any) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

describe("Sidebar", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders nothing if no user is set", () => {
    render(<Sidebar />);
    expect(screen.queryByRole("complementary")).toBeNull();
  });

  it("renders 'No recent issues' if recentIssues is empty", () => {
    window.localStorage.setItem("kanban-username", "Madhu");
    window.localStorage.setItem("kanban-recent-issues", JSON.stringify([]));
    render(<Sidebar />);
    expect(screen.getByText(/No recent issues/i)).toBeInTheDocument();
  });

  it("renders recent issues if present", () => {
    window.localStorage.setItem("kanban-username", "Madhu");
    setLocalStorage("kanban-recent-issues", [
      { id: "1", title: "Issue One" },
      { id: "2", title: "Issue Two" },
    ]);
    render(<Sidebar />);
    expect(screen.getByText(/Issue One/i)).toBeInTheDocument();
    expect(screen.getByText(/Issue Two/i)).toBeInTheDocument();
    expect(screen.getAllByRole("link").length).toBe(2);
  });

  it("renders correct link for each issue", () => {
    window.localStorage.setItem("kanban-username", "Madhu");
    setLocalStorage("kanban-recent-issues", [
      { id: "123", title: "Test Issue" },
    ]);
    render(<Sidebar />);
    const link = screen.getByRole("link", { name: /Test Issue/i });
    expect(link).toHaveAttribute("href", "/issue/123");
  });
});
