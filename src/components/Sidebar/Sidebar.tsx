import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

export type RecentIssue = {
  id: string;
  title: string;
};

const Sidebar: React.FC = () => {
  const [recentIssues, setRecentIssues] = useState<RecentIssue[]>(() => {
    const stored = localStorage.getItem("kanban-recent-issues");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "kanban-recent-issues") {
        setRecentIssues(e.newValue ? JSON.parse(e.newValue) : []);
      }
    };
    window.addEventListener("storage", handleStorage);
    // Initial load
    const stored = localStorage.getItem("kanban-recent-issues");
    setRecentIssues(stored ? JSON.parse(stored) : []);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <h2>Recent Issues</h2>
        <ul>
          {recentIssues.length === 0 ? (
            <li className="sidebar-empty">No recent issues</li>
          ) : (
            recentIssues.map((issue) => (
              <li key={issue.id}>
                <Link to={`/issue/${issue.id}`}>{issue.title}</Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
