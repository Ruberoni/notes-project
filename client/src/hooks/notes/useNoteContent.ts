import { useEffect, useState, BaseSyntheticEvent } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useNoteContext } from "../../context";
import {
  GET_NOTE_BODY,
  DELETE_CATEGORY_NOTE,
  UPDATE_NOTE,
  DELETE_NOTE
} from "../../utils/queries";
import { INote } from "../../types";
import { NoteContentProps } from "../../components/NoteContent";

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
 * @todo
 * - handle category add
 */
export default function useNoteContent(): [Partial<INote>, boolean, utils] {
  const { updateCurrentNote, currentNote, setNotesList, setCurrentNote } = useNoteContext();
  const [body, setBody] = useState("");
  const [title, setTitle] = useState(currentNote?.title || "");
  const [loading, setLoading] = useState(false);

  /*   if (props) {
    const _currentNote: INote | = {...currentNote}
    // loop through props. properties?
    let prop: keyof typeof props
    for (prop in props) {
      const _: any = props[prop]
      if (_) {
        _currentNote[prop] = _
    }
    }
    setCurrentNote(_currentNote)
  }
 */
  const onErrorDeleteCategoryNote = (err: any) => {
    console.log("[Network error] error:", err);
  };
  const getNoteBody = useQuery(GET_NOTE_BODY, {skip: true});
  const [deleteCategoryNote, resDeleteCategoryNote] = useMutation(
    DELETE_CATEGORY_NOTE,
    { onError: onErrorDeleteCategoryNote }
  );
  const [updateNote, resUpdateNote] = useMutation(UPDATE_NOTE, {
    onError: onErrorDeleteCategoryNote,
  });
  const [deleteNote, resDeleteNote] = useMutation(DELETE_NOTE, {
    onError: onErrorDeleteCategoryNote,
  });
  /*if (resGetNodeBody.data) {
    setBody(resGetNodeBody.data.getNoteBody);
    // cache body
  }*/
  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);

      const isBodyCached = getBodyCached(currentNote?.id);
      if (!isBodyCached) {
        console.log("[Hook][useNoteContent][useEffect] will call getNoteBody")
        getNoteBody.refetch({
            noteId: currentNote?.id,
        }).then(res => {
          setBody(res.data.getNoteBody)
        }).catch(error => {
        console.log("[Hook][useNoteContent][getNoteBody] error:", error)

        })
        /*
        console.log(
          "[Hook][useNoteContent] Trying to fetch GET_NOTE_BODY for note:",
          currentNote?.id
        ); */
      }
    }
  }, [currentNote?.id]);

  useEffect(() => {
    console.log("[Hook][useNoteContent] Render!")
    
  })

  /*useEffect(() => {
    setLoading(resGetNodeBody.loading || resDeleteCategoryNote.loading);
  }, [resGetNodeBody.loading, resDeleteCategoryNote.loading]);
  */

  const utils: utils = {
    handleBodyChange: (event) => {
      console.log(
        "[Hook][useNoteContent][handleBodyChange] updating body"
      );
      const body = event.target.value;
      setBody(body);
      updateNote({
        variables: { id: currentNote?.id, content: { title: currentNote?.title, body } },
      }).then(() => {
        console.log(
          "[Hook][useNoteContent][handleBodyChange][updateNote] updated body"
        );
      });
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

    handleTitleChange: (event) => {
      console.log("[Hook][useNoteContent][handleTitleChange]");
      const title = event.target.value;
      // setTitle(title);
      if (!currentNote) return;
      // set timer for fetching and updating context
      // fetch
      // update context
      updateCurrentNote({
        ...currentNote,
        title,
      });
      updateNote({
        variables: { id: currentNote?.id, content: { title, body } },
      }).then(() => {
        console.log(
          "[Hook][useNoteContent][handleTitleChange][updateNote] updated title"
        );
      });
    },

    handleDeleteNote: (event) => {
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

  /**
   * To implement
   */
  const getBodyCached = (note?: string) => {
    return false;
  };

 

  return [{ ...currentNote, body }, loading, utils];
}
