"use strict";

import { ApolloServer } from "apollo-server-hapi";
import Hapi from "@hapi/hapi";
import { typeDefs, resolvers } from "../graphql";
import { NotesProjectDataSource } from "../graphql/dataSources";

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    notesProject: new NotesProjectDataSource(),
  }),
});

export const initServer = async (): Promise<void> =>
  /*
  typeDefs: Config["typeDefs"],
  resolvers: Config["resolvers"] */
  {
    await apolloServer.start();

    const hapiServer = Hapi.server({
      port: 3000,
      host: "localhost",
      /*routes: {
      cors: {
        origin: ["*"],
        additionalHeaders: [
          "Accept",
          "Content-Type",
          "Access-Control-Allow-Origin",
        ],
      },
    },
    */
    });

    /*
  app.route({
    method: "*",
    path: "/",
    handler(request, h) {
      return "prueba";
    },
  });
  */
    /*
  app.route({
    method: "OPTIONS",
    path: "/",
    handler(request, h) {
      return h
        .response("prueba options")
        .header("access-control-allow-methods", "POST")
        .header("Access-Control-Allow-Headers", "content-type");
    },
  });
  */
    await apolloServer.applyMiddleware({
      app: hapiServer,
    });

    await hapiServer.start();
    console.log(`Server running on ${hapiServer.info.uri}`);
    console.log(`Request API data from ${hapiServer.info.uri}/graphql`);
  };

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});
