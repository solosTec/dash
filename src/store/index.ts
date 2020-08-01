import Vue from "vue";
import Vuex from "vuex";
import hardware from './modules/hardware';
import user, {UserState} from './modules/user';
import websocket, {WebsocketState} from "./modules/websocket";
import {HardwareState} from '@/store/modules/hardware';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export interface AppState {
    user: UserState;
    websocket: WebsocketState;
    hardware: HardwareState;
}

export default new Vuex.Store<AppState>({
    modules: {
        websocket,
        user,
        hardware,
    },
    strict: debug,
    plugins: [] // can be used to enable debugging for vuex: debug ? [createLogger()] : []
})
