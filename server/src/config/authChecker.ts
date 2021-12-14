import { AuthChecker, ResolverData } from "type-graphql";
import jwt from "jsonwebtoken";
import { getBearerValue } from "../utils";

const authChecker: AuthChecker<{ headers: any }> = ({
  context,
}: ResolverData<{ headers: any }>) => {
  console.log("[authChecker] headers:", context.headers);
  const token = getBearerValue(context.headers.authorization) as string;
  jwt.verify(token, process.env.token || "SECRET", (err) => {
    if (err) {
      console.log("Error authenticating");
      return false;
    }
    return true;
  });

  return false;
};

export default authChecker;
