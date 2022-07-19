import { useState, useEffect } from "react";
import { useNoteContext, useAppContext } from "../../context";
import { INote, ICategory } from "../../types";
import { useNotesPreviewQuery } from "../../api/notes"
import { AnyPointerEvent } from "framer-motion/types/gestures/PanSession";

export interface useNotesListProps {
  filter: string[]
}

/**
 * Handles fetching the notes.
 */
export default function useNotesList(filter: string[]): [INote[], INote | undefined, boolean, any] {
  const appContext = useAppContext();
  const { setNotesList, notesList, currentNote, changeCurrentNote } = useNoteContext();
  const [loading, setLoading] = useState(false);

  const includesCategory = (cat: ICategory, idsList: string[]) => {
    return idsList.indexOf(cat.id) !== -1;
  };

  const [filteredNotesList, setFilteredNotesList] = useState(notesList)
  useEffect(() => {
    setFilteredNotesList(notesList)
  }, [notesList])

  useEffect(() => {
    if (filter[0]) {
      const _filteredNotesList = notesList.filter(note => note.categories.some(cat => includesCategory(cat, filter)))
      setFilteredNotesList(_filteredNotesList)
    } else {
      setFilteredNotesList(notesList)
    }
  }, [filter, notesList])

  const notesPreviewQuery = useNotesPreviewQuery(appContext.state.userId as string, {
    onCompleted: (data) => {
      setNotesList(data?.getUserNotesPreview || [])
    },
    skip: !appContext.state.userId
  })

  // This executes a 2nd render
  useEffect(() => {
    setLoading(notesPreviewQuery.loading);
  }, [notesPreviewQuery.loading]);

  return [filteredNotesList, currentNote, loading, changeCurrentNote];
}
