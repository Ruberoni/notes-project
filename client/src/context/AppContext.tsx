import React, {
  createContext,
  useContext,
  ReactNode,
  ReactElement,
  useMemo,
  useEffect,
} from "react";
import { State } from "./reducer";
import { customUseGoogleLogout } from "../hooks";
import { useAuth0 } from "@auth0/auth0-react";
import { useApolloClient } from "@apollo/client";
import { useRegisterMutation } from "../api/auth";
export interface IAuthActions {
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

// type Dispatch = (action: Action) => void;
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
  const {
    user,
    loginWithRedirect,
    logout: auth0Logout,
    isAuthenticated,
  } = useAuth0();
  // const [state, dispatch] = useReducer(appContextReducer, initialState);

  const apolloClient = useApolloClient();
  const registerMutation = useRegisterMutation();
  const [error, { signOut: googleLogout }] = customUseGoogleLogout();
  if (error) return error;

  const login: IAuthActions["login"] = async () => {
    await loginWithRedirect();
  };

  const logout = async () => {
    await apolloClient.clearStore();
    googleLogout?.();
    auth0Logout({
      returnTo: window.location.origin,
    });
  };

  const auth: IAuthActions = {
    login,
    logout,
  };

  /**
   * At login, send an upsert to the database
   */
  useEffect(() => {
    if (user && isAuthenticated) {
      registerMutation[0]({
        variables: {
          userContent: {
            name: user.name as string,
            oauthId: user.sub as string,
            email: user.email as string,
          },
        },
      });
    }
  }, [user?.name]);

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
