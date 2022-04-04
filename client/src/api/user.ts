import { GET_USER_CATEGORIES } from "../utils/queries";
import {
  useQuery,
  QueryHookOptions,
  ApolloError,
  QueryResult,
} from "@apollo/client";
import { ICategory } from "../types";

/**
 * Helpers
 */
const onError = (err: ApolloError) => {
  console.log("[Network error] error:", err);
};

export function useUserCategoriesQuery(
  userId: string,
  extraOptions?: QueryHookOptions<{getUserCategories: ICategory[]}, { userId: string }>
): QueryResult<{getUserCategories: ICategory[]}, { userId: string }> {
  return useQuery(GET_USER_CATEGORIES, {
    variables: { userId },
    ...extraOptions,
  });
}
