import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";
import NoteItem from "./NoteItem";
import { INote } from "../types";
import { useNotesList } from "../hooks";

export interface NotesListProps extends Omit<BoxProps, "filter"> {
  notesList?: INote[];
  filter: string[]
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
 */
export default function NotesList(props: NotesListProps): JSX.Element {
  const [notesList, ] = useNotesList(props.filter);

  return (
    <Box className="hideScrollBar" h="100%" w="inherit" {...props}>
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
