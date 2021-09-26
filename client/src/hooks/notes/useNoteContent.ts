import { useEffect, useCallback, useState, BaseSyntheticEvent } from "react";
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
export default function useNoteContent(): [Partial<INote>, boolean, any] {
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

  const handleBodyChange = (event: BaseSyntheticEvent) => {
    const body = event.target.value;
    setBody(body);
  };

  const handleCategoryRemove = (id: string) => {
    console.log("[Hook][useNoteContent][handleCategoryRemove] id:", id);
    // Fetch
    const _categories = currentNote?.categories.filter((cat) => cat.id !== id);
    // setCategories(_categories)
    if (currentNote && _categories) {
      currentNote.categories = _categories;
    }
    noteContext.setCurrentNote((currentNote?: INote) => {
      if (!currentNote) return currentNote;
      const _categories = currentNote.categories.filter((cat) => cat.id !== id);
      currentNote.categories = _categories;
      return currentNote;
    });
    noteContext.setNotesList(noteContext.notesList);
  };

  /**
   * To implement
   */
  const getBodyCached = (note?: string) => {
    return false;
  };

  useEffect(() => {
    if (currentNote) {
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
    }
  }, [currentNote?.id]);

  return [
    { ...currentNote, body },
    loading,
    { handleCategoryRemove, handleBodyChange },
  ];
}
