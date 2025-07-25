import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useUser } from "../../constants/currentUser";
import ThemeToggle from "./ThemeToggle";

const Navbar: React.FC = () => {
  const { username, setUsername } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    setUsername("");
    localStorage.removeItem("kanban-issues");
    localStorage.removeItem("kanban-recent-issues");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1 className="navbar-logo">Kanban Board</h1>
        <div className="navbar-links">
          <Link
            to="/"
            className={`navbar-link${
              location.pathname === "/" ? " active" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/board"
            className={`navbar-link${
              location.pathname.startsWith("/board") ? " active" : ""
            }`}
          >
            Board
          </Link>
          <ThemeToggle />
          {username && (
            <div className="navbar-user">
              <span className="navbar-avatar" title={username}>
                {username.charAt(0).toUpperCase()}
              </span>
              <span className="navbar-username">{username}</span>
              <button
                className="navbar-link navbar-logout"
                onClick={handleLogout}
                title="Logout"
              >
                <span role="img" aria-label="logout">
                  🔒
                </span>{" "}
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
