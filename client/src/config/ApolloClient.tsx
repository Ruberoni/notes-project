import React, { ReactElement, ReactNode } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from '@apollo/client/link/context';

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

const authLink = setContext((_, { headers }) => {
  // const token = localStorage.getItem('token');
  const token = "Fake token"
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
})

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
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
