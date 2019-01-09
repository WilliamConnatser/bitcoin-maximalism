//Import GraphQL dependencies and queries
import {
    defaultClient as apolloClient
} from '../../main';
import {
    SET_ALLEGIANCE
} from '../queries';

const actions = {
    setAllegiance: ({
        commit,
        dispatch
    }, payload) => {
        commit('setLoading', true);
        apolloClient
            .mutate({
                mutation: SET_ALLEGIANCE,
                variables: {
                    allegiance: payload
                }
            })
            .then(async () => {
                commit('setLoading', false);
                //Update User object in local state
                await apolloClient.resetStore();
                dispatch('getCurrentUser');
            })
            .catch(err => {
                commit('setLoading', false);
                console.error(err);
            });
    }
}

export default {
    actions
};