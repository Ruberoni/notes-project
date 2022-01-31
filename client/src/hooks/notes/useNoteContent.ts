import { useEffect, useState, BaseSyntheticEvent } from "react";
import { useNoteContext } from "../../context";
import { INote } from "../../types";
import { NoteContentProps } from "../../components/NoteContent";
import SavingTimer from "../../utils/SavingTimer";
import {
  useNoteBodyQuery,
  useDeleteCategoryNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation
} from "../../api/notes"; 

export interface useNoteContentProps {
  title: NoteContentProps["title"];
  body: NoteContentProps["body"];
  categories: NoteContentProps["categories"];
}
export interface utils {
  handleCategoryRemove: (categoryId: string) => void;
  handleBodyChange: (getBodyOrEvent: (() => string) | BaseSyntheticEvent) => void
  handleTitleChange: (event: BaseSyntheticEvent) => void;
  handleDeleteNote: (event: BaseSyntheticEvent) => void;
}

/**
 * Handles retrieving the note body correctly and caching it (caching not implemented)
 * @logic
 * When noteContext.currentNote does change, this hook will try to
 * get the noteBody df noteContext.currentNote.
 * Actually noteContext.currentNote changes when a NoteItem is clicked
 * @see useNoteItem component
 *
 */
export default function useNoteContent(): [INote | undefined, boolean, utils] {
  const { updateCurrentNote, currentNote, setNotesList, setCurrentNote } = useNoteContext();
  const [body, setBody] = useState("");
  const savingTimer = SavingTimer()
  
  useEffect(() => {
    const handlerBeforeUnload = (event: BeforeUnloadEvent) => {    
      if (savingTimer.isActive) {
        event.preventDefault();
        const confirm = "Are?"
        event.returnValue = confirm;
        return confirm
      }
    }
    window.addEventListener("beforeunload", handlerBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handlerBeforeUnload)
    }
  }, [savingTimer.isActive]);

  const [loading, ] = useState(false);

  const noteBodyQuery = useNoteBodyQuery(currentNote?.id as string, {
    onCompleted: (data) => {
      updateCurrentNote({...currentNote, body: data.getNoteBody || ' '} as INote)
    }
  })

  const [deleteCategoryNote] = useDeleteCategoryNoteMutation()
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation()

  const updateNoteWrapper = () => {
    const _updateNote = () => {
      updateNote({
        variables: {
          id: currentNote?.id as string,
          content: { title: currentNote?.title as string, body },
        },
      })
    }
    savingTimer.setToExecute(_updateNote)
  }

  useEffect(() => {
    if (currentNote) {
      noteBodyQuery.refetch({
        noteId: currentNote?.id,
      })
    }
  }, [currentNote?.id]);

  const utils: utils = {
    handleBodyChange: (getBodyOrEvent) => {
      if (typeof getBodyOrEvent == 'function') {
        setBody(getBodyOrEvent());
      } else {
        setBody(getBodyOrEvent.target.value)
      }
      updateNoteWrapper()
      
    },

    handleTitleChange: (event) => {
      if (!currentNote) return;
      const title = event.target.value;
      updateCurrentNote({
        ...currentNote,
        title,
      });
      updateNoteWrapper()
    },

    handleCategoryRemove: (id) => {
      if (!currentNote) return;
      // fetch
      deleteCategoryNote({
        variables: {
          categoryId: id,
          noteId: currentNote.id,
        },
      });
      const categoriesModified = currentNote.categories.filter(
        (cat) => cat.id !== id
      );
      // update context
      updateCurrentNote({
        ...currentNote,
        categories: categoriesModified,
      });
    },

    handleDeleteNote: () => {
      setNotesList(notesList => notesList.filter(note => note.id !== currentNote?.id))
      setCurrentNote(undefined)
      deleteNote({
        variables: { id: currentNote?.id as string },
      })
    },
  };

  return [currentNote, loading, utils];
}
