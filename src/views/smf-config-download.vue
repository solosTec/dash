<template lang="html">
  <section class="smf-config-download">
    <template>
      <div>
        <vue-headful
          title="smf :: config download"
          description="SMF dashboard"
          keywords="SMF, solosTec"
        />
      </div>
    </template>

    <b-jumbotron
      fluid
      :header="$t('header-download')"
      :lead="$t('lead-download')"
    />

    <h2>Persistent Data</h2>
    <b-container fluid>
      <b-card-group columns>
        <b-card title="Download Devices" class="shadow">
          <div slot="footer">
            <small class="text-muted"
              >{{ deviceCount }} device(s) configured</small
            >
          </div>
          <b-form @submit="onSubmitDevices" @reset="onResetDevices">
            <b-form-radio-group
              id="dev-download-type"
              v-model="dev.fmt"
              name="smf-download-device-format"
              class="mt-3"
            >
              <b-form-radio value="XML">XML</b-form-radio>
              <b-form-radio value="JSON">JSON</b-form-radio>
              <b-form-radio value="CSV">CSV</b-form-radio>
            </b-form-radio-group>
            <b-form-radio-group
              v-model="dev.version"
              name="smf-download-config-device-version"
            >
              <b-form-radio :disabled="dev.fmt != 'XML'" value="v32"
                >Version 3.2
              </b-form-radio>
              <b-form-radio :disabled="dev.fmt != 'XML'" value="v40"
                >Version 4.0
              </b-form-radio>
              <b-form-radio :disabled="dev.fmt != 'XML'" value="v50"
                >Version 5.0
              </b-form-radio>
            </b-form-radio-group>
            <input
              type="hidden"
              id="smf-procedure"
              name="smf-procedure"
              value="cfg.download.devices"
            />
            <b-button
              type="submit"
              variant="primary"
              class="mt-3 mr-3"
              :disabled="deviceCount == 0"
              >Download &#8681;
            </b-button>
            <b-button type="reset" variant="danger" class="mt-3"
              >Reset
            </b-button>
          </b-form>
        </b-card>

        <b-card title="Download Gateways" class="shadow">
          <div slot="footer">
            <small class="text-muted"
              >{{ gatewayCount }} gateway(s) configured</small
            >
          </div>
          <b-form @submit="onSubmitGateways" @reset="onResetGateways">
            <b-form-radio-group
              id="gw-download-type"
              v-model="gw.fmt"
              name="gw-download-type"
              class="mt-3"
            >
              <b-form-radio value="XML">XML</b-form-radio>
              <b-form-radio value="JSON">JSON</b-form-radio>
              <b-form-radio value="CSV">CSV</b-form-radio>
            </b-form-radio-group>
            <b-button
              type="submit"
              variant="primary"
              class="mt-3 mr-3"
              :disabled="gatewayCount == 0"
              >Download &#8681;
            </b-button>
            <b-button type="reset" variant="danger" class="mt-3"
              >Reset
            </b-button>
          </b-form>
        </b-card>

        <b-card title="Download Meters" class="shadow">
          <div slot="footer">
            <small class="text-muted"
              >{{ meterCount }} meter(s) configured</small
            >
          </div>
          <b-form @submit="onSubmitMeters" @reset="onResetMeters">
            <b-form-radio-group
              id="meter-download-type"
              v-model="meter.fmt"
              name="meter-download-type"
              class="mt-3"
            >
              <b-form-radio value="XML">XML</b-form-radio>
              <b-form-radio value="JSON">JSON</b-form-radio>
              <b-form-radio value="CSV">CSV</b-form-radio>
            </b-form-radio-group>
            <b-button
              type="submit"
              variant="primary"
              class="mt-3 mr-3"
              :disabled="meterCount == 0"
              >Download &#8681;
            </b-button>
            <b-button type="reset" variant="danger" class="mt-3"
              >Reset
            </b-button>
          </b-form>
        </b-card>

        <b-card title="Download LoRa Devices" class="shadow">
          <div slot="footer">
            <small class="text-muted"
              >{{ LoRaCount }} LoRa devices(s) configured</small
            >
          </div>
          <b-form @submit="onSubmitLoRa" @reset="onResetLoRa">
            <b-form-radio-group
              id="meter-download-type"
              v-model="LoRa.fmt"
              name="LoRa-download-type"
              class="mt-3"
            >
              <b-form-radio value="XML">XML</b-form-radio>
              <b-form-radio value="JSON">JSON</b-form-radio>
              <b-form-radio value="CSV">CSV</b-form-radio>
            </b-form-radio-group>
            <b-form-radio-group
              id="LoRa-download-type"
              v-model="LoRa.vendor"
              name="LoRa-vendor-type"
            >
              <b-form-radio value="actility">Actility</b-form-radio>
              <b-form-radio value="swisscom">Swisscom</b-form-radio>
              <b-form-radio value="sigfox">SigFox</b-form-radio>
            </b-form-radio-group>
            <b-button
              type="submit"
              variant="primary"
              class="mt-3 mr-3"
              :disabled="LoRaCount == 0"
              >Download &#8681;
            </b-button>
            <b-button type="reset" variant="danger" class="mt-3"
              >Reset
            </b-button>
          </b-form>
        </b-card>

        <b-card title="Download IEC meters" class="shadow">
          <div slot="footer">
            <small class="text-muted">{{ iecCount }} meter available</small>
          </div>
          <b-form @submit="onSubmitIEC" @reset="onResetIEC">
            <b-form-radio-group
              id="msg-uplink-type"
              v-model="iec.fmt"
              name="iec-download-type"
              class="mt-3"
            >
              <b-form-radio value="XML">XML</b-form-radio>
              <b-form-radio value="JSON">JSON</b-form-radio>
              <b-form-radio value="CSV">CSV</b-form-radio>
            </b-form-radio-group>
            <b-button
              type="submit"
              variant="primary"
              class="mt-3 mr-3"
              :disabled="iecCount == 0"
              >Download &#8681;
            </b-button>
            <b-button type="reset" variant="danger" class="mt-3"
              >Reset
            </b-button>
          </b-form>
        </b-card>

        <b-card title="Download wM-Bus meters" class="shadow">
          <div slot="footer">
            <small class="text-muted">{{ wmBusCount }} meter available</small>
          </div>
          <b-form @submit="onSubmitwMBus" @reset="onResetwMBus">
            <b-form-radio-group
              id="wMBus-uplink-type"
              v-model="wMBus.fmt"
              name="wMBus-download-type"
              class="mt-3"
            >
              <b-form-radio value="XML">XML</b-form-radio>
              <b-form-radio value="JSON">JSON</b-form-radio>
              <b-form-radio value="CSV">CSV</b-form-radio>
            </b-form-radio-group>
            <b-button
              type="submit"
              variant="primary"
              class="mt-3 mr-3"
              :disabled="wmBusCount == 0"
              >Download &#8681;
            </b-button>
            <b-button type="reset" variant="danger" class="mt-3"
              >Reset
            </b-button>
          </b-form>
        </b-card>
      </b-card-group>
    </b-container>
    <h2>Temporary Data</h2>
    <b-container fluid>
      <b-card-group columns>
        <b-card title="Download LoRa uplink records" class="shadow">
          <div slot="footer">
            <small class="text-muted"
              >{{ LoRaUplinkCount }} uplink records available</small
            >
          </div>
          <b-form @submit="onSubmitUplink" @reset="onResetUplink">
            <b-form-radio-group
              id="LoRa-uplink-type"
              v-model="uplinkLoRa.fmt"
              name="uplinkLoRa-download-type"
              class="mt-3"
            >
              <b-form-radio value="XML">XML</b-form-radio>
              <b-form-radio value="JSON">JSON</b-form-radio>
              <b-form-radio value="CSV">CSV</b-form-radio>
            </b-form-radio-group>
            <b-button
              type="submit"
              variant="primary"
              class="mt-3 mr-3"
              :disabled="LoRaUplinkCount == 0"
              >Download &#8681;
            </b-button>
            <b-button type="reset" variant="danger" class="mt-3"
              >Reset
            </b-button>
          </b-form>
        </b-card>
        <b-card title="Download IEC uplink records" class="shadow">
          <div slot="footer">
            <small class="text-muted"
              >{{ iecUplinkCount }} uplink records available</small
            >
          </div>
          <b-form @submit="onSubmitIecUplink" @reset="onResetIecUplink">
            <b-form-radio-group
              id="IEC-uplink-type"
              v-model="uplinkIec.fmt"
              name="IEC-download-type"
              class="mt-3"
            >
              <b-form-radio value="XML">XML</b-form-radio>
              <b-form-radio value="JSON">JSON</b-form-radio>
              <b-form-radio value="CSV">CSV</b-form-radio>
            </b-form-radio-group>
            <b-button
              type="submit"
              variant="primary"
              class="mt-3 mr-3"
              :disabled="iecUplinkCount == 0"
              >Download &#8681;
            </b-button>
            <b-button type="reset" variant="danger" class="mt-3"
              >Reset
            </b-button>
          </b-form>
        </b-card>
        <b-card title="Download wM-Bus uplink records" class="shadow">
          <div slot="footer">
            <small class="text-muted"
              >{{ wmBusUplinkCount }} uplink records available</small
            >
          </div>
          <b-form @submit="onSubmitwMBusUplink" @reset="onResetwMBusUplink">
            <b-form-radio-group
              id="wMBus-uplink-type"
              v-model="uplinkwMBus.fmt"
              name="wMBus-download-type"
              class="mt-3"
            >
              <b-form-radio value="XML">XML</b-form-radio>
              <b-form-radio value="JSON">JSON</b-form-radio>
              <b-form-radio value="CSV">CSV</b-form-radio>
            </b-form-radio-group>
            <b-button
              type="submit"
              variant="primary"
              class="mt-3 mr-3"
              :disabled="wmBusUplinkCount == 0"
              >Download &#8681;
            </b-button>
            <b-button type="reset" variant="danger" class="mt-3"
              >Reset
            </b-button>
          </b-form>
        </b-card>
        <b-card title="Download System Messages" class="shadow">
          <div slot="footer">
            <small class="text-muted">{{ msgCount }} messages available</small>
          </div>
          <b-form @submit="onSubmitMsg" @reset="onResetMsg">
            <b-form-radio-group
              id="msg-uplink-type"
              v-model="msg.fmt"
              name="msg-download-type"
              class="mt-3"
            >
              <b-form-radio value="XML">XML</b-form-radio>
              <b-form-radio value="JSON">JSON</b-form-radio>
              <b-form-radio value="CSV">CSV</b-form-radio>
            </b-form-radio-group>
            <b-button
              type="submit"
              variant="primary"
              class="mt-3 mr-3"
              :disabled="msgCount == 0"
              >Download &#8681;
            </b-button>
            <b-button type="reset" variant="danger" class="mt-3"
              >Reset
            </b-button>
          </b-form>
        </b-card>
        <b-card title="Download IEC gateway status" class="shadow">
          <div slot="footer">
            <small class="text-muted"
              >{{ gwIECCount }} gateways configured</small
            >
          </div>
          <b-form @submit="onSubmitgwIEC" @reset="onResetgwIEC">
            <b-form-radio-group
              id="gwIEC-uplink-type"
              v-model="gwIEC.fmt"
              name="gwIEC-download-type"
              class="mt-3"
            >
              <b-form-radio value="XML">XML</b-form-radio>
              <b-form-radio value="JSON">JSON</b-form-radio>
              <b-form-radio value="CSV">CSV</b-form-radio>
            </b-form-radio-group>
            <b-button
              type="submit"
              variant="primary"
              class="mt-3 mr-3"
              :disabled="gwIECCount == 0"
              >Download &#8681;
            </b-button>
            <b-button type="reset" variant="danger" class="mt-3"
              >Reset
            </b-button>
          </b-form>
        </b-card>
      </b-card-group>
    </b-container>
  </section>
