import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ReactElement,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { INote, ICategory } from "../types";
import { useAppContext } from "./AppContext";
import { useUserCategoriesQuery } from "../api/user";

export type ContextType = {
  currentNote?: INote;
  currentNoteData?: INote;
  prevNote?: INote;
  userCategories: ICategory[];
  notesList: INote[];
  setCurrentNote: React.Dispatch<React.SetStateAction<INote | undefined>>;
  changeCurrentNote: (to: INote | ((prev?: INote) => INote)) => void;
  setNotesList: React.Dispatch<React.SetStateAction<INote[]>>;
  updateCurrentNote: (modifiedCurrentNote: Partial<INote>) => boolean;
  setUserCategories: React.Dispatch<React.SetStateAction<ICategory[]>>;
  getUserCategories: () => void;
  deleteCurrentNote: () => void;
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

  const currentNoteData = useMemo(() => notesList.find(note => note.id === currentNote?.id), [currentNote?.id, notesList])

  const deleteCurrentNote = () => {
    setNotesList(notesList => notesList.filter(note => note.id !== currentNote?.id))
    setCurrentNote(undefined)
    setPrevNote(undefined)
  }

  /**
   * @todo
   * - Change name to updateNotesList or related
   */
  const updateCurrentNote: ContextType['updateCurrentNote'] = useCallback((modifiedNote): boolean => {
    let found = false;
    if (!modifiedNote.id) {
      // Is assumed that you want to update the current note
      modifiedNote.id = currentNote?.id
    }
    setNotesList((_notesList) => _notesList.map((note) => {
      if (note.id === modifiedNote.id) {
        found = true;
        return {
          ...note,
          ...modifiedNote,
        };
      }
      return note;
    }));
    return found;
  }, [currentNote?.id]);

  /**
   * Changes currentNote
   * @param to It can be a `note id`, `note` or the callback of setState. It will change to `note.id`
   */
  const changeCurrentNote = useCallback((to: INote | ((prev?: INote) => INote)) => {
    // let id = "";
    // let _to: ((prev?: INote) => INote) | INote | undefined;
    // if (typeof to === "string") {
    //   _to = notesList?.find((note) => note.id == to);
    //   // id = to;
    // } else if (typeof to !== 'function') {
    //   _to = notesList?.find((note) => note.id == to.id);
    //   // id = to.id;
    // } else {
    //   _to = to
    // } 

    //if (!_to && typeof to !== 'function') throw new Error(`Unable to change note. Invalid id: ${id}`);
    setPrevNote(currentNote);
    setCurrentNote(to);
  }, [currentNote]);

  const { state: appState } = useAppContext();

  const userCategoriesQuery = useUserCategoriesQuery(
    appState.userId as string,
    {
      skip: !appState.userId,
      onCompleted: (data) => {
        setUserCategories(data.getUserCategories);
      }
    }
  );

  function getUserCategories() {
    if (!appState.userId) return
    userCategoriesQuery.refetch({ userId: appState.userId }).then((res) => {
      setUserCategories(res.data.getUserCategories);
    });
  }

  useEffect(() => {
    if (!appState.userId) {
      setNotesList([]);
      setCurrentNote(undefined);
      setUserCategories([]);
    }
  }, [appState.userId]);

  const state = {
    currentNote,
    prevNote,
    notesList,
    setCurrentNote,
    getUserCategories,
    deleteCurrentNote
  };

  const contextValue = useMemo(() => {
    return {
      ...state,
      updateCurrentNote,
      setUserCategories,
      userCategories,
      changeCurrentNote,
      setNotesList,
      currentNoteData
    };
  }, [
    state,
    updateCurrentNote,
    setUserCategories,
    userCategories,
    changeCurrentNote,
    setNotesList,
    currentNoteData
  ]);

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
