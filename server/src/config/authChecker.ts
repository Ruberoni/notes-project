import { AuthChecker, ResolverData } from "type-graphql";
import jwt from "jsonwebtoken";
import { getBearerValue } from "../utils";

const authChecker: AuthChecker<{ headers: any }> = async ({
  context,
}: ResolverData<{ headers: any }>) => {
  // const token = getBearerValue(context.headers.authorization) as string;
  // try {
  //   jwt.verify(token, process.env.token || "SECRET", {
  //     algorithms: ['RS256'],
  //     issuer: 'https://dev-ipdx4j09.us.auth0.com/',
  //     audience: '8d3d6a7b-a2f8-40dd-9233-f14c3115efe4',
      
  //   })
  // } catch (error) {
  //   return false;
  // }
  // return true;
  return true
};

export default authChecker;
