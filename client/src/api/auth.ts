import { GOOGLE_LOGIN, REGISTER } from "../utils/queries";
import {
  useMutation,
  MutationHookOptions,
  ApolloError,
  MutationTuple,
} from "@apollo/client";

const onError = (err: ApolloError) => {
  console.log("[Network error] error:", err);
};

export function useGoogleLoginMutation(
  extraOptions?: MutationHookOptions<
    { googleLogin: string },
    { googleId: string }
  >
): MutationTuple<{ googleLogin: string }, { googleId: string }> {
  return useMutation(GOOGLE_LOGIN, {
    onError,
    ...extraOptions,
  });
}

export interface IRegisterMutationVars {
  userContent: {
    googleId?: string;
    email: string;
    name: string;
    oauthId?: string;
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
