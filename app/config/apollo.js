import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import * as SecureStore from 'expo-secure-store';

const httpLink = createHttpLink({
  uri: "https://linkedout.aidane.site//",
  // uri: 'https://cv5kdghv-3000.asse.devtunnels.ms/',
});

const authLink = setContext(async (_, { headers }) => {
  const token = await SecureStore.getItemAsync('access_token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
