import { Task, USER_ROLES } from "../types";
import issuesData from "../data/issues.json";
// use below for more issues
//import generateMoreIssues from "../data/generateMoreIssues";

// Get issues from localStorage or fallback to issuesData
export const getPersistedIssues = (): Task[] => {
  const local = localStorage.getItem("kanban-issues");
  if (local) {
    try {
      const parsed = JSON.parse(local);
      return parsed.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt || item.createdAt),
      }));
    } catch {
      console.error(
        "Failed to parse issues from localStorage, using default data."
      );
    }
  }

  // Let's fetch more data and test scalability - Madhu RK
  //const moreIssues = generateMoreIssues(1000);

  return (issuesData as any[]).map((item) => ({
    ...item,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt || item.createdAt),
  }));
};

// Persist issues to localStorage
export const persistIssues = (issues: Task[]) => {
  localStorage.setItem(
    "kanban-issues",
    JSON.stringify(
      issues.map((i) => ({
        ...i,
        createdAt:
          i.createdAt instanceof Date ? i.createdAt.toISOString() : i.createdAt,
        updatedAt:
          i.updatedAt instanceof Date ? i.updatedAt.toISOString() : i.updatedAt,
      }))
    )
  );
};

/**
 *
 * @param username current user's username
 * @returns User role based on predefined roles
 */
export function getUserRole(
  username: string
): "admin" | "contributor" | "guest" {
  return USER_ROLES[username?.toLowerCase()] || "guest";
}
