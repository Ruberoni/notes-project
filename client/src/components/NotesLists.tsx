import React from "react";
import {
  Box,
  useAccordion,
  AccordionDescendantsProvider,
  AccordionProvider,
} from "@chakra-ui/react";

export interface NotesListProps {
  children: JSX.Element | JSX.Element[];
  [key: string]: any;
}

/**
 * **Notes Listcomponent.**
 *
 *  This is a list of NotesItem implementing the accordion logic to limite to one
 *  item active at a time
 *
 * Features:
 * - NO -- This is job of the lateral section -- Display Drawer when mobile device
 * - Only one item can be active at a time
 *
 * @todo
 * - Scrollable notes [X]
 * - Only one item can be active at a time using *Implement_accordion_logic* [X]
 *
 * @Implement_accordion_logic
 * 1. Initialize AccordionDescendantsProvider, AccordionProvider
 * 2. { descendants, ...context } = useAccordion()
 * 3. Memoize context
 * 4. Wrap 'children' in 'AccordionProvider' with value = ctx
 * 5. Wrap 'AccordionProvider' in 'AccordionDescendantsProvider' with value = descendants
 *
 */
export default function NotesList({
  children,
  ...props
}: NotesListProps): JSX.Element {
  const { descendants, ...context } = useAccordion({ allowToggle: true });

  const ctx = React.useMemo(
    () => ({ ...context, reduceMotion: false }),
    [context]
  );

  return (
    <AccordionDescendantsProvider value={descendants}>
      <AccordionProvider value={ctx}>
        <Box className="hideScrollBar" {...props}>
          {children}
        </Box>
      </AccordionProvider>
      )
    </AccordionDescendantsProvider>
  );
}
