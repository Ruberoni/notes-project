import { useEffect, useCallback, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { useNoteContext } from "../../context";
import { GET_NOTE_BODY } from "../../utils/queries";
import { INote } from "../../types";

/**
 * Handles retrieving the note body correctly and caching it (caching not implemented)
 * @logic
 * When noteContext.currentNote does change, this hook will try to 
 * get the noteBody df noteContext.currentNote.
 * Actually noteContext.currentNote changes when a NoteItem is clicked
 * @see useNoteItem component
 * 
 * @todo
 * - handle category remove
 * - handle category add
 * - handle body change
 */
export default function useNoteContent(): [Partial<INote>, boolean] {
  const [body, setBody] = useState<string>("");
  // const [_loading, setLoading] = useState(false)
  const noteContext = useNoteContext();
  const currentNote = noteContext.currentNote;

  const [getNoteBody, { data, loading }] = useLazyQuery(GET_NOTE_BODY);
  if (data) {
    setBody(data.getNoteBody);
    /* if (currentNote) {
        currentNote.body = data.getNoteBody
      } */
    // cache body
  }

  /**
   * To implement
   */
  const getBodyCached = (note?: string) => {
    return false;
  };

  useEffect(() => {
    const isBodyCached = getBodyCached(currentNote?.id);
    if (!isBodyCached) {
      getNoteBody({
        variables: {
          id: currentNote?.id,
        },
      });
      console.log(
        "[Hook][useNoteContent] Trying to fetch GET_NOTE_BODY for note:",
        currentNote?.id
      );
    }
  }, [currentNote]);

  return [{ ...currentNote, body }, loading];
}
