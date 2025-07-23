// src/utils/boardLogic.ts
// Generic business logic for Kanban board filtering, searching, and sorting
import { Task, TaskStatus, TOAST_MAP, USER_ROLES } from "../types";

export function daysSinceCreated(date: Date): number {
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export function getRank(issue: Partial<Task>): number {
  return Number((issue as any).userDefinedRank ?? 0);
}

export function getAssignees(issues: Task[]): string[] {
  return Array.from(
    new Set(
      issues
        .map((i) => (typeof i.assignee === "string" ? i.assignee : ""))
        .filter((a): a is string => !!a)
    )
  );
}

export function getSeverities(issues: Task[]): number[] {
  return Array.from(
    new Set(
      issues
        .map((i) => (typeof i.severity === "number" ? i.severity : undefined))
        .filter((s): s is number => typeof s === "number")
    )
  );
}

export function filterAndSortIssues(
  issues: Task[],
  search: string,
  assignee: string | "ALL",
  severity: number | "ALL"
): Task[] {
  const searchText = search.trim().toLowerCase();
  return issues
    .filter((issue) => {
      const matchesTitle = issue.title.toLowerCase().includes(searchText);
      const matchesAssignee = assignee === "ALL" || issue.assignee === assignee;
      const matchesSeverity =
        severity === "ALL" ||
        (typeof issue.severity === "number" && issue.severity === severity);
      return matchesTitle && matchesAssignee && matchesSeverity;
    })
    .sort((a, b) => {
      const scoreA =
        (typeof a.severity === "number" ? a.severity : 1) * 10 +
        daysSinceCreated(a.createdAt) * -1 +
        getRank(a);
      const scoreB =
        (typeof b.severity === "number" ? b.severity : 1) * 10 +
        daysSinceCreated(b.createdAt) * -1 +
        getRank(b);
      if (scoreA !== scoreB) return scoreB - scoreA;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
}

export function moveIssue(
  issues: Task[],
  id: string,
  newStatus: TaskStatus,
  setPending?: (
    pending: {
      id: string;
      prevStatus: TaskStatus;
      newStatus: TaskStatus;
    } | null
  ) => void,
  setShowUndo?: (show: boolean) => void,
  setToast?: (toast: { message: string; type: string }) => void
): Task[] {
  const issue = issues.find((i) => i.id === id);
  if (!issue || issue.status === newStatus) return issues;
  if (setPending) setPending({ id, prevStatus: issue.status, newStatus });
  if (setShowUndo) setShowUndo(true);
  // Use mapping for toast
  if (setToast) {
    const toastData = TOAST_MAP[newStatus] || {
      message: "Issue moved!",
      type: "info",
    };
    setToast(toastData);
  }
  // Optimistically update
  return issues.map((item) =>
    item.id === id ? { ...item, status: newStatus } : item
  );
}

/**
 *
 * @param username current user's username
 * @returns User role based on predefined roles
 */
export function getUserRole(
  username: string
): "admin" | "contributor" | "guest" {
  console.log("Getting user role for:", username);
  return USER_ROLES[username?.toLowerCase()] || "guest";
}
