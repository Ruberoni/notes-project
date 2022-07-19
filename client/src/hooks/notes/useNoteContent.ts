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
import RichTextEditor from 'react-rte';

export interface useNoteContentProps {
  title: NoteContentProps["title"];
  body: NoteContentProps["body"];
  categories: NoteContentProps["categories"];
}
export interface utils {
  handleCategoryRemove: (categoryId: string) => void;
  handleBodyChange: RichTextEditor['props']['onChange'];
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
  const {
    updateCurrentNote,
    currentNote,
    prevNote,
    deleteCurrentNote,
  } = useNoteContext();
  const [body, setBody] = useState(currentNote?.body || RichTextEditor.createEmptyValue());
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

  const noteBodyQuery = useNoteBodyQuery(currentNote?.id as string, {
    onCompleted: (data) => {
      if (!currentNote?.body) {
        updateCurrentNote({
          ...currentNote,
          body: RichTextEditor.createValueFromString(data.getNoteBody, 'markdown')
        } as INote)
        setBody(RichTextEditor.createValueFromString(data.getNoteBody, 'markdown'))
      } else {
        setBody(currentNote?.body)
      }
    },
    skip: !currentNote,
    
  })
  
  const [deleteCategoryNote] = useDeleteCategoryNoteMutation()
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation()

  const updateNoteWrapper = () => {
    const _updateNote = () => {
      updateNote({
        variables: {
          id: currentNote?.id as string,
          content: { title: currentNote?.title as string, body: body.toString('markdown') },
        },
        onCompleted: () => updateCurrentNote({...currentNote, body } as INote)
      })
    }
    savingTimer.setToExecute(_updateNote)
  }

  useEffect(() => {
    if (currentNote?.body) {
      setBody(currentNote?.body)
    }
    utils.handleSaveOnChange()
  }, [currentNote?.id]);


  const utils: utils = {
    handleBodyChange: (editorValue) => {
      setBody(editorValue);
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
      deleteCurrentNote()
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
      updateCurrentNote({...currentNote, body } as INote)
      // Update note in server
      updateNote({
        variables: {
          id: currentNote?.id as string,
          content: { title: currentNote?.title as string, body: body.toString('markdown') },
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
      updateCurrentNote({...prevNote, body} as INote)
      
      // Update note in server
      updateNote({
        variables: {
          id: prevNote?.id as string,
          content: { title: prevNote?.title as string, body: body.toString('markdown') },
        },
      })
    }
  };
  
  return [currentNote && {...currentNote, body}, noteBodyQuery.loading, utils];
}
