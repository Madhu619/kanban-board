const generateMoreIssues = (issuesCount) => {
  const issues = [];
  const statuses = Object.values(TaskStatus);
  const priorities = ["high", "medium", "low"];
  const assignees = ["user1", "user2", "user3", "user4", "user5"];
  for (let i = 1; i <= issuesCount; i++) {
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    issues.push({
      id: String(i),
      title: `Issue ${i}`,
      status,
      assignee: assignees[Math.floor(Math.random() * assignees.length)],
      severity: Math.ceil(Math.random() * 5),
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000
      ).toISOString(),
      author: `author${i}`,
      priority,
      userDefinedRank: i,
      priorityScore: 10 - (i % 10),
      description: ` This is the sample description for all the issues.\n      Update this for better visible and accessible content. \n      Keeping adding more content for the better view and accessibility ${i}`,
    });
  }
  // Shuffle issues for extra randomness
  for (let i = issues.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [issues[i], issues[j]] = [issues[j], issues[i]];
  }
  return issues;
};

export default generateMoreIssues;
