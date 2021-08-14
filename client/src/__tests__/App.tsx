import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import App from "../App";

afterEach(cleanup);

it("Renders the env variable", () => {
  render(<App />);
  expect(screen.getByText("sample")).toBeInTheDocument();
});
