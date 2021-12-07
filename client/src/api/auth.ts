import { GOOGLE_LOGIN, REGISTER } from "../utils/queries";
import {
  useMutation,
  MutationHookOptions,
  ApolloError,
  MutationTuple,
} from "@apollo/client";
import { IUser } from "../types";

const onError = (err: ApolloError) => {
  console.log("[Network error] error:", err);
};

export function useGoogleLoginMutation(
  extraOptions?: MutationHookOptions<
    { googleLogin: Partial<IUser> },
    { googleId: string }
  >
): MutationTuple<{ googleLogin: Partial<IUser> }, { googleId: string }> {
  return useMutation(GOOGLE_LOGIN, {
    onError,
    ...extraOptions,
  });
}

export interface IRegisterMutationVars {
  userContent: {
    googleId: string;
    email: string;
    name: string;
  }
}
export function useRegisterMutation(
  extraOptions?: MutationHookOptions<
    { register: string },
    IRegisterMutationVars
  >
): MutationTuple<{ register: string }, IRegisterMutationVars> {
  return useMutation(REGISTER, {
    onError,
    ...extraOptions,
  });
}
