import Vue from "vue";
import Vuex from "vuex";
import user from './modules/user';
import websocket from "./modules/websocket";
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
        websocket,
        user,
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
})
