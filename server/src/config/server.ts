"use strict";

import { ApolloServer } from "apollo-server-hapi";
import { DataSource } from "apollo-datasource";
import Hapi, { server as hapiServer } from "@hapi/hapi";
import { buildSchema } from "type-graphql";
import jwksRsa from 'jwks-rsa'
import jwt from 'hapi-auth-jwt2'
import { Queries, Mutations, formatError } from "../graphql";
import { NotesProjectDataSource } from "../graphql/dataSources";
import authChecker from './authChecker'

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
      notesProject: dataSource /*new NotesProjectDataSource()*/,
    }),
    formatError,
    context: async ({ request }) => {
      return {
        request,
        user: request.auth?.credentials?.payload?.['http://www.8d3d6a7b-a2f8-40dd-9233-f14c3115efe4.com/user'] || {}
      }
    }
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
      port: process.env.PORT,
    });

    await hapiServer.register(jwt)

    hapiServer.auth.strategy('jwt', 'jwt', {
      // Get the complete decoded token, because we need info from the header (the kid)
      complete: true,
      
      headerKey: 'authorization',
      tokenType: 'Bearer',
      
      // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint.
      key: jwksRsa.hapiJwt2KeyAsync({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-ipdx4j09.us.auth0.com/.well-known/jwks.json'
      }),
      
      // User validation is done in Auth0 and AuthChecker.
      validate: () => {
        return {
          isValid: true
        }
      },
      
      // Validate the audience and the issuer.
      verifyOptions: {
        audience: '8d3d6a7b-a2f8-40dd-9233-f14c3115efe4',
        issuer: 'https://dev-ipdx4j09.us.auth0.com/',
        algorithms: [ 'RS256' ]
      }
    });

    hapiServer.auth.default('jwt')

    hapiServer.route([
      {
        method: "GET",
        path: "/",
        options: { auth: false },
        handler: function(request, h) {
          return {text: 'Token not required'};
        }
      },
      {
        method: 'GET',
        path: '/restricted',
        options: { auth: 'jwt' },
        handler: function(request, h) {
          const response = h.response({text: 'You used a Token!', token: request.headers.authorization});
          response.header("Authorization", request.headers.authorization);
          return response;
        }
      }
    ]);

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
