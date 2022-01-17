import { AuthChecker, ResolverData } from "type-graphql";

/**
 * Performs the validation for the resolvers with the `@Authorized` decorator.\
 * It could later work to authorize roles
 */
const authChecker: AuthChecker<{ request: any }> = async ({
  context,
}: ResolverData<{ request: any }>) => {
  if (!context.request.auth.isAuthenticated) return false

  return true
};

export default authChecker;
