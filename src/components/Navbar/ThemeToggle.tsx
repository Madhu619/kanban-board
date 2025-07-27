import React from "react";
import { useTheme } from "../../theme/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="toggle-theme-btn"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
};

export default ThemeToggle;
