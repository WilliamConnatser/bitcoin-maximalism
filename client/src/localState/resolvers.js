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
    },
    toggleTodo: (_, variables, { cache }) => {
      const id = `TodoItem:${variables.id}`
      const fragment = gql`
        fragment completeTodo on TodoItem {
          completed
        }
      `
      const todo = cache.readFragment({ fragment, id })
      const data = { ...todo, completed: !todo.completed }
      cache.writeData({ id, data })
      return null
    },
    deleteTodos: (_, __, { cache }) => {
      const query = getTodos
      let allTodos = cache.readQuery({ query })
      const data = { 
        todos: allTodos.todos.filter(t => !t.completed)
      }
      cache.writeData({data})
    }
  }*/
}