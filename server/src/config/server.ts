"use strict";

import { ApolloServer } from "apollo-server-hapi";
import Hapi from "@hapi/hapi";
import { buildSchema } from "type-graphql";
import { resolvers } from "../graphql";
import { NotesProjectDataSource } from "../graphql/dataSources";

export const InitApolloServer = async (): Promise<ApolloServer> =>
  new ApolloServer({
    schema: await buildSchema({
      resolvers,
      nullableByDefault: true,
    }),
    dataSources: () => ({
      notesProject: new NotesProjectDataSource(),
    }),
  });

// export function initApolloServer

export const initServer = async (): Promise<void> =>
  /*
  typeDefs: Config["typeDefs"],
  resolvers: Config["resolvers"] */
  {
    const apolloServer = await InitApolloServer();

    await apolloServer.start();

    const hapiServer = Hapi.server({
      port: 3000,
      host: "localhost",
    });

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
