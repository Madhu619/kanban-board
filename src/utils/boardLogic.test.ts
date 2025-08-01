import { getAssignees, filterAndSortIssues, moveIssue } from "./boardLogic";
import { getUserRole } from "./boardHelper";

import { Task, TaskStatus } from "../types";

describe("boardLogic", () => {
  const issues: Task[] = [
    {
      id: "1",
      title: "Fix bug",
      status: TaskStatus.BACKLOG,
      assignee: "Samanvi",
      severity: 2,
      createdAt: new Date("2025-07-20T10:00:00Z"),
      updatedAt: new Date("2025-07-20T10:00:00Z"),
      author: "Sony",
      priority: "high",
      userDefinedRank: 1,
      priorityScore: 10,
      description: "",
    },
    {
      id: "2",
      title: "Add feature",
      status: TaskStatus.IN_PROGRESS,
      assignee: "Sony",
      severity: 3,
      createdAt: new Date("2025-07-21T10:00:00Z"),
      updatedAt: new Date("2025-07-21T10:00:00Z"),
      author: "Samanvi",
      priority: "medium",
      userDefinedRank: 2,
      priorityScore: 20,
      description: "",
    },
  ];

  it("getAssignees returns unique assignees", () => {
    expect(getAssignees(issues)).toEqual(["Samanvi", "Sony"]);
  });

  it("filterAndSortIssues filters by search and assignee", () => {
    const filtered = filterAndSortIssues(issues, "fix", "Samanvi", "ALL");
    expect(filtered.length).toBe(1);
    expect(filtered[0].title).toBe("Fix bug");
  });

  it("moveIssue changes the status of an issue", () => {
    const updated = moveIssue(issues, "1", TaskStatus.DONE);
    expect(updated.find((i) => i.id === "1")?.status).toBe(TaskStatus.DONE);
  });

  it("getUserRole returns correct role", () => {
    expect(getUserRole("madhu")).toBe("admin");
    expect(getUserRole("sony")).toBe("contributor");
    expect(getUserRole("unknown")).toBe("guest");
  });
});
