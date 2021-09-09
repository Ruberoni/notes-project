import React, { FC, ReactNode } from "react";
import {
  render,
  fireEvent,
  screen,
  cleanup,
  RenderOptions,
} from "@testing-library/react";
import {
  useAccordion,
  AccordionDescendantsProvider,
  AccordionProvider,
} from "@chakra-ui/react";
import NoteItem from "../components/NoteItem";

const AccordionProviders: FC = ({ children }: { children?: ReactNode }) => {
  const { descendants, ...context } = useAccordion({ allowToggle: true });

  const ctx = React.useMemo(
    () => ({ ...context, reduceMotion: false }),
    [context]
  );

  return (
    <AccordionDescendantsProvider value={descendants}>
      <AccordionProvider value={ctx}>{children}</AccordionProvider>)
    </AccordionDescendantsProvider>
  );
};
const customRender = (
  ui: JSX.Element,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AccordionProviders, ...options });

describe.skip("NoteItem", () => {
  afterEach(cleanup);
  it("Renders ok", () => {
    customRender(<NoteItem title="Sample" />);

    expect(screen.getByText("Sample")).toBeInTheDocument();
  });
  it.skip("Executes 'handleOnClick' prop. when clicked", () => {
    const handleClick = jest.fn();

    customRender(<NoteItem title="Sample" handleOnClick={handleClick} />);

    fireEvent.click(screen.getByText("Sample"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
