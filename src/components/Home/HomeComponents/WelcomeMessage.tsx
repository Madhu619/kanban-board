import React from "react";
import "./WelcomeMessage.css";

const WelcomeMessage: React.FC = () => (
  <div className="welcome-message">
    <h2>Welcome to Kanban Board!</h2>
    <p>
      Organize your work, track progress, and collaborate with your team
      efficiently.
    </p>
  </div>
);

export default WelcomeMessage;
