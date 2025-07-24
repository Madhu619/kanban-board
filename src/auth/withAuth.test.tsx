import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { withAuth } from "./withAuth";
import { PAGE_PERMISSIONS } from "../types";
import { getUserRole } from "../utils/boardHelper";
import { UserContext } from "../constants/currentUser";

jest.mock("../utils/boardHelper");

// Dummy component for testing
const Dummy = () => <div>Protected Content</div>;

describe("withAuth HOC", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it("renders wrapped component for allowed role", () => {
    (getUserRole as jest.Mock).mockReturnValue("admin");
    const Wrapped = withAuth(Dummy, "/board");
    PAGE_PERMISSIONS["/board"] = ["admin", "contributor"];
    render(
      <MemoryRouter>
        <UserContext.Provider
          value={{ username: "adminuser", setUsername: jest.fn() }}
        >
          <Wrapped />
        </UserContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Protected Content/i)).toBeInTheDocument();
  });

  it("redirects to home for disallowed role", () => {
    (getUserRole as jest.Mock).mockReturnValue("guest");
    const Wrapped = withAuth(Dummy, "/board");
    PAGE_PERMISSIONS["/board"] = ["admin", "contributor"];
    render(
      <MemoryRouter>
        <UserContext.Provider
          value={{ username: "guestuser", setUsername: jest.fn() }}
        >
          <Wrapped />
        </UserContext.Provider>
      </MemoryRouter>
    );
    expect(screen.queryByText(/Protected Content/i)).not.toBeInTheDocument();
  });
});
