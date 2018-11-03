import Vue from 'vue';
import Vuex from 'vuex';

//Import GraphQL dependencies and queries
import {
  defaultClient as apolloClient
} from './main';
import {
  GET_TODOS
} from './queries';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    todos: [],
    loading: false,
    mode: 'list'
  },
  mutations: {
    setTodos: (state, payload) => {
      state.todos = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setMode: (state, payload) => {
      state.mode = payload;
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
    }, id) => {
      //Toggle Task Completion
    }

  },
  getters: {
    todos: state => state.todos,
    loading: state => state.loading,
    mode: state => state.mode
  }
})