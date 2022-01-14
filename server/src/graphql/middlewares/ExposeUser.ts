import { MiddlewareFn } from "type-graphql";
import { NotesProjectDataSource } from "../dataSources";
import { Request } from "@hapi/hapi";

interface IContext {
  user: {
    id?: string;
    email?: string;
  };
  dataSources: {
    notesProject: NotesProjectDataSource;
  };
  request: Request;
}

/**
 * Gets the user id from database and mutate the context with the user id
 */
const ExposeUser: MiddlewareFn<IContext> = async ({ context }, next) => {
  const authPayload = context.request.auth.credentials.payload as any
  const { email } = authPayload[`http://www.${process.env.AUTH0_AUDIENCE}.com/user`]
  const user = await context.dataSources.notesProject.getUserByEmail(email);
  context.user.id = user.id;
  return next();
};

export default ExposeUser;
