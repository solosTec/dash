
const state = {
    state: "unknown",
    rx: 1,
    sx: 0
};

const getters = {

};

const actions = {

};

const mutations = {
    eventState (state, eventState) {
        state.state = eventState;
    },
    eventRx(state, rx) {
        state.rx += rx;
    },
    eventSx(state, sx) {
        state.sx += sx;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
