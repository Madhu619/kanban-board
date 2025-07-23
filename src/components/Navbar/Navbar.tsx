import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("kanban-username");
    localStorage.removeItem("kanban-recent-issues");
    navigate("/");
  };
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1 className="navbar-logo">Kanban Board</h1>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          <Link to="/board" className="navbar-link">
            Board
          </Link>
          {localStorage.getItem("kanban-username") && (
            <button
              className="navbar-link navbar-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
