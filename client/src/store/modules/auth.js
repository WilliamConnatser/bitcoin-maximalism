//Import GraphQL dependencies and queries
import {
    defaultClient as apolloClient
} from '../../main';
import {
    SIGNIN_USER,
    SIGNUP_USER,
    GET_CURRENT_USER
} from '../queries';

const state = {
    user: null
}

const mutations = {
    setUser: (state, payload) => (state.user = payload),
    clearUser: state => (state.user = null)
}

const actions = {
    getCurrentUser: ({commit}) => {
        commit('setLoading', true);
        apolloClient.query({
            query: GET_CURRENT_USER
        })
        .then(({data}) => {
            commit('setLoading', false);
            commit('setUser', data.getCurrentUser);
        })
        .catch(err => {
            commit('setLoading', false);
            console.error(err);
        });
    },
    signinUser: ({ commit, dispatch }, payload) => {
        commit('setLoading', true);
        apolloClient
          .mutate({
            mutation: SIGNIN_USER,
            variables: payload
          })
          .then(async ({ data }) => {
            commit('setLoading', false);
            //Wait until the token is set to continue to retrieve user info from GraphQL
            console.log(data.signinUser.token)
            await localStorage.setItem("token", data.signinUser.token);
            await apolloClient.resetStore();
            dispatch('getCurrentUser');
          })
          .catch(err => {
            commit('setLoading', false);
            console.error(err);
          });
      },
      signupUser: ({ commit, dispatch }, payload) => {
        commit('setLoading', true);
        apolloClient
          .mutate({
            mutation: SIGNUP_USER,
            variables: payload
          })
          .then(async ({ data }) => {
            commit('setLoading', false);
            //Wait for the token to be set before requesting user info from GraphQL
            await localStorage.setItem("token", data.signupUser.token);
            await apolloClient.resetStore();
            dispatch('getCurrentUser');
          })
          .catch(err => {
            commit('setLoading', false);
            console.error(err);
          });
      },
      signoutUser: async ({ commit }) => {
        //Clear User object in state
        commit("clearUser");
        //Remove token in localStorage
        localStorage.setItem("token", "");
        //End apolloClient session
        await apolloClient.resetStore();
      }
}

export default {
    state,
    mutations,
    actions
};