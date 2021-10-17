import React, { ReactElement, ReactNode } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

/**
 * Init ApolloClient
 */
const httpLink = new HttpLink({
  uri: process.env.REACT_APP_SERVER_URI || "http://localhost:4000/graphql",
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});

/**
 * ApolloProvider with the client
 */
export default function Provider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
