import {
  DELETE_CATEGORY,
  CREATE_CATEGORY
} from "../utils/queries";
import {
  useMutation,
  MutationHookOptions,
  ApolloError,
  MutationTuple,
} from "@apollo/client";
import { ICategory } from "../types";

const onError = (err: ApolloError) => {
  console.log("[Network error] error:", err);
};

export function useDeleteCategoryMutation(
  extraOptions?: MutationHookOptions<
    { deleteCategory: string },
    {id: string}
  >
): MutationTuple<{ deleteCategory: string }, {id: string}> {
  return useMutation(DELETE_CATEGORY, {
    onError,
    ...extraOptions,
  });
}

interface ICreateCategoryMutationVars {
  userId: string,
  content: Partial<ICategory>
}
export function useCreateCategoryMutation(
  extraOptions?: MutationHookOptions<
    { createCategory: string },
    ICreateCategoryMutationVars
  >
): MutationTuple<{ createCategory: string }, ICreateCategoryMutationVars> {
  return useMutation(CREATE_CATEGORY, {
    onError,
    ...extraOptions,
  });
}
