import Vue from 'vue';
import Vuex from 'vuex';

//Import GraphQL dependencies and queries
import {
  defaultClient as apolloClient
} from './main';
import {
  GET_TODOS,
  ADD_TODO,
  TOGGLE_COMPLETION,
  DELETE_TODO
} from './queries';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    todos: [],
    loading: false
  },
  mutations: {
    setTodos: (state, payload) => {
      state.todos = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    addTodo: (state, payload) => {
      state.todos.unshift(payload);
    },
    setCompletion: (state, payload) => {
      for (var i = 0; i < state.todos.length; i++) {
        if (state.todos[i]._id === payload._id) {
          state.todos[i].completed = !state.todos[i].completed;
          break;
        }
      }
    },
    removeTodo: (state, payload) => {
      for (var i = 0; i < state.todos.length; i++) {
        if (state.todos[i]._id === payload) {
          state.todos.splice(i, 1);
          break;
        }
      }
    }
  },
  actions: {

    getTodos: ({
      commit
    }) => {

      //The setLoading mutation and state property is used to track if a database query is loading
      commit('setLoading', true);

      //GraphQL Query
      apolloClient
        .query({
          query: GET_TODOS
        })
        .then(({
          data
        }) => {
          //Pass GraphQL Query response to Mutation to update the State
          commit('setTodos', data.getTodos);
          commit('setLoading', false);
        })
        .catch(err => {
          console.error(err);
          commit('setLoading', false);
        })
    },
    toggleCompletion: ({
      commit
    }, _id) => {
      apolloClient
        .mutate({
          mutation: TOGGLE_COMPLETION,
          variables: {
            _id
          }
        })
        .then(({
          data
        }) => {
          //Toggle the completion boolean in the Vuex Store
          commit('setCompletion', data.toggleCompletion);
        })
        .catch(err => {
          console.error(err);
        });
    },
    addTodo: ({
      commit
    }, task) => {

      apolloClient
        .mutate({
          mutation: ADD_TODO,
          variables: {
            task
          }
        })
        .then(({
          data
        }) => {
          //Add the Todo to the Vuex Store
          commit('addTodo', data.addTodo);
        })
        .catch(err => {
          console.error(err);
        });
    },
    deleteTodo: ({
      commit
    }, _id) => {

      apolloClient
        .mutate({
          mutation: DELETE_TODO,
          variables: {
            _id
          }
        })
        .then(({
          data
        }) => {
          //Remove the Todo from the Vuex Store
          commit('removeTodo', _id);
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  getters: {
    todos: state => state.todos,
    loading: state => state.loading
  }
})