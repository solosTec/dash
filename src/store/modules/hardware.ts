import {BHardware, BHardwareBroker} from '@/api/hardware';

export interface HardwareState {
    brokers: BHardwareBroker[];
}

const state: HardwareState = {
    brokers: [] as BHardwareBroker[],
};

const getters = {

};

const actions = {

};

const mutations = {
    loaded (state: HardwareState, hardware: BHardware) {
        state.brokers = hardware.brokers;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
