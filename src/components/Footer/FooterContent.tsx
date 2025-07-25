import React from "react";
import "./FooterContent.css";

const FooterContent: React.FC = () => (
  <footer className="footer footer-content">
    <div className="footer-links">
      <a href="/" className="footer-link">
        Home
      </a>
      <a href="/board" className="footer-link">
        Board
      </a>
      <a
        href="https://github.com/Madhu619/kanban-board"
        className="footer-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </a>
    </div>
    <div className="footer-bottom-row">
      <div className="footer-copy">
        &copy; {new Date().getFullYear()} Kanban Board. All rights reserved.
      </div>
      <div className="footer-prefer">
        Design & Developed By :{" "}
        <a
          rel="noreferrer"
          target="_blank"
          href="https://linkedin.com/in/madhu619"
        >
          Madhusudhana RK
        </a>
      </div>
    </div>
  </footer>
);

export default FooterContent;
