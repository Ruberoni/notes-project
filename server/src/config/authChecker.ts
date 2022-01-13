import { AuthChecker, ResolverData } from "type-graphql";
import jwt from "jsonwebtoken";
import { getBearerValue } from "../utils";
import { request } from "http";

const authChecker: AuthChecker<{ request: any }> = async ({
  context,
}: ResolverData<{ request: any }>) => {
  if (!context.request.auth.isAuthenticated) return false

  return true
};

export default authChecker;
