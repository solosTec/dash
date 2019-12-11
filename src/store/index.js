import Vue from "vue";
import Vuex from "vuex";
import user from './modules/user';
import websocket from "./modules/websocket";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
        websocket,
        user,
    },
    strict: debug,
    plugins: [] // can be used to enable debugging for vuex: debug ? [createLogger()] : []
})
