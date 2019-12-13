
export interface WebsocketState {
    state: string;
    rx: number;
    sx: number;
}

const state: WebsocketState = {
    state: "unknown",
    rx: 1,
    sx: 0
};

const getters = {

};

const actions = {

};

const mutations = {
    eventState (state: WebsocketState, eventState: string) {
        state.state = eventState;
    },
    eventRx(state: WebsocketState, rx: number) {
        state.rx += rx;
    },
    eventSx(state: WebsocketState, sx: number) {
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
