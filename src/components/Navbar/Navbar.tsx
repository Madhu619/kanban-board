import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useUser } from "../../constants/currentUser";

const Navbar: React.FC = () => {
  const { username, setUsername } = useUser();
  const navigate = useNavigate();
  const handleLogout = () => {
    setUsername("");
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
          {username && (
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
