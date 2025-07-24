import React from "react";
import { useNavigate } from "react-router-dom";
import { PAGE_PERMISSIONS } from "../types";
import { getUserRole } from "../utils/boardHelper";
import { useUser } from "../constants/currentUser";

/**
 *
 * @param WrappedComponent The component to wrap with authentication
 * @param page The page for which to check permissions
 * @returns A new component that checks user permissions before rendering
 * @author Madhusudhana RK
 * @date 2025-07-23
 */

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  page: string
) {
  return (props: P) => {
    const navigate = useNavigate();
    const { username } = useUser();
    const role = getUserRole(username || "guest");
    // Check if the user has permission to access this page
    const allowedRoles = PAGE_PERMISSIONS[page] || [];
    const isAllowed = allowedRoles.includes(role as "admin" | "contributor");

    React.useEffect(() => {
      if (!isAllowed) {
        navigate("/", { replace: true });
      }
    }, [isAllowed, navigate]);

    return isAllowed ? <WrappedComponent {...props} /> : null;
  };
}
