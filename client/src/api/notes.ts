import {
  GET_NOTES_PREVIEW,
  GET_NOTE_BODY,
  DELETE_CATEGORY_NOTE,
  UPDATE_NOTE,
  DELETE_NOTE
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

export function useNotesPreviewQuery(
  userId: string,
  extraOptions?: QueryHookOptions
): QueryResult {
  return useQuery(GET_NOTES_PREVIEW, {
    variables: { userId },
    ...extraOptions,
  });
}
const onError = (err: ApolloError) => {
  console.log("[Network error] error:", err);
};

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

interface categoryNote {
  categoryId: string;
  noteId: string;
}

export function useDeleteCategoryNoteMutation(
  extraOptions?: MutationHookOptions<
    { deleteCategoryNote: string },
    categoryNote
  >
): MutationTuple<{ deleteCategoryNote: string }, categoryNote> {
  return useMutation(DELETE_CATEGORY_NOTE, {
    onError,
    ...extraOptions,
  });
}

interface IUseUpdateNtoteMutationVariables {
  id: string,
  content: { title: string, body: string }
}

export function useUpdateNoteMutation(
  extraOptions?: MutationHookOptions<
  { updateNote: string },
  IUseUpdateNtoteMutationVariables
>): MutationTuple<{ updateNote: string }, IUseUpdateNtoteMutationVariables> {
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