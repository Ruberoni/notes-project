import { GET_NOTES_PREVIEW } from "../utils/queries";
import { useQuery, useMutation, QueryHookOptions, QueryResult } from "@apollo/client";

export function fetchNotesPreview(userId: string, extraOptions: QueryHookOptions): QueryResult {
  return useQuery(GET_NOTES_PREVIEW, {
    variables: { userId },
    skip: true,
    ...extraOptions
  });
}
