export type userData = { userId: string; userName: string };
export type Action = { type: "LOGIN"; data: userData } | { type: "LOGOUT" };
export type State = {
  userId: string | null;
  userName: string | null;
};

export function appContextReducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOGIN": {
      return {
        ...state,
        userId: action.data.userId,
        userName: action.data.userName,
      };
    }
    case "LOGOUT": {
      return { ...state, userId: null, userName: null };
    }
  }
}
