import { useState, useEffect } from "react";
import { useNoteContext, useAppContext } from "../../context";
import { INote, ICategory } from "../../types";
import { useNotesPreviewQuery } from "../../api/notes"

export interface useNotesListProps {
  filter: string[]
}

/**
 * Handles fetching the notes.
 */
export default function useNotesList(filter: string[]): [INote[], boolean] {
  const appContext = useAppContext();
  const { setNotesList, notesList } = useNoteContext();
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
  }, [filter])

  const notesPreviewQuery = useNotesPreviewQuery(appContext.state.userId as string, {
    onCompleted: (data) => {
      setNotesList(data?.getUserNotesPreview || [])
    }
  })

  useEffect(() => {
    if (appContext.state.userId) {
      notesPreviewQuery.refetch()
    }
  }, [appContext.state.userId]);

  // This executes a 2nd render
  useEffect(() => {
    setLoading(notesPreviewQuery.loading);
  }, [notesPreviewQuery.loading]);

  useEffect(() => {
    console.log('[Hook][useNotesList] Render!')
  })

  return [filteredNotesList, loading];
}
