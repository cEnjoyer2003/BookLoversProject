/*import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import RequireAuth from "../context/RequireAuth.js";
import ProfilePage from "../components/ProfilePage.js";

jest.mock("../components/ProfilePage.js", () => {
    return function MockMyProfile(props) {
      return (
        <div data-testid="my-profile">{Object.keys(props)}</div>
      );
    };
  });

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders my profile", () => {
  act(() => {
    render(<RequireAuth allowedRoles={["valid-user"]} />, container);
  });
  expect(container.textContent).toBe("[edit]");

});*/