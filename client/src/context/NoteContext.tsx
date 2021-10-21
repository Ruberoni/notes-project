import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ReactElement,
  useMemo,
  useEffect,
} from "react";
import { INote } from "../types";
import { useAppContext } from './AppContext'

export type ContextType = {
  currentNote?: INote;
  setCurrentNote: React.Dispatch<React.SetStateAction<INote | undefined>>;
  notesList: INote[];
  setNotesList: React.Dispatch<React.SetStateAction<INote[]>>;
  updateCurrentNote: (modifiedCurrentNote: INote) => void
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
  const updateCurrentNote = (modifiedCurrentNote: INote): void => {
    setNotesList((notesList) => {
      const notesListModified = notesList.map((note) => {
        if (note.id === currentNote?.id) {
          return modifiedCurrentNote;
        }
        return note;
      });
      setCurrentNote(modifiedCurrentNote);
      return notesListModified;
    });
  };
  // const currentNote: INote | undefined = undefined
  const value = useMemo(() => {
    return {
      notesList,
      setNotesList,
      currentNote,
      setCurrentNote,
      updateCurrentNote,
    };
  }, [notesList, setNotesList, currentNote, setCurrentNote, updateCurrentNote]);

  const { state } = useAppContext()
  useEffect(() => {
    if (!state.userId) {
      setNotesList([])
      setCurrentNote(undefined)
    }
  }, [state.userId])

  return <Context.Provider value={value}>{children}</Context.Provider>;
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
