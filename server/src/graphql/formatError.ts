// https://github.com/apollographql/apollo-server/blob/b9ea3ca6cef9f311c69b23a8712572a29c1c3b63/packages/apollo-server-core/src/graphqlOptions.ts#L37
// https://github.com/graphql/graphql-js/blob/main/src/index.ts#L378
import { GraphQLError, GraphQLFormattedError } from "graphql";
// import { DatabaseError } from "./dataSources";
import { isDatabaseError } from "../utils";

export default function formatError(err: GraphQLError): GraphQLFormattedError {
  /* if (err.originalError instanceof DatabaseError) {
    return "Db error";
  } */
  // console.log("APOLLO HAS THROWN AN ERROR:", err);
  if (isDatabaseError(err)) {
    console.log("DATABASE ERROR:", err.originalError);
    // TODO: Log error
    return new Error("Internal server error");
  }
  return err;
}
