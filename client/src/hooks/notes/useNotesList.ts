import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { useNoteContext } from "../../context";
import { notePreview } from '../../utils/seed'
import { GET_NOTES_PREVIEW } from '../../utils/queries'
import { INote } from '../../types';

export interface useNotesListProps {
  notesList?: INote[]
}

/**
 * Handles fetching the notes.
 */
export default function useNotesList(): [INote[], boolean] {
  const { setNotesList, notesList } = useNoteContext();
  const [loading, setLoading] = useState(false)
  /* if (props.notesList) {
    setNotesList(props.notesList)
  } */
  const response = useQuery(GET_NOTES_PREVIEW, {
    variables: { id: "1" },
  });

  // This executes a 2nd render
  useEffect(() => {
    setLoading(response.loading)
  }, [response.loading])

  console.log("data:", response.data);
  if (response.data) {
    setNotesList(response.data.getUserNotesPreview)
  }
  
  return [notesList, loading];
}
