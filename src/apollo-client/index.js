import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'

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
  link: createHttpLink({ uri: 'https://stage.evm.exp.moonrabbit.com/graphiql' }),
  connectToDevTools: process.env.NODE_ENV !== 'production',
})
