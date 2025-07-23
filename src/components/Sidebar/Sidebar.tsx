import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

export type RecentIssue = {
  id: string;
  title: string;
};

const Sidebar: React.FC = () => {
  // Removed useLocation, not needed
  const user = localStorage.getItem("kanban-username");
  const [recentIssues, setRecentIssues] = useState<RecentIssue[]>(() => {
    const stored = localStorage.getItem("kanban-recent-issues");
    return stored ? JSON.parse(stored) : [];
  });

  // Removed useEffect for pathname updates, no longer needed

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "kanban-recent-issues") {
        setRecentIssues(e.newValue ? JSON.parse(e.newValue) : []);
      }
    };
    window.addEventListener("storage", handleStorage);
    // Also update on focus
    const updateRecent = () => {
      const stored = localStorage.getItem("kanban-recent-issues");
      setRecentIssues(stored ? JSON.parse(stored) : []);
    };
    window.addEventListener("focus", updateRecent);
    // Initial update
    updateRecent();
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", updateRecent);
    };
  }, []);

  if (!user) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <h3>Recent Issues</h3>
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
