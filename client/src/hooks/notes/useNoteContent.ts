import { useEffect, useState, BaseSyntheticEvent, useCallback, useMemo } from "react";
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
import useNotesSavingInterval from "../useNotesSavingInterval";

export interface useNoteContentProps {
  title: NoteContentProps["title"];
  body: NoteContentProps["body"];
  categories: NoteContentProps["categories"];
}
export interface INoteContentUtils {
  content: {
    handleBodyChange: RichTextEditor['props']['onChange'];
    handleSave: (arg0?: { done: boolean }) => void
  };
  header: {
    handleCategoryRemove: (categoryId: string) => void;
    handleTitleChange: (event: BaseSyntheticEvent) => void;
    handleDeleteNote: (event: BaseSyntheticEvent) => void;
  }
}

/**
 * Handles retrieving the note body correctly and caching it (caching not implemented)
 * @logic
 * @bug rapidly changing notes, sometimes sets the incorrect note body to a note
 * an idea to fix it is when the useNoteBodyQuery is called, the note body data is saved only in the context
 * then this hooks will handle getting that note body from the context
 */
export default function useNoteContent(): [INote | undefined, boolean, INoteContentUtils] {
  const {
    updateCurrentNote,
    currentNote,
    prevNote,
    deleteCurrentNote,
    notesList
  } = useNoteContext();
  const currentNoteData = useMemo(() => notesList.find(note => note.id === currentNote?.id), [currentNote?.id, notesList])
  const [body, setBody] = useState(currentNoteData?.body || RichTextEditor.createEmptyValue());
  const savingTimer = SavingTimer()
  // const savingTimer = useNotesSavingInterval()

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
      if (!currentNoteData?.body) {
        updateCurrentNote({
          // ...currentNote,
          body: RichTextEditor.createValueFromString(data.getNoteBody, 'markdown')
        } as INote)
        setBody(RichTextEditor.createValueFromString(data.getNoteBody, 'markdown'))
      } else {
        setBody(currentNoteData?.body)
      }
    },
    skip: !currentNote,
    
  })
  
  const [deleteCategoryNote] = useDeleteCategoryNoteMutation()
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation()

  const updateNoteWrapper = (note?: INote) => {
    if (!note || note.body?.toString('markdown') === currentNoteData?.body?.toString('markdown')) return
    console.log('[updateNoteWrapper]')
    const _updateNote = async () => {
      console.log('[updateNoteWrapper] body:', note.body?.toString('markdown'))
      // console.log('[updateNoteWrapper] body:', body.toString('markdown'))
      // console.log('[updateNoteWrapper] currentNoteData?.title:', currentNoteData?.title)
      await updateNote({
        variables: {
          id: note?.id as string,
          content: { title: note.title, body: note.body?.toString('markdown') as string },
        },
      })
      // console.log("COOOMPLETED")
      updateCurrentNote(note)
    }
    savingTimer.setToExecute(_updateNote)
  }

  /**
   * IS NOT BEING USED because of the bugs
   * Immediately saves the current state of the body of prevNote to the server and context\
   * This works when changing from one note to other
   * Consideraciones:
   * - Tengo que ejecutar esto cuando cambio de nota
   * - Esta funcion tiene que tener siempre el body actualizado
   * - No tengo que ejecutarla cada vez que cambio el body 
   * Tal vez un useEffect  no es lugar donde ejecutarlo
   */
  // const handleSaveOnChange = useCallback(() => {
  //   console.log("[handleSaveOnChange]")
  //   if (!currentNoteData) return; // Update note in context

  //   updateCurrentNote({ ...currentNoteData, body } as INote); // Update note in server

  //   updateNote({
  //     variables: {
  //       id: currentNoteData?.id as string,
  //       content: {
  //         title: currentNoteData?.title as string,
  //         body: body.toString("markdown"),
  //       },
  //     },
  //   });
  // }, [body, currentNoteData, updateCurrentNote, updateNote]);

  useEffect(() => {
    console.log('useEffect')
    if (currentNoteData?.body) {
      console.log('useEffect dentro')
      setBody(currentNoteData?.body)
    }
    return () => savingTimer.finishPending()
  }, [currentNote?.id]);

  // useEffect(() => { 
  //   return handleSaveOnChange
  // }, [currentNote?.id, handleSaveOnChange])
  
  const utils: INoteContentUtils = {
    content: {
      handleBodyChange: (editorValue) => {
        console.log('[handleBodyChange] editorValue:', editorValue.toString('markdown'))
        setBody(editorValue);
        updateNoteWrapper(currentNoteData && {...currentNoteData, body: editorValue})
      },
      /**
       * IS NOT BEING USED!!
       * Immediately saves the current state of the MDEditor to the server and context
       */
      handleSave: () => {
        if (!currentNote) return
        // Update note in context
        updateCurrentNote({ body } as INote)
        // Update note in server
        updateNote({
          variables: {
            id: currentNote?.id as string,
            content: { title: currentNoteData?.title as string, body: body.toString('markdown') },
          },
        })
      },
    },
    header: {
      handleTitleChange: (event) => {
        if (!currentNote) return;
        const title = event.target.value;
        updateCurrentNote({
          title,
        });
        updateNoteWrapper(currentNoteData && {...currentNoteData, body})
      },
  
      handleCategoryRemove: useCallback((id) => {
        if (!currentNote?.id) return;
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
          categories: categoriesModified,
        });
      }, [currentNote?.id, currentNoteData?.categories, deleteCategoryNote, updateCurrentNote]),
  
      handleDeleteNote: useCallback(() => {
        deleteCurrentNote()
        deleteNote({
          variables: { id: currentNote?.id as string },
        })
      }, [currentNote?.id, deleteCurrentNote, deleteNote]),
    }
  };
  
  return [currentNoteData && {...currentNoteData, body}, noteBodyQuery.loading, utils];
}
