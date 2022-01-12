import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'

export const apolloClient = new ApolloClient({
  link: createHttpLink({ uri: 'https://scan.moonrabbit.com/graphiql' }),
  cache: new InMemoryCache(),
  connectToDevTools: process.env.NODE_ENV !== 'production',
})
