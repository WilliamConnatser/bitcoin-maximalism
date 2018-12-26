import Vue from 'vue';
import Vuex from 'vuex';

//Import GraphQL dependencies and queries
import {
  defaultClient as apolloClient
} from './main';
import {
  GET_TODOS,
  ADD_TODO,
  TOGGLE_COMPLETION
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
          variables: {_id}
        })
        .then(({
          data
        }) => {
          //Nothing need to be done afterwards
          //The DOM checkbox represents the current version of the truth
          //If the page is reloaded, then the database will update the Vuex store automatically
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
          variables: {task}
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
    }

  },
  getters: {
    todos: state => state.todos,
    loading: state => state.loading
  }
})