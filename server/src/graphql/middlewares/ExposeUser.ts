import { MiddlewareFn } from "type-graphql";
import { AuthenticationError } from "apollo-server-hapi";
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

interface IUserClaim {
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
}

/**
 * Finds the database user for the authenticated Auth0 identity and puts its id in the context.
 * 1. Looks the user up by 'oauthId' (the token's 'sub').
 * 2. Otherwise, links an existing user with the same VERIFIED email that has no 'oauthId' yet.
 * 3. Otherwise, creates the user, so a first login never breaks the resolvers.
 */
const ExposeUser: MiddlewareFn<IContext> = async ({ context }, next) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload = context.request?.auth?.credentials?.payload as any;
  const sub: string | undefined = payload?.sub;
  if (!sub) throw new AuthenticationError("Missing user identity in token.");

  const claim: IUserClaim =
    payload[`http://www.${process.env.AUTH0_AUDIENCE}.com/user`] || {};
  const verifiedEmail = claim.email_verified ? claim.email : undefined;
  const db = context.dataSources.notesProject;

  let user = await db.getUserByOauthId(sub);

  if (!user && verifiedEmail) {
    const byEmail = await db.getUserByEmail(verifiedEmail);
    if (byEmail && !byEmail.oauthId) {
      await db.linkOauthId(byEmail.id, sub);
      user = await db.getUserByOauthId(sub);
    }
  }

  if (!user) {
    const emailTaken = verifiedEmail && (await db.getUserByEmail(verifiedEmail));
    await db.createOauthUser({
      oauthId: sub,
      email: emailTaken ? undefined : verifiedEmail,
      name: claim.name || claim.given_name,
    });
    user = await db.getUserByOauthId(sub);
  }

  if (!user) throw new AuthenticationError("Could not resolve the user.");

  context.user.id = user.id;
  return next();
};

export default ExposeUser;
