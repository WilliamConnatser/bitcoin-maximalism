/*

    localState is not in use right now, but this boilerplate is here incase its needed in the future!
    When using Apollo GraphQL it's recommended to use Apollo Client for local state instead of an external package.

*/


//import { gql } from 'apollo-boost';
//import RandomID from 'random-id';

/*
import TodosList from './components/TodosList'
const getTodos = TodosList.queries.getTodos
*/

export const resolvers = {
  /*
  Mutation: {
    addTodo: (_, { todo }, { cache }) => {
      const query = getTodos
      const previous = cache.readQuery({ query })
      const newTodo = {
        id: RandomID(10),
        todo,
        completed: false,
        __typename: 'TodoItem',
      }
      const data = {
        todos: previous.todos.concat([newTodo]),
      }
      cache.writeData({ data })
      return newTodo
    }
  }*/
}