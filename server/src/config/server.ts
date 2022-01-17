"use strict";

import { ApolloServer } from "apollo-server-hapi";
import { DataSource } from "apollo-datasource";
import Hapi from "@hapi/hapi";
import { buildSchema } from "type-graphql";
import jwt from "hapi-auth-jwt2";
import { Queries, Mutations, formatError } from "../graphql";
import { NotesProjectDataSource } from "../graphql/dataSources";
import authChecker from "./authChecker";
import { jwtStrategyOptions, basicSecretScheme } from "./authentication";
import controllers from '../controllers'

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
      authChecker,
    }),
    dataSources: () => ({
      notesProject: dataSource,
    }),
    formatError,
    context: async ({ request }) => {
      return {
        request,
        user: request.auth?.credentials?.payload?.[`http://www.${process.env.AUTH0_AUDIENCE}.com/user`] || {},
      };
    },
  });

/**
 * Initialize:
 * 1. The Apollo server
 * 2. The HTTP Server via Hapi
 */
export const initServer = async (): Promise<void> => {
  const apolloServer = await InitApolloServer();

  await apolloServer.start();

  const hapiServer = Hapi.server({
    port: process.env.PORT,
  });

  await hapiServer.register(jwt);

  /**
   * Setup auth
   */
  hapiServer.auth.scheme("basicSecret", basicSecretScheme);
  hapiServer.auth.strategy("jwt", "jwt", jwtStrategyOptions);
  hapiServer.auth.strategy("basicSecret", "basicSecret")

  hapiServer.auth.default("jwt");

  await apolloServer.applyMiddleware({
    app: hapiServer,
  });

  /**
   * Setup routes
   */
  hapiServer.route(controllers)

  await hapiServer.start();
  console.log(`Server running on ${hapiServer.info.uri}`);
  console.log(`Request API data from ${hapiServer.info.uri}/graphql`);
};

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});
