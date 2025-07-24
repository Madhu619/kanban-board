import { render, screen, fireEvent } from "@testing-library/react";
import Home from "./Home";

describe("Home component", () => {
  it("renders welcome message", () => {
    render(<Home />);
    expect(
      screen.getByText(/Welcome to the Kanban Board!/i)
    ).toBeInTheDocument();
  });

  it("renders subtitle or description if present", () => {
    render(<Home />);
    expect(
      screen.queryByText(/get started|manage your tasks|organize/i)
    ).not.toBeNull();
  });

  it("renders a button or link to board if present", () => {
    render(<Home />);
    const boardLink = screen.queryByRole("link", { name: /board|kanban/i });
    const boardButton = screen.queryByRole("button", { name: /board|kanban/i });
    expect(boardLink || boardButton).not.toBeNull();
  });

  it("renders an input field and allows typing", () => {
    render(<Home />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "test user" } });
    expect((input as HTMLInputElement).value).toBe("test user");
  });
});
