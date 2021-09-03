"use strict";

import { ApolloServer } from "apollo-server-hapi";
import { DataSource } from "apollo-datasource";
import Hapi from "@hapi/hapi";
import { buildSchema } from "type-graphql";
import { Queries, Mutations } from "../graphql";
import { NotesProjectDataSource } from "../graphql/dataSources";

/**
 * This InitApolloServer function is needed for two things:
 * a. Integrate with type-graphql's buildSchema async function.
 * b. Can instance only the Apollo Server from anywhere, useful for testing.
 */
export const InitApolloServer = async (
  dataSource: DataSource = new NotesProjectDataSource()
): Promise<ApolloServer> =>
  new ApolloServer({
    schema: await buildSchema({
      resolvers: [Queries, Mutations],
      nullableByDefault: true,
    }),
    dataSources: () => ({
      notesProject: dataSource /*new NotesProjectDataSource()*/,
    }),
  });

/**
 * Initialize:
 * 1. The Apollo server
 * 2. The HTTP Server via Hapi
 */
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
