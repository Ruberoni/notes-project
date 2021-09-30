import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";
import NoteItem from "./NoteItem";
import { INote } from "../types";
import { useNotesList } from "../hooks";

export interface NotesListProps extends BoxProps {
  notesList?: INote[];
}

/**
 * **Notes List component.**
 *
 *  This is a list of NotesItem implementing the accordion logic to limite to one
 *  item active at a time
 *
 * Features:
 * - Only one item can be active at a time
 *
 * @todo
 * - Scrollable notes [X]
 * - Only one item can be active at a time using *Implement_accordion_logic* [X]
 */
export default function NotesList(props: NotesListProps): JSX.Element {
  const [notesList, loading] = useNotesList();

  return (
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
  );
}
