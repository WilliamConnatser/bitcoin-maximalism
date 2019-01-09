const state = {
    loading: false
}

const mutations = {
    setLoading: (state, payload) => {
        state.loading = payload;
    }
}

export default {
    state,
    mutations
};