import { AuthChecker, ResolverData } from "type-graphql";
import jwt from "jsonwebtoken";
import { getBearerValue } from "../utils";

const authChecker: AuthChecker<{ headers: any }> = async ({
  context,
}: ResolverData<{ headers: any }>) => {
  const token = getBearerValue(context.headers.authorization) as string;
  try {
    jwt.verify(token, process.env.token || "SECRET")
  } catch (error) {
    return false;
  }
  return true;
};

export default authChecker;
