import { TaskStatus } from "../types";

const generateMoreIssues = (issuesCount) => {
  const issues = [];
  const statuses = Object.values(TaskStatus);
  const priorities = ["high", "medium", "low"];

  for (let i = 1; i <= issuesCount; i++) {
    issues.push({
      id: String(i),
      title: `Issue ${i}`,
      status: statuses[i % 3],
      assignee: `user${i % 5 === 0 ? 5 : i % 5}`, // Ensure some users are repeated
      severity: (i % 3) + 1,
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
      author: `author${i}`,
      priority: priorities[i % 3],
      userDefinedRank: i,
      priorityScore: 10 - (i % 10),
      description: `desc ${i}`,
    });
  }

  return issues;
};

export default generateMoreIssues;
