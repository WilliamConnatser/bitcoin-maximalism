import {
    gql
} from 'apollo-boost';

export const GET_TODOS = gql `
    query {
        getTodos {
            _id
            task
            completed
            dateCreated
        }
    }
`

export const ADD_TODO = gql `
    mutation($task: String!){
        addTodo(task: $task){
            _id
            task
            completed
            dateCreated
        }
    }
`

export const TOGGLE_COMPLETION = gql `
    mutation($_id: String!){
        toggleCompletion(_id: $_id){
            _id
            task
            completed
            dateCreated
        }
    }
`