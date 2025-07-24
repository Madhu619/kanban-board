import { getPersistedIssues, persistIssues } from "./boardHelper";
import issuesData from "../data/issues.json";

describe("boardHelper", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return issues from localStorage if present", () => {
    const issues = [
      {
        id: "1",
        title: "Test",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem("kanban-issues", JSON.stringify(issues));
    const result = getPersistedIssues();
    expect(result[0].id).toBe("1");
    expect(result[0].title).toBe("Test");
  });

  it("should return issues from issuesData if localStorage is empty (positive)", () => {
    const result = getPersistedIssues();
    expect(result.length).toBe(issuesData.length);
    expect(result[0].id).toBe(issuesData[0].id);
  });

  it("should not return an issue with a non-existent id (negative)", () => {
    const result = getPersistedIssues();
    const nonExistent = result.find((i) => i.id === "non-existent-id");
    expect(nonExistent).toBeUndefined();
  });

  it("should persist issues to localStorage", () => {
    const issues = [
      {
        id: "2",
        title: "Persisted",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    persistIssues(issues as any);
    const stored = JSON.parse(localStorage.getItem("kanban-issues")!);
    expect(stored[0].id).toBe("2");
    expect(stored[0].title).toBe("Persisted");
  });
});
