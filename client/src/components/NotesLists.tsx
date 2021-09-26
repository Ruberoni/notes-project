import React, { useState } from "react";
import {
  Box,
  useAccordion,
  AccordionDescendantsProvider,
  AccordionProvider,
  BoxProps
} from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import NoteItem from "./NoteItem";
// import { notePreview } from "../utils/seed";
import { GET_NOTES_PREVIEW } from "../utils/queries";
import { notePreview } from '../utils/seed'
import { INote } from "../types";
import { useNoteContext } from '../context'

/**
 * **Notes Listcomponent.**
 *
 *  This is a list of NotesItem implementing the accordion logic to limite to one
 *  item active at a time
 *
 * Features:
 * - Only one item can be active at a time
 * - Fetches the notes data
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
export default function NotesList(props: BoxProps): JSX.Element {
  const [notesData, setNotesData] = useState<INote[]>(notePreview)
  const { notesList } = useNoteContext()
  const { loading, data } = useQuery(GET_NOTES_PREVIEW, {
    variables: { id: "1" },
  });
  loading && console.log("Loading:", loading);
  console.log("data:", data);
  if (data) {
    setNotesData(data.getUserNotesPreview)
  }

  const { descendants, ...context } = useAccordion({ allowToggle: true });

  const ctx = React.useMemo(
    () => ({ ...context, reduceMotion: false }),
    [context]
  );

  // Fetch notes data
  // const notesPreviewData = notePreview;

  return (
    <AccordionDescendantsProvider value={descendants}>
      <AccordionProvider value={ctx}>
        <Box className="hideScrollBar" h="inherit" w="inherit" {...props}>
          {notesList.map((noteP) => (
            <NoteItem
              key={noteP.id}
              id={noteP.id}
              title={noteP.title}
              categories={noteP.categories}
            />
          ))}
        </Box>
      </AccordionProvider>
    </AccordionDescendantsProvider>
  );
}
