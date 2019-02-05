/*

    localState is not in use right now, but this boilerplate is here incase its needed in the future!
    When using Apollo GraphQL it's recommended to use Apollo Client for local state instead of an external package.

*/

import { gql } from 'apollo-boost';

export const typeDefs = gql`
  type Todo {
    id: Int!
    todo: String!
    completed: Boolean!
  }

  type Mutation {
    addTodo(todo: String!): Todo
    toggleTodo(id: String!): Todo
  }

  type Query {
    visibilityFilter: String
    todos: [Todo]
  }
`