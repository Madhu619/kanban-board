import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BoardControls from "./BoardControls";
import { TaskStatus } from "../../types";

/**
 * Test cases for BoardControls Search, Sort and Filter
 * @author Madhusudhana RK
 */

describe("Test cases for BoardControls Search, Sort and Filter", () => {
  const defaultProps = {
    search: "",
    setSearch: jest.fn(),
    assignee: "ALL" as const,
    setAssignee: jest.fn(),
    sort: "score-high" as const,
    setSort: jest.fn(),
    statusColumns: [
      { key: TaskStatus.BACKLOG, label: "Backlog" },
      { key: TaskStatus.IN_PROGRESS, label: "In Progress" },
      { key: TaskStatus.DONE, label: "Done" },
    ],
    assignees: ["Madhu", "Sony"],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders search input, filter select, and sort button", () => {
    render(<BoardControls {...defaultProps} />);
    expect(screen.getByLabelText(/Search Issues/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filter by Assignee/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sort by Priority/i)).toBeInTheDocument();
  });

  it("calls setSearch on input change", () => {
    render(<BoardControls {...defaultProps} />);
    const input = screen.getByLabelText(/Search Issues/i);
    fireEvent.change(input, { target: { value: "bug" } });
    expect(defaultProps.setSearch).toHaveBeenCalledWith("bug");
  });

  it("calls setAssignee on select change", () => {
    render(<BoardControls {...defaultProps} />);
    const select = screen.getByLabelText(/Filter by Assignee/i);
    fireEvent.change(select, { target: { value: "Madhu" } });
    expect(defaultProps.setAssignee).toHaveBeenCalledWith("Madhu");
  });

  it("calls setSort on sort button click", () => {
    render(<BoardControls {...defaultProps} />);
    const button = screen.getByLabelText(/Sort by Priority/i);
    fireEvent.click(button);
    expect(defaultProps.setSort).toHaveBeenCalledWith("score-low");
  });

  it("shows correct sort label and arrow for score-high", () => {
    render(<BoardControls {...defaultProps} sort="score-high" />);
    expect(screen.getByText(/High → Low/i)).toBeInTheDocument();
    expect(screen.getByText("↑")).toBeInTheDocument();
  });

  it("shows correct sort label and arrow for score-low", () => {
    render(<BoardControls {...defaultProps} sort="score-low" />);
    expect(screen.getByText(/Low → High/i)).toBeInTheDocument();
    expect(screen.getByText("↓")).toBeInTheDocument();
  });

  it("renders all assignee options", () => {
    render(<BoardControls {...defaultProps} />);
    expect(
      screen.getByRole("option", { name: /All Assignees/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Madhu/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Sony/i })).toBeInTheDocument();
  });
});
