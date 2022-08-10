import { useState, useEffect } from "react";
import { useNoteContext, useAppContext, INoteContextType } from "../../context";
import { INote, ICategory } from "../../types";
import { useNotesPreviewQuery } from "../../api/notes"
import { useLateralSectionContext } from "../../components/LateralSection";

/**
 * Handles fetching the notes.
 */
export default function useNotesList(): [INote[], INote | undefined, boolean, INoteContextType['changeCurrentNote']] {
  const appContext = useAppContext();
  const { setNotesList, notesList, currentNote, changeCurrentNote } = useNoteContext();
  const { filter, searchQuery } = useLateralSectionContext()
  const [loading, setLoading] = useState(false)

  const includesCategory = (cat: ICategory, idsList: string[]) => {
    return idsList.indexOf(cat.id) !== -1;
  };

  const [filteredNotesList, setFilteredNotesList] = useState(notesList)
  useEffect(() => {
    setFilteredNotesList(notesList)
  }, [notesList])

  useEffect(() => {
    let filteredNotesList = notesList
    if (searchQuery) {
      const searchQueries = searchQuery.trim().toLocaleLowerCase().split(" ")
      filteredNotesList = notesList.filter(note => searchQueries.some(query => note.title.toLocaleLowerCase().includes(query)))
    }
    if (filter[0]) {
      filteredNotesList = filteredNotesList.filter(note => note.categories.some(cat => includesCategory(cat, filter)))
    } 
    setFilteredNotesList(filteredNotesList)
  }, [filter, notesList, searchQuery])

  const notesPreviewQuery = useNotesPreviewQuery(appContext.state.userId as string, {
    onCompleted: (data) => {
      setNotesList(data?.getUserNotesPreview || [])
    },
    skip: !appContext.state.userId || !!notesList[0],
    fetchPolicy: "network-only"
  })

  // This executes a 2nd render
  useEffect(() => {
    setLoading(notesPreviewQuery.loading);
  }, [notesPreviewQuery.loading]);

  return [filteredNotesList, currentNote, loading, changeCurrentNote];
}
