import React from "react";
import { render, screen } from "@testing-library/react";
import DummyComponent from "./DummyComponent";

test("renders dummy component welcome message", () => {
  render(<DummyComponent />);
  expect(screen.getByText(/Welcome to the Kanban Board!/i)).toBeInTheDocument();
});
