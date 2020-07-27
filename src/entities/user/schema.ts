/* eslint-disable @typescript-eslint/no-var-requires */
const { buildSchema, GraphQLSchema } = require('graphql');

export const schema: typeof GraphQLSchema = buildSchema(`
    type User {
        email: String!
        sub: String
        createdAt: String
    }

    type Query {
        user(email: String!): User
    }
`);