import { ApolloClient, InMemoryCache } from '@apollo/client';

// Create and configure the Apollo Client
const client = new ApolloClient({
  uri: 'http://localhost:8082/graphql', // replace with your actual GraphQL endpoint
  cache: new InMemoryCache(),
});

export default client; // Just export the client
