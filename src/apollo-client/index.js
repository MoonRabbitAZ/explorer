import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import CONFIG from '@/config'

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          transactions: {
            keyArgs: false,
          },
          tokenTransfers: {
            keyArgs: false,
          },
        },
      },
    },
  }),
  link: createHttpLink({ uri: CONFIG.EVM_GRAPHQL_URL }),
  connectToDevTools: process.env.NODE_ENV !== 'production',
})
