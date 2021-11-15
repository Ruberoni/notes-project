import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useNoteContext, useAppContext } from "../../context";
// import { notePreview } from "../../utils/seed";
import { GET_NOTES_PREVIEW } from "../../utils/queries";
import { INote, ICategory } from "../../types";

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

  const getNotes = useQuery(GET_NOTES_PREVIEW, {
    variables: { userId: appContext.state.userId },
    skip: true,
  });

  useEffect(() => {
    if (appContext.state.userId) {
      getNotes.refetch().then((res) => {
        setNotesList(res.data.getUserNotesPreview);
      }).catch(err => {
        console.log('[Hook][useNotesList][getNotes] error:', err)
      });
    }
  }, [appContext.state.userId]);

  // This executes a 2nd render
  useEffect(() => {
    setLoading(getNotes.loading);
  }, [getNotes.loading]);

  useEffect(() => {
    console.log('[Hook][useNotesList] Render!')
  })

  console.log("data:", getNotes.data);
  /*
  if (getNotes.data) {
    setNotesList(getNotes.data.getUserNotesPreview)
  }*/

  return [filteredNotesList, loading];
}
