import store from "../store";
import Vue from "vue";
import { TranslateResult } from "vue-i18n";
import { MESSAGE_REQUEST } from "@/constants/msgTypes";

interface WebSocketData {
  ws: WebSocket | null;
  rx: number;
  sx: number;
  path: string;
  timer: number | null;
  host: string;
  state: string | TranslateResult;
}

export const enum Cmd {
  update = "update",
  insert = "insert",
  modify = "modify",
  clear = "clear",
  delete = "delete",
  load = "load",
  cleanup = "cleanup",
  readout = "readout"
}

export const enum Channel {
  ConfigUser = "config.user",
  ConfigDevices = "config.device",
  ConfigGateway = "config.gateway",
  ConfigMeter = "config.meter",
  ConfigBridge = "config.bridge",
  ConfigLocation = "config.location",
  ConfigLoRa = "config.lora",
  ConfigSnapshot = "config.snapshot",
  ConfigWMBus = "config.wmbus",
  ConfigIec = "config.iec"
}

export interface WSResponse {
  cmd:
    | "update"
    | "insert"
    | "modify"
    | "clear"
    | "delete"
    | "load"
    | "cleanup"
    | Cmd;
  channel: string | Channel;
}

export interface WSInsertResponse<T> extends WSResponse {
  rec: {
    key: {
      tag?: string | number;
      pk?: string | number; // TOFO@mse px should be replaced by tag
    };
    data: T;
  };
}

export interface WSUpdateResponse extends WSResponse {
  section: string;
  rec: any;
}

export interface WSModifyResponse<T> extends WSResponse {
  key: any;
  value: Partial<T>;
}

export interface WSDeleteResponse extends WSResponse {
  key: any;
}

export interface WSLoadResponse extends WSResponse {
  show: boolean;
  level: number;
}

