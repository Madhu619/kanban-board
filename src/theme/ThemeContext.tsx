import React, { createContext, useContext, useEffect, useState } from "react";

enum Theme {
  Light = "light",
  Dark = "dark",
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("kanban-theme");
    return stored === "dark" ? Theme.Dark : Theme.Light;
  });

  useEffect(() => {
    document.body.classList.toggle("dark-theme", theme === Theme.Dark);
    localStorage.setItem("kanban-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === Theme.Light ? Theme.Dark : Theme.Light));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
