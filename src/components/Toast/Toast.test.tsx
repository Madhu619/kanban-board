import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Toast from "./Toast";

describe("Toast component", () => {
  it("renders the message", () => {
    render(<Toast message="Test message" />);
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("renders the action button when actionLabel and onAction are provided", () => {
    const onAction = jest.fn();
    render(
      <Toast message="Undo this?" actionLabel="Undo" onAction={onAction} />
    );
    const button = screen.getByRole("button", { name: /undo/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onAction).toHaveBeenCalled();
  });

  it("applies the correct type class", () => {
    const { container } = render(<Toast message="Success!" type="success" />);
    expect(container.firstChild).toHaveClass("toast-success");
  });
});
