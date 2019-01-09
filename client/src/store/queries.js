import {
    gql
} from 'apollo-boost';

/* Example GraphQL mutations and queries!

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
export const DELETE_TODO = gql `
    mutation($_id: String!){
        deleteTodo(_id: $_id)
    }
` */

export const GET_CURRENT_USER = gql `
    query getCurrentUser {
        getCurrentUser {
            _id
            username
            email
            admin
            allegiance
            maximalist
        }
    }
`

export const SIGNUP_USER = gql `
    mutation($username: String!, $email: String!, $password: String!) {
        signupUser(username: $username, email:$email, password:$password){
            token
        }
    }
`;

export const SIGNIN_USER = gql `
    mutation($email:String!, $password: String!) {
        signinUser(email: $email,password: $password) {
            token
        }
    }
`

export const SET_ALLEGIANCE = gql `
    mutation($allegiance: String!) {
        setAllegiance(allegiance: $allegiance){
            _id
            username
            email
            admin
            allegiance
            maximalist
        }
    }
`