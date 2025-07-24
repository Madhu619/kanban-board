import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../constants/currentUser";
import "./Home.css";

const Home: React.FC = () => {
  const [input, setInput] = useState("");
  const { username, setUsername } = useUser();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setUsername(input.trim());
      navigate("/board");
    }
  };

  return (
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
              <strong>Customizable:</strong> Add priorities, assignees, and
              more.
            </li>
            <li>
              <span
                className="home-feature-icon"
                role="img"
                aria-label="responsive"
              >
                📱
              </span>
              <strong>Modern Design:</strong> Clean, responsive, and easy to
              use.
            </li>
          </ul>
          {!username && (
            <form onSubmit={handleSubmit} className="home-form">
              <label htmlFor="username" className="home-label">
                Enter your username:
              </label>
              <input
                id="username"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="home-input"
                placeholder="madhu, alice, bob, guest..."
              />
              <button type="submit" className="home-btn">
                Enter
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
