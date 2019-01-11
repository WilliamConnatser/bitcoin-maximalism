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