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
            task
        }, {
            Todo
        }) => {

            const todo = await Todo.findOne({
                task
            });

            if (todo) {
                throw new Error('This task already exists on your todo list!')
            }

            var id = require('mongodb').ObjectID();

            const newTodo = await new Todo({
                _id: id,
                task,
                completed: false,
                dateCreated: new Date()
            }).save();

            return newTodo;
        },
        toggleCompletion: async (_, {
            _id
        }, {
            Todo
        }) => {

            Todo.findById(_id, function (err, todo) {
                if (err) throw new Error('This task does not exist on your todo list!');

                todo.completed = !todo.completed;
                todo.save(function (err) {
                    if (err) throw new Error('An error ocurred while updating your todo list!');
                });
            });

            return Todo.findById(_id);
        },
        deleteTodo: async (_, {
            _id
        }, {
            Todo
        }) => {

            Todo.findOneAndDelete(_id, function (err) {
                if (err) throw new Error('This task does not exist on your todo list!');
            });

            return _id;
        }
    }
}