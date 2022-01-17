import { GET_USER_CATEGORIES } from "../utils/queries";
import {
  useQuery,
  QueryHookOptions,
  ApolloError,
  QueryResult,
} from "@apollo/client";

/**
 * Helpers
 */
const onError = (err: ApolloError) => {
  console.log("[Network error] error:", err);
};

export function useUserCategoriesQuery(
  userId: string,
  extraOptions?: QueryHookOptions
): QueryResult {
  return useQuery(GET_USER_CATEGORIES, {
    variables: { userId },
    ...extraOptions,
  });
}
