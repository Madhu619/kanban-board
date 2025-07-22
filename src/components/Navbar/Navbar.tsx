import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => {
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
