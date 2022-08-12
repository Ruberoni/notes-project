import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";
import NoteItem, { NoteItemSkeleton, NoteItemSkeletonProps } from "./NoteItem";
import { INote } from "../types";
import { useNotesList } from "../hooks";

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
export default function NotesList(props: BoxProps): JSX.Element {
  const [notesList, currentNote, loading, changeCurrentNote] = useNotesList();

  return (
    <Box h="100%" w="inherit" overflow='auto' {...props}>
      {loading && <NotesListSkeleton />}
      {notesList.map((noteP) => {
        const onClick = (event: React.MouseEvent | React.KeyboardEvent) => {
          // console.log("[Hook][useNoteItem][onClick] Changing to note:", noteP.id);
          if ("key" in event && event.key !== "Enter") return
          
          changeCurrentNote(notesList?.find((note) => note.id == noteP.id) as INote);
        };

        return <NoteItem
          isOpen={currentNote?.id === noteP.id}
          key={noteP.id}
          id={noteP.id}
          title={noteP.title}
          categories={noteP.categories}
          onClick={onClick}
        />
      })}
    </Box>
  );
}

export interface NotesListSkeletonProps {
  notes?: NoteItemSkeletonProps[]
}

export function NotesListSkeleton({ notes }: NotesListSkeletonProps): JSX.Element {
  const length = [1, 2, 3, 4, 6, 7, 8]

  return (
    <>
      {
        notes
          ? notes.map((note, i) => <NoteItemSkeleton key={i} {...note} />)
          : length.map((note, i) => <NoteItemSkeleton key={i} /> )
      }
    </>
  );
}