</template>

<script lang="ts">
import { webSocket } from "@/mixins/web-socket";
import { hasPrivilegesWaitForUser } from "@/mixins/privileges";
import store from "../store";
import { MODULES, NO_ACCESS_ROUTE, PRIVILEGES } from "@/store/modules/user";
import Vue from "vue";
import mixins from "vue-typed-mixins";

const extraBackendPath =
  process.env.VUE_APP_SMF_DOCKER === "true" ? "/backend" : "";

export default mixins(webSocket, Vue).extend({
  name: "smfConfigDownload",
  props: [],
  mixins: [webSocket],

  mounted() {
    this.ws_open("/smf/api/download/v0.8");
  },

  data() {
    return {
      deviceCount: 0,
      gatewayCount: 0,
      meterCount: 0,
      LoRaCount: 0,
      LoRaUplinkCount: 0,
      msgCount: 0,
      iecCount: 0,
      wmBusCount: 0,
      iecUplinkCount: 0,
      wmBusUplinkCount: 0,
      gwIECCount: 0,
      dev: {
        type: "dev",
        fmt: "JSON",
        version: "v50"
      },
      gw: {
        type: "gw",
        fmt: "JSON"
      },
      meter: {
        type: "meter",
        fmt: "JSON"
      },
      LoRa: {
        type: "LoRa",
        fmt: "JSON",
        vendor: "swisscom"
      },
      uplinkLoRa: {
        type: "uplinkLoRa",
        fmt: "JSON"
      },
      msg: {
        type: "msg",
        fmt: "JSON"
      },
      iec: {
        type: "iec",
        fmt: "JSON"
      },
      wMBus: {
        type: "wMBus",
        fmt: "JSON"
      },
      uplinkIec: {
        type: "uplinkIec",
        fmt: "JSON"
      },
      uplinkwMBus: {
        type: "uplinkwMBus",
        fmt: "JSON"
      },
      gwIEC: {
        type: "gwIEC",
        fmt: "JSON"
      }
    };
  },

  beforeDestroy() {
    this.ws_close();
  },

  methods: {
    ws_on_open() {
      this.ws_subscribe("table.device.count");
      this.ws_subscribe("table.gateway.count");
      this.ws_subscribe("table.meter.count");
      this.ws_subscribe("table.msg.count");
      this.ws_subscribe("table.LoRa.count");
      this.ws_subscribe("table.loRaUplink.count");
      this.ws_subscribe("table.iec.count");
      this.ws_subscribe("table.wmbus.count");
      this.ws_subscribe("table.wMBusUplink.count");
      this.ws_subscribe("table.IECUplink.count");
      this.ws_subscribe("table.gwIEC.count");
    },
    ws_on_data(obj: any) {
      if (obj.cmd != null) {
        console.log("websocket received " + obj.cmd);
        if (obj.cmd == "update") {
          if (obj.channel != null) {
            if (obj.channel == "table.device.count") {
              this.deviceCount = obj.value;
            } else if (obj.channel == "table.gateway.count") {
              this.gatewayCount = obj.value;
            } else if (obj.channel == "table.meter.count") {
              this.meterCount = obj.value;
            } else if (obj.channel == "table.LoRa.count") {
              this.LoRaCount = obj.value;
            } else if (obj.channel == "table.loRaUplink.count") {
              this.LoRaUplinkCount = obj.value;
            } else if (obj.channel == "table.msg.count") {
              this.msgCount = obj.value;
            } else if (obj.channel == "table.iec.count") {
              this.iecCount = obj.value;
            } else if (obj.channel == "table.wmbus.count") {
              this.wmBusCount = obj.value;
            } else if (obj.channel == "table.IECUplink.count") {
              this.iecUplinkCount = obj.value;
            } else if (obj.channel == "table.wMBusUplink.count") {
              this.wmBusUplinkCount = obj.value;
            } else if (obj.channel == "table.gwIEC.count") {
              this.gwIECCount = obj.value;
            }
          }
        }
      }
    },
    onSubmitDevices(evt: Event) {
      evt.preventDefault();
      // alert(JSON.stringify(this.dev))
      //var formData = new FormData();
      //formData.append("smf-download-device-format", "XML");
      //formData.append("smf-download-config-device-version", "v0.5");
      //formData.append("smf-procedure", "cfg.download.devices");
      this.$http
        .post(`${extraBackendPath}/download.devices`, this.dev, {
          headers: {
            Accept: "application/xml,application/json,application/csv,*/*"
          },
          // @ts-ignore
          responseType: "blob",
          progress(e) {
            if (e.lengthComputable) {
              console.log((e.loaded / e.total) * 100);
            }
          }
        })
        .then(
          (res: any) => {
            this.saveOrOpenBlob(
              res.body,
              "devices." + this.dev.fmt.toLowerCase()
            );
          },
          (res: any) => {
            console.log("error: " + res);
          }
        );
    },
    onResetDevices(evt: Event) {
      evt.preventDefault();
      this.dev.type = "JSON";
      this.dev.version = "v50";
    },
    onSubmitGateways(evt: Event) {
      evt.preventDefault();
      //alert(JSON.stringify(this.gw))
      //var formData = new FormData();
      //formData.append("smf-download-gw-format", "XML");
      //formData.append("smf-procedure", "cfg.download.gateways");

      //this.$http.post("${extraBackendPath}/config.download.html", formData, {
      //const self = this;
      this.$http
        .post(`${extraBackendPath}/download.gateways`, this.gw, {
          headers: {
            Accept: "application/xml, application/json, application/csv, */*"
            //'Access-Control-Request-Headers': 'x-requested-with'
          },
          // @ts-ignore
          responseType: "blob",
          progress(e) {
            if (e.lengthComputable) {
              console.log((e.loaded / e.total) * 100 + "%");
            }
          }
        })
        .then(
          (res: any) => {
            //console.log("response: " + res)
            //console.log("response-body: " + res.body)
            this.saveOrOpenBlob(
              res.body,
              "gateways." + this.gw.fmt.toLowerCase()
            );
          },
          (res: any) => {
            console.log("error: " + res);
          }
        );
    },
    onResetGateways(evt: Event) {
      evt.preventDefault();
      this.gw.type = "JSON";
    },
    onSubmitMeters(evt: Event) {
      evt.preventDefault();
      this.$http
        .post(`${extraBackendPath}/download.meters`, this.meter, {
          headers: {
            Accept: "application/xml, application/json, application/csv, */*"
          },
          // @ts-ignore
          responseType: "blob",
          progress(e) {
            if (e.lengthComputable) {
              console.log((e.loaded / e.total) * 100);
            }
          }
        })
        .then(
          (res: any) => {
            //console.log("response: " + res)
            //console.log("response-body: " + res.body)
            this.saveOrOpenBlob(
              res.body,
              "meter." + this.meter.fmt.toLowerCase()
            );
          },
          (res: any) => {
            console.log("error: " + res);
          }
        );
    },
    onResetMeters(evt: Event) {
      evt.preventDefault();
      this.meter.type = "JSON";
    },
    onSubmitLoRa(evt: Event) {
      evt.preventDefault();
      //alert(JSON.stringify(this.LoRa))
      this.$http
        .post(`${extraBackendPath}/download.LoRa`, this.LoRa, {
          headers: {
            Accept: "application/xml, application/json, application/csv, */*"
          },
          // @ts-ignore
          responseType: "blob",
          progress(e) {
            if (e.lengthComputable) {
              console.log((e.loaded / e.total) * 100);
            }
          }
        })
        .then(
          (res: any) => {
            this.saveOrOpenBlob(
              res.body,
              "LoRa." + this.LoRa.fmt.toLowerCase()
            );
          },
          (res: any) => {
            console.log("error: " + res);
          }
        );
    },
    onResetLoRa(evt: Event) {
      evt.preventDefault();
      this.LoRa.type = "JSON";
      this.LoRa.vendor = "swisscom";
    },
    onSubmitUplink(evt: Event) {
      evt.preventDefault();
      //alert(JSON.stringify(this.uplinkLoRa))
      this.$http
        .post(`${extraBackendPath}/download.uplinkLoRa`, this.uplinkLoRa, {
          headers: {
            Accept: "application/xml, application/json, application/csv, */*"
          },
          // @ts-ignore
          responseType: "blob",
          progress(e) {
            if (e.lengthComputable) {
              console.log((e.loaded / e.total) * 100);
            }
          }
        })
        .then(
          (res: any) => {
            this.saveOrOpenBlob(
              res.body,
              "uplinkLoRa." + this.uplinkLoRa.fmt.toLowerCase()
            );
          },
          (res: any) => {
            console.log("error: " + res);
          }
        );
    },
    onResetUplink(evt: Event) {
      evt.preventDefault();
      this.uplinkLoRa.type = "JSON";
    },
    onSubmitMsg(evt: Event) {
      evt.preventDefault();
      //alert(JSON.stringify(this.msg))
      this.$http
        .post(`${extraBackendPath}/download.messages`, this.msg, {
          headers: {
            Accept: "application/xml, application/json, application/csv, */*"
          },
          // @ts-ignore
          responseType: "blob",
          progress(e) {
            if (e.lengthComputable) {
              console.log((e.loaded / e.total) * 100);
            }
          }
        })
        .then(
          (res: any) => {
            this.saveOrOpenBlob(
              res.body,
              "messages." + this.msg.fmt.toLowerCase()
            );
          },
          (res: any) => {
            console.log("error: " + res);
          }
        );
    },
    onResetMsg(evt: Event) {
      evt.preventDefault();
      this.msg.type = "JSON";
    },
    onSubmitIEC(evt: Event) {
      evt.preventDefault();
      //alert(JSON.stringify(this.msg))
      this.$http
        .post(`${extraBackendPath}/download.iec`, this.iec, {
          headers: {
            Accept: "application/xml, application/json, application/csv, */*"
          },
          // @ts-ignore
          responseType: "blob",
          progress(e) {
            if (e.lengthComputable) {
              console.log((e.loaded / e.total) * 100);
            }
          }
        })
        .then(
          (res: any) => {
            this.saveOrOpenBlob(res.body, "iec." + this.iec.fmt.toLowerCase());
          },
          (res: any) => {
            console.log("error: " + res);
          }
        );
    },
    onResetIEC(evt: Event) {
      evt.preventDefault();
      this.msg.type = "JSON";
    },
    onSubmitwMBus(evt: Event) {
      evt.preventDefault();
      //alert(JSON.stringify(this.msg))
      this.$http
        .post(`${extraBackendPath}/download.wMBus`, this.wMBus, {
          headers: {
            Accept: "application/xml, application/json, application/csv, */*"
          },
          // @ts-ignore
          responseType: "blob",
          progress(e) {
            if (e.lengthComputable) {
              console.log((e.loaded / e.total) * 100);
            }
          }
        })
        .then(
          (res: any) => {
            this.saveOrOpenBlob(
              res.body,
              "wMBus." + this.wMBus.fmt.toLowerCase()
            );
          },
          (res: any) => {
            console.log("error: " + res);
          }
        );
    },
    onResetwMBus(evt: Event) {
      evt.preventDefault();
      this.msg.type = "JSON";
    },
    onSubmitIecUplink(evt: Event) {
      evt.preventDefault();
      //alert(JSON.stringify(this.msg))
      this.$http
        .post(`${extraBackendPath}/download.IECUplink`, this.uplinkIec, {
          headers: {
            Accept: "application/xml, application/json, application/csv, */*"
          },
          // @ts-ignore
          responseType: "blob",
          progress(e) {
            if (e.lengthComputable) {
              console.log((e.loaded / e.total) * 100);
            }
          }
        })
        .then(
          (res: any) => {
            this.saveOrOpenBlob(
              res.body,
              "IECUplink." + this.uplinkIec.fmt.toLowerCase()
            );
          },
          (res: any) => {
            console.log("error: " + res);
          }
        );
    },
    onResetIecUplink(evt: Event) {
      evt.preventDefault();
      this.msg.type = "JSON";
    },
    onSubmitwMBusUplink(evt: Event) {
      evt.preventDefault();
      //alert(JSON.stringify(this.msg))
      this.$http
        .post(`${extraBackendPath}/download.wMBusUplink`, this.uplinkwMBus, {
          headers: {
            Accept: "application/xml, application/json, application/csv, */*"
          },
          // @ts-ignore
          responseType: "blob",
          progress(e) {
            if (e.lengthComputable) {
              console.log((e.loaded / e.total) * 100);
            }
          }
        })
        .then(
          (res: any) => {
            this.saveOrOpenBlob(
              res.body,
              "wMBusUplink." + this.uplinkwMBus.fmt.toLowerCase()
            );
          },
          (res: any) => {
            console.log("error: " + res);
          }
        );
    },
    onResetwMBusUplink(evt: Event) {
      evt.preventDefault();
      this.msg.type = "JSON";
    },

    onSubmitgwIEC(evt: Event) {
      evt.preventDefault();
      //alert(JSON.stringify(this.msg))
      this.$http
        .post(`${extraBackendPath}/download.gwIEC`, this.gwIEC, {
          headers: {
            Accept: "application/xml, application/json, application/csv, */*"
          },
          // @ts-ignore
          responseType: "blob",
          progress(e) {
            if (e.lengthComputable) {
              console.log((e.loaded / e.total) * 100);
            }
          }
        })
        .then(
          (res: any) => {
            this.saveOrOpenBlob(
              res.body,
              "gwIEC." + this.uplinkwMBus.fmt.toLowerCase()
            );
          },
          (res: any) => {
            console.log("error: " + res);
          }
        );
    },
    onResetgwIEC(evt: Event) {
      evt.preventDefault();
      this.msg.type = "JSON";
    },
    saveOrOpenBlob(blob: Blob, fileName: string) {
      var a = document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.download = fileName;
      a.dispatchEvent(new MouseEvent("click"));
    }
  },
  async beforeRouteEnter(to: any, from: any, next: any) {
    const result = await hasPrivilegesWaitForUser(
      store,
      MODULES.CONFIG_DOWNLOAD,
      PRIVILEGES.VIEW
    );
    next(result ? true : NO_ACCESS_ROUTE);
  }
});
</script>

<style scoped lang="scss">
.smf-config-download {
  background-color: #e9ecef;

  h2 {
    padding-left: 17px;
  }

  .container-fluid {
    padding-top: 15px;
    background-color: white;
  }
}
</style>
