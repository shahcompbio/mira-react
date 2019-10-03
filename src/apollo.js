import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";

const httpLink = process.env.REACT_APP_BASENAME
  ? "/graphql"
  : process.env.REACT_APP_BASENAME + "/graphql";
console.log(process.env.REACT_APP_BASENAME);
const link = createHttpLink({
  uri: httpLink,
  credentials: "same-origin"
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  shouldBatch: true
});

export default client;
