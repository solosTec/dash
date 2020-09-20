import Vue from "vue";
import Vuex from "vuex";
import user, { UserState } from "./modules/user";
import websocket, { WebsocketState } from "./modules/websocket";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export interface AppState {
  user: UserState;
  websocket: WebsocketState;
}

export default new Vuex.Store<AppState>({
  modules: {
    websocket,
    user
  },
  strict: debug,
  plugins: [] // can be used to enable debugging for vuex: debug ? [createLogger()] : []
});
