const {
    ApolloServer,
    gql
} = require('apollo-server');
const mongoose = require('mongoose');
require('dotenv').config({
    path: 'variables.env'
})

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true
    })
    .then(() => console.log("Database Connected"))
    .catch(err => console.log(err))

const todos = [{
        task: 'Wash',
        completed: false
    },
    {
        task: 'Clean',
        completed: true
    }
]

const typeDefs = gql `

type Todo {
    task: String,
    completed: Boolean
}

type Query {
    getTodos: [Todo]
}

type Mutation {
    addTodo(task: String, completed: Boolean): Todo
}

`;

const resolvers = {
    Query: {
        getTodos: () => todos
    },
    Mutation: {
        addTodo: (_, {
            task,
            completed
        }) => {

            const todo = {
                task,
                completed
            };

            todos.push(todo);

            return todo;
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen().then(({
    url
}) => {
    console.log(`GraphQL Server Started on ${url}`)
});