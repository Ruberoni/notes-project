import { useNoteContext } from "../../context";

export default function useNoteItem(): any {
  const { setCurrentNote, notesList } = useNoteContext();

  // change this to receive only note id
  function handleNoteClick(noteData: any) {
    console.log("[Hook][useNoteItem] Changing noteData:", noteData);
    // noteContext.setCurrentNote(noteData)
    setCurrentNote(notesList?.find((note) => note.id == noteData.id));
  }
  return [handleNoteClick];
}
