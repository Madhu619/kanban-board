import React, { createContext, useContext, useState } from "react";

export interface UserContextType {
  username: string;
  setUsername: (username: string) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [username, setUsernameState] = useState(() => {
    return localStorage.getItem("kanban-username") || "";
  });

  const setUsername = (name: string) => {
    setUsernameState(name);
    localStorage.setItem("kanban-username", name);
  };

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
