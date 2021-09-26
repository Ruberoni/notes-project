import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ReactElement,
  useMemo,
} from "react";
import { INote } from "../types";
import { notePreview } from '../utils/seed'

//   import reducer, { State, Action } from "./reducer";

//   type Dispatch = (action: Action) => void;
//   type ContextType = { state: State; dispatch: Dispatch };
export type ContextType = {
  currentNote?: INote;
  setCurrentNote: React.Dispatch<React.SetStateAction<INote | undefined>>
  // | ((a: (b?: INote) => INote | undefined) => void);
  notesList: INote[];
  setNotesList: React.Dispatch<React.SetStateAction<INote[]>>
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
  const [notesList, setNotesList] = useState<INote[]>(notePreview);
  const [currentNote, setCurrentNote] = useState<INote>();
  // const currentNote: INote | undefined = undefined
  const value = useMemo(() => {
    return { notesList, setNotesList, currentNote, setCurrentNote };
  }, [notesList, setNotesList, currentNote, setCurrentNote]);

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
