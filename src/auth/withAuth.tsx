import React from "react";
import { useNavigate } from "react-router-dom";
import { PAGE_PERMISSIONS } from "../types";
import { getUserRole } from "../utils/boardLogic";

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  page: string
) {
  return (props: P & { username?: string }) => {
    const navigate = useNavigate();
    const username =
      props.username || localStorage.getItem("kanban-username") || "guest";
    const role = getUserRole(username);
    const allowedRoles = PAGE_PERMISSIONS[page] || [];

    // Only check for 'admin' or 'contributor' roles
    const isAllowed = allowedRoles.includes(role as "admin" | "contributor");
    console.log(isAllowed, role, allowedRoles);
    React.useEffect(() => {
      if (!isAllowed) {
        navigate("/", { replace: true });
      }
    }, [isAllowed, navigate]);

    return isAllowed ? <WrappedComponent {...props} /> : null;
  };
}
