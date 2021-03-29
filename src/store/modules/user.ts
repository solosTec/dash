export interface UserState {
  username: string | null;
  privileges: any;
}

const state: UserState = {
  username: null,
  privileges: {}
};

const getters = {};

const actions = {};

export const NO_ACCESS_ROUTE = "no-access";

export const MODULES = {
  CONFIG_DEVICES: "configDevice",
  CONFIG_SYSTEM: "configSystem",
  CONFIG_USER: "configUser",
  CONFIG_WEB: "configWeb",
  CONFIG_GATEWAY: "configGateway",
  CONFIG_METERS: "configMeter",
  CONFIG_WMBUS: "configWMBus",
  CONFIG_IEC: "configIEC",
  CONFIG_LORA: "configLora",
  CONFOG_UPLOAD: "configUpload",
  CONFIG_DOWNLOAD: "configDownload",
  STATUS_SESSION: "statusSession",
  STATUS_TARGET: "statusTarget",
  STATUS_CONNECTION: "statusConnection",
  MONITOR_SYSTEM: "monitorSystem",
  MONITOR_MESSAGES: "monitorMessages",
  MONITOR_TSDB: "monitorTSDB",
  MONITOR_LORA: "monitorLora",
  TASK_CSV: "taskCSV",
  TASK_TSDB: "taskTSDB",
  TASK_PLAUSIBILITY: "taskPlausibility"
};

export const PRIVILEGES = {
  VIEW: "view"
};

const mutations = {
  // data: {lastAccess: "2019-12-11 08:57:14.00000000", name: "Alfred", privs: {devices: ["view","edit"], meters:[]}
  loaded(state: UserState, data: any) {
    state.username = data.name;
    //
    //  uncomment the following line to use configured privileges
    //
    //state.privileges = data.priv;

    state.privileges = {};
    state.privileges[MODULES.CONFIG_DEVICES] = [PRIVILEGES.VIEW];
    state.privileges[MODULES.CONFIG_SYSTEM] = [PRIVILEGES.VIEW];
    state.privileges[MODULES.CONFIG_USER] = [PRIVILEGES.VIEW];
    state.privileges[MODULES.CONFIG_WEB] = [PRIVILEGES.VIEW];
    state.privileges[MODULES.CONFIG_GATEWAY] = [PRIVILEGES.VIEW];
    state.privileges[MODULES.CONFIG_METERS] = [PRIVILEGES.VIEW];
    state.privileges[MODULES.CONFIG_WMBUS] = [PRIVILEGES.VIEW];
    state.privileges[MODULES.CONFIG_IEC] = [PRIVILEGES.VIEW];
    state.privileges[MODULES.CONFIG_LORA] = [PRIVILEGES.VIEW];
    state.privileges[MODULES.CONFOG_UPLOAD] = [PRIVILEGES.VIEW];
    state.privileges[MODULES.CONFIG_DOWNLOAD] = [PRIVILEGES.VIEW];
    state.privileges[MODULES.STATUS_SESSION] = [PRIVILEGES.VIEW];
    state.privileges[MODULES.STATUS_TARGET] = [PRIVILEGES.VIEW];
    state.privileges[MODULES.STATUS_CONNECTION] = [PRIVILEGES.VIEW];
    state.privileges[MODULES.MONITOR_SYSTEM] = [PRIVILEGES.VIEW];
    state.privileges[MODULES.MONITOR_MESSAGES] = [PRIVILEGES.VIEW];
    state.privileges[MODULES.MONITOR_TSDB] = [PRIVILEGES.VIEW];
    state.privileges[MODULES.MONITOR_LORA] = [PRIVILEGES.VIEW];
    state.privileges[MODULES.TASK_CSV] = [PRIVILEGES.VIEW];
    state.privileges[MODULES.TASK_TSDB] = [PRIVILEGES.VIEW];
    state.privileges[MODULES.TASK_PLAUSIBILITY] = [PRIVILEGES.VIEW];
  },
  reset(state: UserState) {
    state.username = null;
    state.privileges = {};
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
