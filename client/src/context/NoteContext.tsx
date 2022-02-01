import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ReactElement,
  useMemo,
  useEffect,
} from "react";
import { INote, ICategory, Node } from "../types";
import { useAppContext } from "./AppContext";
import { useUserCategoriesQuery } from "../api/user";

export type ContextType = {
  currentNote?: INote;
  prevNote?: INote;
  userCategories: ICategory[];
  notesList: INote[];
  setCurrentNote: React.Dispatch<React.SetStateAction<INote | undefined>>;
  changeCurrentNote: (to: INote | Node["id"]) => void;
  setNotesList: React.Dispatch<React.SetStateAction<INote[]>>;
  updateCurrentNote: (modifiedCurrentNote: INote) => boolean;
  setUserCategories: React.Dispatch<React.SetStateAction<ICategory[]>>;
  getUserCategories: () => void;
};
const Context = createContext<ContextType | undefined>(undefined);

/**
 * A wrapper of Context.Provider to encapsulate context logic.
 */
export function NoteContextProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [notesList, setNotesList] = useState<INote[]>([]);
  const [currentNote, setCurrentNote] = useState<INote>();
  const [prevNote, setPrevNote] = useState<INote>();
  const [userCategories, setUserCategories] = useState<ICategory[]>([]);

  /**
   * @todo
   * - Change name to updateNotesList or related
   */
  const updateCurrentNote = (modifiedNote: INote): boolean => {
    let found = false;
    const notesListModified = notesList.map((note) => {
      if (note.id === modifiedNote.id) {
        found = true;
        if (note.id === currentNote?.id) {
          // If theres the case that the note to modify is the current note
          // update current note also
          setCurrentNote({
            ...currentNote,
            ...modifiedNote,
          });
        }
        return {
          ...note,
          ...modifiedNote,
        };
      }
      return note;
    });
    setNotesList(notesListModified);
    return found;
  };

  /**
   * Changes currentNote
   * @param to It can be a `note id` or a `note`. It will change to `note.id`
   */
  const changeCurrentNote = (to: INote | Node["id"]) => {
    let id = "";
    let _to: INote | undefined;
    if (typeof to === "string") {
      _to = notesList?.find((note) => note.id == to);
      id = to;
    } else {
      _to = notesList?.find((note) => note.id == to.id);
      id = to.id;
    }

    if (!_to) throw new Error(`Unable to change note. Invalid id: ${id}`);
    setPrevNote(currentNote);
    setCurrentNote(_to);
  };

  const { state: appState } = useAppContext();

  const userCategoriesQuery = useUserCategoriesQuery(
    appState.userId as string,
    { skip: true }
  );

  function getUserCategories() {
    userCategoriesQuery.refetch({ userId: appState.userId }).then((res) => {
      console.log("[NoteContext] userCategoriesData.data:", res.data);
      setUserCategories(res.data.getUserCategories);
    });
  }

  useEffect(() => {
    if (!appState.userId) {
      setNotesList([]);
      setCurrentNote(undefined);
      setUserCategories([]);
    } else {
      getUserCategories();
    }
  }, [appState.userId]);

  const state = {
    currentNote,
    prevNote,
    notesList,
    userCategories,
    setNotesList,
    setCurrentNote,
    changeCurrentNote,
    updateCurrentNote,
    setUserCategories,
    getUserCategories,
  };

  const contextValue = useMemo(() => {
    return state;
  }, [state]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}
/**
 * Use this hook to easily get the context anywhere.
 * Can not use this context outside NoteContextProvider.
 */
export function useNoteContext(): ContextType {
  const context = useContext(Context);
  if (context === undefined)
    throw new Error("Cannot use useNoteContext outside NoteContextProvider.");
  return context;
}
