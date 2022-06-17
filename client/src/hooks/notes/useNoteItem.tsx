import { useState, useEffect } from 'react'
import { useNoteContext } from "../../context";
import { INote } from '../../types';

/**
 * Handles NoteItem component logic integrated with NoteContext
 * @logic
 * - Click or press enter the note updates the 'currentNote' in the ctx
 * - Know if the note is the 'currentNote' in the ctx, so the bg color in changed
 */
export default function useNoteItem(id: string): any {
  const { changeCurrentNote, notesList } = useNoteContext();
  // const [isOpen, setOpen] = useState(false)

  const onClick = (event: React.MouseEvent | React.KeyboardEvent) => {
    console.log("[Hook][useNoteItem][onClick] Changing to note:", id);
    if ("key" in event && event.key !== "Enter") return
    
    changeCurrentNote(notesList?.find((note) => note.id == id) as INote);
  };
  
  useEffect(() => {
    console.log('[Hook][useNoteItem] Render!')
  })

  // useEffect(() => {
  //   if(currentNote?.id == id) {
  //     setOpen(true)
  //   } else if (isOpen) {
  //     setOpen(false)
  //   }
  // }, [currentNote?.id])

  return [onClick];
}
