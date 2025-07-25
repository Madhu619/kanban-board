import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../constants/currentUser";
import WelcomeMessage from "./HomeComponents/WelcomeMessage";
import SubmitButton from "./HomeComponents/SubmitButton";
import boardIllustration from "./HomeComponents/kanban-illustration.svg";
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
          <WelcomeMessage />
          <div className="home-illustration">
            <img src={boardIllustration} alt="Kanban Board Illustration" />
          </div>
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
                autoComplete="off"
              />
              <SubmitButton type="submit">Enter</SubmitButton>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
