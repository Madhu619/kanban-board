import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

test("renders contributor name", () => {
  render(<Footer />);
  expect(screen.getByText(/Madhusudhana RK/i)).toBeInTheDocument();
});
