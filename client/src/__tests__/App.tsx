import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import App from "../App";

afterEach(cleanup);

it.skip("Renders the correct text", () => {
  render(<App />);
  expect(screen.getByText("Hola")).toBeInTheDocument();
});
