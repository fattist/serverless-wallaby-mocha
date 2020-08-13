/* eslint-disable @typescript-eslint/no-var-requires */
const { buildSchema, GraphQLSchema } = require('graphql');

export const schema: typeof GraphQLSchema = buildSchema(`
    type User {
        email: String!
        sub: String
    }

    type Mutation {
        register(email: String!, name: String, password: String!): User
    }

    type Query {
        user(email: String!): User
    }
`);