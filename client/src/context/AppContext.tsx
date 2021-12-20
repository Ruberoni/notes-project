import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  ReactElement,
  useMemo,
  useEffect,
} from "react";
import { appContextReducer, State, Action, IUserData } from "./reducer";
import { customUseGoogleLogout } from "../hooks";
import { useAuth0 } from "@auth0/auth0-react";
import { useApolloClient } from "@apollo/client";
import jwt from "jsonwebtoken";
export interface IAuthActions {
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

type Dispatch = (action: Action) => void;
interface IAppContext {
  state: State;
  // dispatch: Dispatch;
  auth: IAuthActions;
}
const Context = createContext<IAppContext | undefined>(undefined);

/**
 * A wrapper of Context.Provider to encapsulate context logic.
 */
export function AppContextProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const { user, loginWithRedirect, logout: Auth0Logout } = useAuth0();
  // const initialState = {
  //   userId: user?.sub || null,
  //   userName: user?.given_name || null,
  // };
  // const [state, dispatch] = useReducer(appContextReducer, initialState);

  const apolloClient = useApolloClient();
  const [error, { signOut: googleLogout }] = customUseGoogleLogout();
  if (error) return error;

  /**
   * Logs in with a token
   * 1. Verifies and decodes token
   * 2. Sets token to localStorage
   * 3. Set context state with token payload data
   */
  const login: IAuthActions["login"] = async () => {
    /* jwt.verify(token, process.env.token || "SECRET", (err, payload) => {
      if (err || !payload) return err
      const userData: IUserData = {
        userId: String(payload?.userId),
        userName: payload?.userName
      }

      localStorage.setItem('userToken', token)
      dispatch({ type: "LOGIN", data: userData });
    }) */
    console.log("Login")
    loginWithRedirect();
    // const userData: IUserData = {
    //   userId: user?.sub as string,
    //   userName: user?.given_name as string,
    // };
    // dispatch({ type: "LOGIN", data: userData });
  };

  const logout = async () => {
    await apolloClient.clearStore();
    googleLogout?.();
    Auth0Logout({
      returnTo: window.location.origin,
    });
    // localStorage.removeItem('userToken')
    // dispatch({ type: "LOGOUT" });
  };

  const auth: IAuthActions = {
    login,
    logout,
  };

  /**
   * When app is first open, it will check the localStorage
   * and login if needed
   */
  // useEffect(() => {
  //   const token = localStorage.getItem('userToken')
  //   if (token) login(token)
  // }, [])

  const contextValue = useMemo(() => {
    return {
      state: { userId: user?.sub || null, userName: user?.given_name || null },
      auth,
    };
  }, [user, auth]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}
/**
 * Use this hook to easily get the context anywhere.
 * Can not use this context outside AppContextProvider.
 */
export function useAppContext(): IAppContext {
  const context = useContext(Context);
  if (context === undefined)
    throw new Error("Cannot use useAppContext outside AppContextProvider.");
  return context;
}
