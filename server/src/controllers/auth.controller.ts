import { ServerRoute } from "@hapi/hapi";
import { NotesProjectDataSource, UserContent } from "../graphql";

const register: ServerRoute = {
  method: 'POST',
  path: '/auth/register',
  options: {
    auth: "basicSecret",
  },
  handler: (request) => {
    const db = new NotesProjectDataSource()
    return db.register(request.payload as UserContent)
  },
}

export default register;