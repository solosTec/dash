"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var smf_config_system_vue_1 = require("./views/smf-config-system.vue");
var smf_config_web_vue_1 = require("./views/smf-config-web.vue");
var smf_config_device_vue_1 = require("./views/smf-config-device.vue");
var smf_config_gateway_vue_1 = require("./views/smf-config-gateway.vue");
var smf_config_meter_vue_1 = require("./views/smf-config-meter.vue");
var smf_config_iec_vue_1 = require("./views/smf-config-iec.vue");
var smf_config_wmbus_vue_1 = require("./views/smf-config-wmbus.vue");
var smf_config_lora_vue_1 = require("./views/smf-config-lora.vue");
var smf_config_upload_vue_1 = require("./views/smf-config-upload.vue");
var smf_config_download_vue_1 = require("./views/smf-config-download.vue");
var smf_status_sessions_vue_1 = require("./views/smf-status-sessions.vue");
var smf_status_targets_vue_1 = require("./views/smf-status-targets.vue");
var smf_status_connections_vue_1 = require("./views/smf-status-connections.vue");
var smf_monitor_system_vue_1 = require("./views/smf-monitor-system.vue");
var smf_monitor_messages_vue_1 = require("./views/smf-monitor-messages.vue");
var smf_monitor_iec_gw_vue_1 = require("./views/smf-monitor-iec-gw.vue");
var smf_monitor_lora_vue_1 = require("./views/smf-monitor-lora.vue");
var smf_collector_mbus_radio_vue_1 = require("./views/smf-collector-mbus-radio.vue");
var smf_collector_iec_vue_1 = require("./views/smf-collector-iec.vue");
var smf_task_csv_vue_1 = require("./views/smf-task-csv.vue");
var smf_task_tsdb_vue_1 = require("./views/smf-task-tsdb.vue");
var smf_no_access_vue_1 = require("./views/smf-no-access.vue");
var smf_home_vue_1 = require("./views/smf-home.vue");
vue_1.default.use(vue_router_1.default);
exports.default = new vue_router_1.default({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "smfHome",
      component: smf_home_vue_1.default
    },
    {
      path: "/no-access",
      name: "smfNoAccess",
      component: smf_no_access_vue_1.default
    },
    {
      path: "/config/system",
      name: "smf-config-system",
      component: smf_config_system_vue_1.default
    },
    {
      path: "/config/web",
      name: "smf-config-web",
      component: smf_config_web_vue_1.default
    },
    {
      path: "/config/device",
      name: "smfConfigDevice",
      component: smf_config_device_vue_1.default
    },
    {
      path: "/config/gateway",
      name: "smfConfigGateway",
      component: smf_config_gateway_vue_1.default
    },
    {
      path: "/config/meter/:meterPk?",
      name: "smfConfigMeter",
      component: smf_config_meter_vue_1.default
    },
    {
      path: "/config/iec",
      name: "smfConfigIec",
      component: smf_config_iec_vue_1.default
    },
    {
      path: "/config/wmbus",
      name: "smfConfigWMBus",
      component: smf_config_wmbus_vue_1.default
    },
    {
      path: "/config/lora",
      name: "smfConfigLora",
      component: smf_config_lora_vue_1.default
    },
    {
      path: "/config/upload",
      name: "smfConfigUpload",
      component: smf_config_upload_vue_1.default
    },
    {
      path: "/config/download",
      name: "smfConfigDownload",
      component: smf_config_download_vue_1.default
    },
    {
      path: "/config/user",
      name: "smf-config-user",
      component: function() {
        return Promise.resolve().then(function() {
          return require("./views/smf-config-user.vue");
        });
      }
    },
    //
    //  collector
    //
    {
      path: "/collector/lora",
      name: "smfMonitorLora",
      component: smf_monitor_lora_vue_1.default
    },
    {
      path: "/collector/mbusRadio",
      name: "smfCollectorMBusRadio",
      component: smf_collector_mbus_radio_vue_1.default
    },
    {
      path: "/collector/iec",
      name: "smfCollectorIEC",
      component: smf_collector_iec_vue_1.default
    },
    //
    //  status
    //
    {
      path: "/status/sessions",
      name: "smfStatusSession",
      component: smf_status_sessions_vue_1.default
    },
    {
      path: "/status/targets",
      name: "smfStatusTarget",
      component: smf_status_targets_vue_1.default
    },
    {
      path: "/status/connections",
      name: "smfStatusConnection",
      component: smf_status_connections_vue_1.default
    },
    //
    //  monitoring
    //
    {
      path: "/monitor/system",
      name: "smfMonitorSystem",
      component: smf_monitor_system_vue_1.default
    },
    {
      path: "/monitor/messages",
      name: "smfMonitorMessages",
      component: smf_monitor_messages_vue_1.default
    },
    {
      path: "/monitor/IECgw",
      name: "smfMonitorIECgw",
      component: smf_monitor_iec_gw_vue_1.default
    },
    //
    //  tasks
    //
    {
      path: "/task/csv",
      name: "smfTaskCSV",
      component: smf_task_csv_vue_1.default
    },
    {
      path: "/task/tsdb",
      name: "smfTaskTSDB",
      component: smf_task_tsdb_vue_1.default
    },
    {
      path: "/task/plausibility",
      name: "smfTaskPlausibility",
      component: function() {
        return Promise.resolve().then(function() {
          return require("./views/smf-task-plausibility.vue");
        });
      }
    }
  ],
  scrollBehavior: function(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  }
});
//# sourceMappingURL=router.js.map
