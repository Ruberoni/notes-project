import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  ReactElement,
  useMemo,
} from "react";
import { appContextReducer, State, Action } from "./reducer";

type Dispatch = (action: Action) => void;
type ContextType = { state: State; dispatch: Dispatch };
const Context = createContext<ContextType | undefined>(undefined);

/**
 * A wrapper of Context.Provider to encapsulate context logic.
 */
export function AppContextProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const initialState = {
    userId: null,
    userName: null,
  };
  const [state, dispatch] = useReducer(appContextReducer, initialState);
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}
/**
 * Use this hook to easily get the context anywhere.
 * Can not use this context outside AppContextProvider.
 */
export function useAppContext(): ContextType {
  const context = useContext(Context);
  if (context === undefined)
    throw new Error("Cannot use useAppContext outside AppContextProvider.");
  return context;
}
