import { useEffect, useState, BaseSyntheticEvent } from "react";
import { useMutation, ApolloError } from "@apollo/client";
import { useNoteContext } from "../../context";
import {
  UPDATE_NOTE,
  DELETE_NOTE
} from "../../utils/queries";
import { INote } from "../../types";
import { NoteContentProps } from "../../components/NoteContent";
import SavingTimer from "../../utils/SavingTimer";
import { useNoteBodyQuery, useDeleteCategoryNoteMutation } from "../../api/notes"; 

export interface useNoteContentProps {
  title: NoteContentProps["title"];
  body: NoteContentProps["body"];
  categories: NoteContentProps["categories"];
}
export interface utils {
  handleCategoryRemove: (categoryId: string) => void;
  handleBodyChange: (event: BaseSyntheticEvent) => void;
  handleAddCategoryNote: () => void;
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
  const onError = (err: ApolloError) => {
    console.log("[Network error] error:", err);
  };

  const noteBodyQuery = useNoteBodyQuery(currentNote?.id as string, {
    onCompleted: (data) => {
      setBody(data.getNoteBody)
    }
  })

  const [deleteCategoryNote] = useDeleteCategoryNoteMutation({
    onCompleted: () => {
      console.log('Deleted category note')
    }
  })

  const [updateNote, ] = useMutation(UPDATE_NOTE, {
    onError,
  });
  const [deleteNote, ] = useMutation(DELETE_NOTE, {
    onError,
  });

  const updateNoteWrapper = () => {
    const _updateNote = () => {
      updateNote({
      variables: { id: currentNote?.id, content: { title: currentNote?.title, body } },
    }).then(() => {
      console.log(
        "[Hook][useNoteContent][updateNoteWrapper] updated note"
      );
    });}
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
    handleBodyChange: (event) => {
      console.log(
        "[Hook][useNoteContent][handleBodyChange]"
      );
      const body = event.target.value;
      setBody(body);
      updateNoteWrapper()
      
    },

    handleTitleChange: (event) => {
      if (!currentNote) return;
      console.log("[Hook][useNoteContent][handleTitleChange]");
      const title = event.target.value;
      updateCurrentNote({
        ...currentNote,
        title,
      });
      updateNoteWrapper()
    },

    handleCategoryRemove: (id) => {
      console.log("[Hook][useNoteContent][handleCategoryRemove] id:", id);
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

    handleAddCategoryNote: () => {
      console.log("[Hook][useNoteContent][handleAddCategoryNote]");
    },


    handleDeleteNote: () => {
      console.log("[Hook][useNoteContent][handleDeleteNote] Deleting note");
      setNotesList(notesList => notesList.filter(note => note.id !== currentNote?.id))
      setCurrentNote(undefined)
      deleteNote({
        variables: { id: currentNote?.id },
      }).then(() => {
        console.log(
          "[Hook][useNoteContent][handleDeleteNote][deleteNote] Note deleted"
        );
      });
    },
  };

  return [currentNote && { ...currentNote, body }, loading, utils];
}
