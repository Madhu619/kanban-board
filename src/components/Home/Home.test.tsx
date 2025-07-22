import { render, screen } from "@testing-library/react";
import Home from "./Home";

test("renders dummy component welcome message", () => {
  render(<Home />);
  expect(screen.getByText(/Welcome to the Kanban Board!/i)).toBeInTheDocument();
});
