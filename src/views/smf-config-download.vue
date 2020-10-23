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
                >Version 3.2</b-form-radio
              >
              <b-form-radio :disabled="dev.fmt != 'XML'" value="v40"
                >Version 4.0</b-form-radio
              >
              <b-form-radio :disabled="dev.fmt != 'XML'" value="v50"
                >Version 5.0</b-form-radio
              >
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
              >Download &#8681;</b-button
            >
            <b-button type="reset" variant="danger" class="mt-3"
              >Reset</b-button
            >
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
              >Download &#8681;</b-button
            >
            <b-button type="reset" variant="danger" class="mt-3"
              >Reset</b-button
            >
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
              >Download &#8681;</b-button
            >
            <b-button type="reset" variant="danger" class="mt-3"
              >Reset</b-button
            >
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
              >Download &#8681;</b-button
            >
            <b-button type="reset" variant="danger" class="mt-3"
              >Reset</b-button
            >
          </b-form>
        </b-card>

        <b-card title="Download LoRa uplink records" class="shadow">
          <div slot="footer">
            <small class="text-muted"
              >{{ uplinkCount }} uplink records available</small
            >
          </div>
          <b-form @submit="onSubmitUplink" @reset="onResetUplink">
            <b-form-radio-group
              id="meter-uplink-type"
              v-model="uplink.fmt"
              name="uplink-download-type"
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
              :disabled="uplinkCount == 0"
              >Download &#8681;</b-button
            >
            <b-button type="reset" variant="danger" class="mt-3"
              >Reset</b-button
            >
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
              >Download &#8681;</b-button
            >
            <b-button type="reset" variant="danger" class="mt-3"
              >Reset</b-button
            >
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
      uplinkCount: 0,
      msgCount: 0,
      dev: {
        type: "dev",
        fmt: "XML",
        version: "v50"
      },
      gw: {
        type: "gw",
        fmt: "XML"
      },
      meter: {
        type: "meter",
        fmt: "XML"
      },
      LoRa: {
        type: "LoRa",
        fmt: "XML",
        vendor: "swisscom"
      },
      uplink: {
        type: "uplink",
        fmt: "XML"
      },
      msg: {
        type: "msg",
        fmt: "XML"
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
      this.ws_subscribe("table.uplink.count");
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
            } else if (obj.channel == "table.uplink.count") {
              this.uplinkCount = obj.value;
            } else if (obj.channel == "table.msg.count") {
              this.msgCount = obj.value;
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
      this.dev.type = "XML";
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
      this.gw.type = "XML";
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
      this.meter.type = "XML";
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
      this.LoRa.type = "XML";
      this.LoRa.vendor = "swisscom";
    },
    onSubmitUplink(evt: Event) {
      evt.preventDefault();
      //alert(JSON.stringify(this.uplink))
      this.$http
        .post(`${extraBackendPath}/download.uplink`, this.uplink, {
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
              "uplink." + this.uplink.fmt.toLowerCase()
            );
          },
          (res: any) => {
            console.log("error: " + res);
          }
        );
    },
    onResetUplink(evt: Event) {
      evt.preventDefault();
      this.uplink.type = "XML";
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
      this.msg.type = "XML";
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

<style scoped lang="css"></style>