const getWsProtocol = (isSecure: boolean) => {
  return isSecure ? "wss" : "ws";
};
export const webSocket = Vue.extend({
  created() {
    console.log(
      this.$options.name + " created with env " + process.env.NODE_ENV
    );
  },

  mounted() {
    console.log(this.$options.name + " mounted");
  },

  data(): WebSocketData {
    return {
      ws: null,
      rx: 0,
      sx: 0,
      path: "",
      timer: null,
      host: location.host,
      state: "none"
    };
  },

  beforeDestroy() {
    if (this.timer) clearTimeout(this.timer);
    this.ws_close();
  },

  methods: {
    ws_open: function(path: string) {
      let isSecure = window.location.protocol === "https:";
      this.path = path;
      const self = this as any; //  save context
      if (process.env.NODE_ENV === "production") {
        const extraBackendPath =
          process.env.VUE_APP_SMF_DOCKER === "true" ? "/backend" : "";
        this.ws = new WebSocket(
          `${getWsProtocol(isSecure)}://` +
            location.host +
            extraBackendPath +
            path,
          ["SMF"]
        );
      } else {
        // VUE_APP_SMF_SERVER can be set in the .env file
        console.log("VUE_APP_SMF_SERVER: " + process.env.VUE_APP_SMF_SERVER);
        // segw.ch is always secure - there is a redirect to https
        if (process.env.VUE_APP_SMF_SERVER === "segw.ch") {
          isSecure = true;
        }
        this.ws = new WebSocket(
          `${getWsProtocol(isSecure)}://${process.env.VUE_APP_SMF_SERVER ||
            "192.168.1.21:8082"}/${path}`,
          ["SMF"]
        );
      }
      this.ws.onopen = function() {
        //  subscribe system status
        console.log("websocket open: " + this.url);
        (
          self.ws_on_open ||
          (() => {
            throw Error("Please implement ws_on_open in your class");
          })()
        )(this.url);
        self.state = self.$t("state-online");
        self.ws_emit_event_state(self.state);
      };
      this.ws.onmessage = function(e) {
        // console.log('websocket received data (' + e.data.length + ')');
        self.rx += e.data.length;
        self.ws_emit_event_rx();
        (
          self.ws_on_data ||
          (() => {
            throw Error("Please implement ws_on_data in your class");
          })()
        )(JSON.parse(e.data));
      };
      this.ws.onclose = function(evt) {
        switch (evt.code) {
          case 1000:
            console.log("websocket - normal closure: " + evt.code);
            // self.ws_emit_event_state("normal closure");
            break;
          case 1001:
            console.log("websocket - going away: " + evt.code);
            self.ws_emit_event_state("going away");
            break;
          case 1002:
            console.log("websocket - protocol error: " + evt.code);
            self.ws_emit_event_state("protocol error");
            break;
          case 1003:
            console.log("websocket - unsupported data: " + evt.code);
            self.ws_emit_event_state("unsupported data");
            break;
          case 1006:
            console.log("websocket - connection lost: ");
            self.ws_emit_event_state("connection lost");
            //  start timer to reconnect
            self.onTimer();
            break;
          default:
            console.log("websocket closed: " + evt.code);
            self.ws_emit_event_state(evt.code + " closed");
            break;
        }
      };
      this.ws.onerror = function(err) {
        console.log("websocket error: " + err);
        self.ws_emit_event_state("error");
      };
    },

    //  close socket intentionally
    ws_close: function() {
      if (!this.ws_is_open() || !this.ws) return;

      switch (this.ws.readyState) {
        case 0: //  CONNECTING
        case 1: //  OPEN
          this.ws.close();
          break;

        case 2: //  CLOSING
        case 3: //  CLOSED
        default:
          break;
      }
      this.state = this.$t("state-offline");
      this.ws_emit_event_state(this.state);
    },

    // FIXME channel string should be removed - all channels should be part of the enum
    ws_subscribe(channel: string | Channel) {
      if (!this.ws_is_open() || !this.ws) return;
      const msg = JSON.stringify({
        cmd: "subscribe",
        channel: channel
      });
      this.ws.send(msg);
      this.sx += msg.length;
      this.ws_emit_event_sx();
    },
    ws_update(channel: string) {
      if (!this.ws_is_open() || !this.ws) return;
      const msg = JSON.stringify({
        cmd: "update",
        channel: channel
      });
      this.ws.send(msg);
      this.sx += msg.length;
      this.ws_emit_event_sx();
    },
    ws_submit_record(cmd: string, channel: string | Channel, rec: any) {
      if (!this.ws_is_open() || !this.ws) return;
      const msg = JSON.stringify({
        cmd: cmd,
        channel: channel,
        rec: rec
      });
      this.ws.send(msg);
      this.sx += msg.length;
      this.ws_emit_event_sx();
    },
    ws_submit_key(cmd: string, channel: string | Channel, key: any) {
      if (!this.ws_is_open() || !this.ws) return;
      const msg = JSON.stringify({
        cmd: cmd,
        channel: channel,
        key: key
      });
      this.ws.send(msg);
      this.sx += msg.length;
      this.ws_emit_event_sx();
    },
    ws_submit_command(
      cmd: string,
      channel: string,
      key: string,
      params: any,
      section: string | string[]
    ) {
      if (!this.ws_is_open() || !this.ws) return;
      const msg = JSON.stringify({
        cmd: cmd,
        channel: channel,
        key: key,
        params: params,
        section: section
      });
      this.ws.send(msg);
      this.sx += msg.length;
      this.ws_emit_event_sx();
    },
    //
    //  msgType: getProfileList, getProcParameter, getList, getProfilePack
    //  see: msgTypes.ts
    //  root: OBIS code
    //  pk_gw: primary key of selected object (gateway, meter)
    //  pk_meter: primary key of selected object (gateway, meter)
    //  params: optional parameters
    //
    ws_submit_request(
      msgType: MESSAGE_REQUEST,
      root: string,
      pk_gw: string | string[],
      params: any = { params: null }
    ) {
      if (!this.ws_is_open() || !this.ws) return;
      const msg = JSON.stringify({
        cmd: "com:sml",
        channel: msgType,
        section: root,
        gw: pk_gw,
        params
      });
      this.ws.send(msg);
      this.sx += msg.length;
      this.ws_emit_event_sx();
    },
    //
    //  pk_gw: primary key of selected object (gateway, meter)
    //  job: job to execute
    //  params: optional vector of strings to select specific sections
    //  of the gateway
    //
    ws_proxy(
      job: string,
      pk_gw: string | string[],
      sections = new Array<string>()
    ) {
      if (!this.ws_is_open() || !this.ws) return;
      const msg = JSON.stringify({
        cmd: "com:proxy",
        channel: job,
        gw: pk_gw,
        sections: sections
      });
      this.ws.send(msg);
      this.sx += msg.length;
      this.ws_emit_event_sx();
    },
    ws_emit_event_state(state: string | TranslateResult) {
      store.commit("websocket/eventState", state);
    },
    ws_emit_event_rx() {
      store.commit("websocket/eventRx", this.rx);
    },
    ws_emit_event_sx() {
      store.commit("websocket/eventSx", this.sx);
    },
    ws_format_bytes(x: number | string | null) {
      const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      let l = 0;
      let n = parseInt("" + x, 10) || 0;
      while (n >= 1024 && ++l) {
        n = n / 1024;
      }
      if (n == 0) return "-";
      return n.toFixed(n >= 10 || l < 1 ? 0 : 1) + " " + units[l];
    },
    ws_state_name() {
      if (!this.ws) {
        return;
      }
      switch (this.ws.readyState) {
        case 0:
          return "CONNECTING";
        case 1:
          return "OPEN";
        case 2:
          return "CLOSING";
        case 3:
          return "CLOSED";
        default:
          break;
      }
      return "invalid socket state";
    },
    onTimer() {
      if (!this.ws_is_open()) {
        //  try to reconnect
        console.log("try reconnect: " + this.path);
        this.ws_open(this.path);
        // this.ws = new WebSocket(this.path, ["SMF"]);
        return;
      }
      this.ws_emit_event_state("online");
      //  restart timer
      // @ts-ignore
      this.timer = setTimeout(this.onTimer, 5000);
    },
    ws_is_open() {
      if (this.ws != null) {
        console.log(
          "websocket state: " +
            this.ws_state_name() +
            " / " +
            this.ws_format_bytes(this.rx) +
            " / " +
            this.ws_format_bytes(this.sx) +
            " / " +
            this.ws.url
        );
      }
      // console.log("compute WS state: " + this.ws.readyState);
      return this.ws != null && this.ws.readyState == 1;
    },
    ws_get_url() {
      if (this.ws != null) {
        const url = new URL(this.ws.url);
        return url.protocol + "//" + url.hostname + ":" + url.port;
      }
      return "no connection";
    }
  },
  computed: {}
});
