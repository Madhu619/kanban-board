import React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar";

test("renders Kanban Board title", () => {
  render(<Navbar />);
  expect(screen.getByText(/Kanban Board/i)).toBeInTheDocument();
});
