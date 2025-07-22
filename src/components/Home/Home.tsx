import React from "react";
import "./Home.css";

const Home: React.FC = () => (
  <div className="home-container">
    <section className="home-hero">
      <div className="home-hero-bg" />
      <div className="home-hero-content">
        <h1 className="home-title">
          <span role="img" aria-label="Kanban">
            🗂️
          </span>{" "}
          Kanban Style Issue Board
        </h1>
        <p className="home-subtitle">
          Organize, prioritize, and track your team's work visually.
          <br />
          <span className="home-highlight">
            Boost productivity with a beautiful, modern board.
          </span>
        </p>
        <ul className="home-features">
          <li>
            <span
              className="home-feature-icon"
              role="img"
              aria-label="workflow"
            >
              🔄
            </span>
            <strong>Visual Workflow:</strong> Drag & drop issues between
            columns.
          </li>
          <li>
            <span className="home-feature-icon" role="img" aria-label="undo">
              ⏪
            </span>
            <strong>Undo Support:</strong> Instant feedback, undo accidental
            moves.
          </li>
          <li>
            <span
              className="home-feature-icon"
              role="img"
              aria-label="customize"
            >
              🎨
            </span>
            <strong>Customizable:</strong> Add priorities, assignees, and more.
          </li>
          <li>
            <span
              className="home-feature-icon"
              role="img"
              aria-label="responsive"
            >
              📱
            </span>
            <strong>Modern Design:</strong> Clean, responsive, and easy to use.
          </li>
        </ul>
        <div className="home-cta">
          <a href="/board" className="home-cta-btn">
            <span role="img" aria-label="rocket">
              🚀
            </span>{" "}
            Get Started
          </a>
        </div>
      </div>
    </section>
    <footer className="home-footer">
      <span>Inspired by Jira. Built with React + TypeScript.</span>
    </footer>
  </div>
);

export default Home;
