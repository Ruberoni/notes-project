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
  handleSave: (arg0?: { done: boolean }) => void
  handleSaveOnChange: () => void
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
  const { updateCurrentNote, currentNote, setNotesList, setCurrentNote, prevNote } = useNoteContext();
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
      setBody(data.getNoteBody)
      // This conditional avoids the body of the MDEditor to be modified more than
      // one time by the server, as we only need one update by the server
      !currentNote?.body && updateCurrentNote({...currentNote, body: data.getNoteBody || ' '} as INote)
    },
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
    return utils.handleSaveOnChange()
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

    /**
     * Immediately saves the current state of the MDEditor to the server and context
     */
    handleSave: () => {
      if (!currentNote) return
      // Update note in context
      updateCurrentNote({...currentNote, body: body || ' '} as INote)
      // Update note in server
      updateNote({
        variables: {
          id: currentNote?.id as string,
          content: { title: currentNote?.title as string, body },
        },
      })
    },

    /**
     * Immediately saves the current state of the body of prevNote to the server and context\
     * This works when changing from one note to other
     */
    handleSaveOnChange: () => {
      if (!prevNote) return
      // Update note in context
      updateCurrentNote({...prevNote, body: body || ' '} as INote)
      // Update note in server
      updateNote({
        variables: {
          id: prevNote?.id as string,
          content: { title: prevNote?.title as string, body },
        },
      })
    }
  };

  return [currentNote, loading, utils];
}
