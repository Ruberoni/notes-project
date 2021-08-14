import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import CategoryTag from "../components/CategoryTag";

afterEach(cleanup);

it("Renders correctly without props passed", () => {
  render(<CategoryTag />);
  expect(screen.getByText("Label")).toBeInTheDocument();
});

it("Renders with the label passed in props", () => {
  render(<CategoryTag label="Different" />);
  expect(screen.getByText("Different")).toBeInTheDocument();
});
