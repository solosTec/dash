
const state = {
    username: 'x',
    roles: []
};

const getters = {};

const actions = {};

const mutations = {
    loaded(state, payload) {
        state.username = payload.username;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
