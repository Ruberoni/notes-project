import {
  GET_NOTES_PREVIEW,
  GET_NOTE_BODY,
  DELETE_CATEGORY_NOTE,
  UPDATE_NOTE,
  DELETE_NOTE,
  CREATE_NOTE,
  ADD_CATEGORY_NOTE
} from "../utils/queries";
import {
  useQuery,
  useMutation,
  QueryHookOptions,
  MutationHookOptions,
  ApolloError,
  QueryResult,
  MutationTuple,
} from "@apollo/client";
import { INote } from "../types";

/**
 * Helpers 
 */
const onError = (err: ApolloError) => {
  console.log("[Network error] error:", err);
};

/**
 * Hooks 
 */
export function useNotesPreviewQuery(
  userId: string,
  extraOptions?: QueryHookOptions
): QueryResult<{getUserNotesPreview: INote[]}> {
  return useQuery(GET_NOTES_PREVIEW, {
    variables: { userId },
    ...extraOptions,
  });
}

export function useNoteBodyQuery(
  noteId: string,
  extraOptions?: QueryHookOptions
): QueryResult<{ getNoteBody: string }> {
  return useQuery(GET_NOTE_BODY, {
    variables: {
      noteId,
    },
    ...extraOptions,
  });
}
interface IDeleteCategoryNoteMutationVars {
  categoryId: string;
  noteId: string;
}

export function useDeleteCategoryNoteMutation(
  extraOptions?: MutationHookOptions<
    { deleteCategoryNote: string },
    IDeleteCategoryNoteMutationVars
  >
): MutationTuple<{ deleteCategoryNote: string }, IDeleteCategoryNoteMutationVars> {
  return useMutation(DELETE_CATEGORY_NOTE, {
    onError,
    ...extraOptions,
  });
}

interface IUpdateNoteMutationVars {
  id: string,
  content: { title: string, body: string }
}

export function useUpdateNoteMutation(
  extraOptions?: MutationHookOptions<
  { updateNote: string },
  IUpdateNoteMutationVars
>): MutationTuple<{ updateNote: string }, IUpdateNoteMutationVars> {
  return useMutation(UPDATE_NOTE, {
    onError,
    ...extraOptions,
  });
}

export function useDeleteNoteMutation(
  extraOptions?: MutationHookOptions<
  { deleteNote: string },
  {id: string}
>): MutationTuple<{ deleteNote: string }, {id: string}> {
  return useMutation(DELETE_NOTE, {
    onError,
    ...extraOptions,
  });
}

interface ICreateNoteMutationVars {
  userId: string,
  content: Partial<INote>
}
export function useCreateNoteMutation(
  extraOptions?: MutationHookOptions<
  { createNote: INote },
  ICreateNoteMutationVars
>): MutationTuple<{ createNote: INote }, ICreateNoteMutationVars> {
  return useMutation(CREATE_NOTE, {
    onError,
    ...extraOptions,
  });
}

interface IAddCategoryNoteMutationVars {
  categoryId: string;
  noteId: string;
}
export function useAddCategoryNoteMutation(
  extraOptions?: MutationHookOptions<
  { addCategoryNote: string },
  IAddCategoryNoteMutationVars
>): MutationTuple<{ addCategoryNote: string }, IAddCategoryNoteMutationVars> {
  return useMutation(ADD_CATEGORY_NOTE, {
    onError,
    ...extraOptions,
  });
}