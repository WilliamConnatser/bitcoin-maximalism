module.exports = {
    Query: {
        getTodos: async (_, args, {
            Todo
        }) => {
            const todos = await Todo.find({}).sort({
                dateCreated: 'desc'
            });
            return todos;
        }
    },
    Mutation: {
        addTodo: async (_, {
            task,
            completed,
            dateCreated
        }, {
            Todo
        }) => {

            const todo = await Todo.findOne({
                task
            });

            if (todo) {
                throw new Error('Todo already exists')
            }

            const newTodo = await new Todo({
                task,
                completed,
                dateCreated
            }).save();

            return newTodo;
        }
    }
}