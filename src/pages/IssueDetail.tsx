import React, { useEffect, useState } from "react";
import { withAuth } from "../auth/withAuth";
import "./IssueDetail.css";
import { useParams, useNavigate } from "react-router-dom";
import { Task, TaskStatus, UserRoleEnum } from "../types";
import issuesData from "../data/issues.json";
import Toast from "../components/Toast/Toast";
import Sidebar from "../components/Sidebar/Sidebar";
import { getUserRole } from "../utils/boardLogic";

const IssueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const currentUsername = localStorage.getItem("kanban-username") || "guest";
  const role = getUserRole(currentUsername || "guest");
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Task | null>(null);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(
    null
  );

  useEffect(() => {
    const currentIssue = (issuesData as any[]).find((i) => i.id === id);
    if (!currentIssue) {
      setIssue(null);
      return;
    }
    // Convert dates and ensure all fields
    setIssue({
      ...currentIssue,
      createdAt: new Date(currentIssue.createdAt),
      updatedAt: currentIssue.updatedAt
        ? new Date(currentIssue.updatedAt)
        : new Date(currentIssue.createdAt),
    });
    // Remove current id from recent issues (so it's not shown while viewing)
    const stored = localStorage.getItem("kanban-recent-issues");
    let recent: { id: string; title: string }[] = stored
      ? JSON.parse(stored)
      : [];
    recent = recent.filter((i) => i.id !== currentIssue.id);
    console.log("Updated recent issues:", recent);
    localStorage.setItem(
      "kanban-recent-issues",
      JSON.stringify(recent.slice(0, 5))
    );

    // On unmount, add this issue to recent issues
    return () => {
      if (!currentIssue.id || !currentIssue.title) return;
      const stored = localStorage.getItem("kanban-recent-issues");
      let recent: { id: string; title: string }[] = stored
        ? JSON.parse(stored)
        : [];
      // Remove if already present
      recent = recent.filter((i) => i.id !== currentIssue.id);
      // Add to front
      recent.unshift({ id: currentIssue.id, title: currentIssue.title });
      // Limit to last 5
      if (recent.length > 6) recent = recent.slice(0, 6);
      localStorage.setItem("kanban-recent-issues", JSON.stringify(recent));
    };
  }, [id]);

  const handleMarkResolved = () => {
    if (!issue) return;
    setIssue({ ...issue, status: TaskStatus.DONE });
    setToast({ message: "Issue marked as resolved!", type: "success" });
    setTimeout(() => {
      setToast(null);
      navigate("/board");
    }, 1200);
  };

  if (!issue) return <div style={{ padding: 32 }}>Issue not found.</div>;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="issue-detail-card">
        <div className="issue-detail-header">
          <h2>{issue.title}</h2>
          <span className={`issue-status status-${issue.status.toLowerCase()}`}>
            {issue.status}
          </span>
        </div>
        <div className="issue-detail-body">
          <div className="issue-detail-section">
            <strong>Description:</strong>
            <div className="issue-detail-desc">{issue.description}</div>
          </div>
          <div className="issue-detail-section">
            <strong>Assignee:</strong>{" "}
            {typeof issue.assignee === "string"
              ? issue.assignee
              : issue.assignee?.name || "-"}
          </div>
          <div className="issue-detail-section">
            <strong>Author:</strong> {issue.author || "-"}
          </div>
          <div className="issue-detail-section">
            <strong>Severity:</strong> {issue.severity || "-"}
          </div>
          <div className="issue-detail-section">
            <strong>Priority:</strong> {issue.priority || "-"}
          </div>
          <div className="issue-detail-section">
            <strong>Priority Score:</strong> {issue.priorityScore ?? "-"}
          </div>
          <div className="issue-detail-section">
            <strong>Created At:</strong>{" "}
            {new Date(issue.createdAt).toLocaleString()}
          </div>
          <div className="issue-detail-section">
            <strong>Last Updated:</strong>{" "}
            {new Date(issue.updatedAt).toLocaleString()}
          </div>
        </div>
        {issue.status !== TaskStatus.DONE && role === UserRoleEnum.ADMIN && (
          <button
            className="issue-detail-resolve-btn"
            onClick={handleMarkResolved}
          >
            Mark as Resolved
          </button>
        )}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type as "success" | "error" | "info" | "warning"}
          />
        )}
      </div>
    </div>
  );
};

export default withAuth(IssueDetail, "/issue");
