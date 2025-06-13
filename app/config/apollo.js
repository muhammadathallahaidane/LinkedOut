import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://linkedout.aidane.site//',
  // uri: 'https://cv5kdghv-3000.asse.devtunnels.ms/',
  cache: new InMemoryCache(),
});

export default client