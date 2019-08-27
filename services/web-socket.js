import { EventBus } from './event-bus.js'
//import msgTypes from '@/constants/msgTypes'

export const webSocket = {

    created() {
        // eslint-disable-next-line no-console
        console.log(this.$options.name + " created with env " + process.env.NODE_ENV);
    },

    mounted() {
        // eslint-disable-next-line no-console
        console.log(this.$options.name + " mounted");
    },

    data() {
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
        ws_open: function(path) {
            this.path = path;
            var self = this; //  save context
            if (process.env.NODE_ENV === 'production') {
                this.ws = new WebSocket('ws://' + location.host + path, ['SMF']);
            }
            else {
                this.ws = new WebSocket("ws://192.168.1.21:8082" + path, ["SMF"]);
            }
            this.ws.onopen = function() {
                //  subscribe system status
                // eslint-disable-next-line no-console
                console.log("websocket open: " + this.url);
                self.ws_on_open(this.url);
                self.state = self.$t('state-online');
                self.ws_emit_event_state(self.state);
            };
            this.ws.onmessage = function(e) {
                // console.log('websocket received data (' + e.data.length + ')');
                self.rx += e.data.length;
                self.ws_emit_event_rx();
                self.ws_on_data(JSON.parse(e.data));
            };
            this.ws.onclose = function(evt) {
                switch (evt.code) {
                    case 1000:
                        // eslint-disable-next-line no-console
                        console.log("websocket - normal closure: " + evt.code);
                        // self.ws_emit_event_state("normal closure");
                    break;
                    case 1001:
                        // eslint-disable-next-line no-console
                        console.log("websocket - going away: " + evt.code);
                        self.ws_emit_event_state("going away");
                    break;
                    case 1002:
                        // eslint-disable-next-line no-console
                        console.log("websocket - protocol error: " + evt.code);
                        self.ws_emit_event_state("protocol error");
                    break;
                    case 1003:
                        // eslint-disable-next-line no-console
                        console.log("websocket - unsupported data: " + evt.code);
                        self.ws_emit_event_state("unsupported data");
                    break;
                    case 1006:
                        // eslint-disable-next-line no-console
                        console.log("websocket - connection lost: ");
                        self.ws_emit_event_state("connection lost");
                        //  start timer to reconnect
                        self.onTimer();
                    break;
                    default:
                        // eslint-disable-next-line no-console
                        console.log("websocket closed: " + evt.code);
                        self.ws_emit_event_state(evt.code + " closed");
                    break;
                }
            };
            this.ws.onerror = function(err) {
                // eslint-disable-next-line no-console
                console.log("websocket error: " + err);
                self.ws_emit_event_state("error");
            };
        },

        //  close socket intentionally
        ws_close: function() {
            if (!this.ws_is_open()) return;

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
            this.state = this.$t('state-offline')
            this.ws_emit_event_state(this.state);
        },

        ws_subscribe(channel) {
            if (!this.ws_is_open()) return;
            var msg = JSON.stringify({
                cmd: "subscribe",
                channel: channel
            });
            this.ws.send(msg);
            this.sx += msg.length;
            this.ws_emit_event_sx();
        },
        ws_update(channel) {
            if (!this.ws_is_open()) return;
            var msg = JSON.stringify({
                cmd: "update",
                channel: channel
            });
            this.ws.send(msg);
            this.sx += msg.length;
            this.ws_emit_event_sx();
        },
        ws_submit_record(cmd, channel, rec) {
            if (!this.ws_is_open()) return;
            var msg = JSON.stringify({
                cmd: cmd,
                channel: channel,
                rec: rec
            });
            this.ws.send(msg);
            this.sx += msg.length;
            this.ws_emit_event_sx();
        },
        ws_submit_key(cmd, channel, key) {
            if (!this.ws_is_open()) return;
            var msg = JSON.stringify({
                cmd: cmd,
                channel: channel,
                key: key
            });
            this.ws.send(msg);
            this.sx += msg.length;
            this.ws_emit_event_sx();
        },
        ws_submit_command(cmd, channel, key, params, section) {
            if (!this.ws_is_open()) return;
            var msg = JSON.stringify({
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
        //  see: msgTypes.js
        //  root: OBIS code
        //  pk_gw: primary key of selected object (gateway, meter)
        //  pk_meter: primary key of selected object (gateway, meter)
        //  params: optional parameters
        //
        ws_submit_request(msgType, root, pk_gw, params = { params: null }) {
            if (!this.ws_is_open()) return;
            var msg = JSON.stringify({
                cmd: "com:sml",
                msgType: msgType,
                channel: root,
                gw: pk_gw,
                params
            });
            this.ws.send(msg);
            this.sx += msg.length;
            this.ws_emit_event_sx();
        },
        ws_emit_event_state(state) {
            EventBus.$emit("ws-state", state);
        },
        ws_emit_event_rx() {
            EventBus.$emit("ws-rx", this.rx);
        },
        ws_emit_event_sx() {
            EventBus.$emit("ws-sx", this.sx);
        },
        ws_format_bytes(x) {
            const units = [
                "bytes",
                "KB",
                "MB",
                "GB",
                "TB",
                "PB",
                "EB",
                "ZB",
                "YB"
            ];
            let l = 0;
            let n = parseInt(x, 10) || 0;
            while (n >= 1024 && ++l) {
                n = n / 1024;
            }
            if (n == 0) return "-";
            return n.toFixed(n >= 10 || l < 1 ? 0 : 1) + " " + units[l];
        },
        ws_state_name() {
            switch (this.ws.readyState) {
                case 0: return "CONNECTING";
                case 1: return "OPEN";
                case 2: return "CLOSING";
                case 3: return "CLOSED";
                default:
                    break;
            }
            return "invalid socket state";
        },
        onTimer() {
            if (!this.ws_is_open())    {
                //  try to reconnect
                // eslint-disable-next-line no-console
                console.log("try reconnect: " + this.path);
                this.ws_open(this.path);
                // this.ws = new WebSocket(this.path, ["SMF"]);
                return;
            }
            this.ws_emit_event_state("online");                
            //  restart timer
            this.timer = setTimeout(this.onTimer, 5000);
        },
        ws_is_open() {
            if (this.ws != null) {
                // eslint-disable-next-line no-console
                console.log("websocket state: " +
                    this.ws_state_name() +
                    " / " +
                    this.ws_format_bytes(this.rx) +
                    " / " +
                    this.ws_format_bytes(this.sx) +
                    " / " +
                    this.ws.url);
            }
            // console.log("compute WS state: " + this.ws.readyState);
            return (this.ws != null) && (this.ws.readyState == 1);
        },
        ws_get_url() {
            if (this.ws != null) {
                const url = new URL(this.ws.url);
                return url.protocol + '//' + url.hostname + ':' + url.port;
            }
            return "no connection";
        }
    },
    computed: {
    }
};
