<template lang="html">
  <section class="smf-config-upload">
    <template>
      <div>
        <vue-headful
          title="smf :: config upload"
          description="SMF dashboard"
          keywords="SMF, solosTec"
        />
      </div>
    </template>

    <b-jumbotron
      fluid
      :header="$t('header-upload')"
      :lead="$t('lead-upload')"
    />

    <b-container fluid>
      <b-card-group columns>
        <b-card title="Upload Devices" class="shadow">
          <div slot="footer">
            <small class="text-muted"
              >{{ deviceCount }} device(s) configured</small
            >
          </div>
          <b-form @submit="onSubmitDevices" @reset="onResetDevices">
            <b-form-file
              v-model="dev.file"
              :state="Boolean(dev.file)"
              accept="application/xml, application/json"
              :placeholder="device_text"
              drop-placeholder="Drop file here..."
            >
            </b-form-file>

            <b-form-radio-group
              id="dev-upload-policy"
              v-model="dev.policy"
              name="dev-upload-policy"
              class="mt-3"
            >
              <b-form-radio value="append">Append</b-form-radio>
              <b-form-radio value="merge">Merge</b-form-radio>
              <b-form-radio value="subst">Overwrite</b-form-radio>
            </b-form-radio-group>

            <b-form-radio-group
              id="dev-upload-version"
              v-model="dev.version"
              name="dev-upload-version"
              class="mt-3"
            >
              <b-form-radio value="v3.2">Version 3.2</b-form-radio>
              <b-form-radio value="v4.0">Version 4.0</b-form-radio>
              <b-form-radio value="v0.9">Version 0.9</b-form-radio>
            </b-form-radio-group>
            <b-button
              :disabled="!Boolean(dev.file)"
              type="submit"
              variant="primary"
              class="mt-3 mr-3"
              >Start Upload &#8682;
            </b-button>
            <b-button type="reset" variant="danger" class="mt-3"
              >Reset
            </b-button>
          </b-form>
        </b-card>

        <b-card title="Upload Gateways" class="shadow">
          <div slot="footer">
            <small class="text-muted"
              >{{ gatewayCount }} gateway(s) configured</small
            >
          </div>
          <b-form @submit="onSubmitGateway" @reset="onResetGateway">
            <b-form-file
              v-model="gw.file"
              :state="Boolean(gw.file)"
              accept="application/xml, application/json"
              :placeholder="gateway_text"
              drop-placeholder="Drop file here..."
            >
            </b-form-file>
            <b-form-radio-group
              id="gw-upload-policy"
              v-model="gw.policy"
              name="gw-upload-policy"
              class="mt-3"
            >
              <b-form-radio value="append">Append</b-form-radio>
              <b-form-radio value="merge">Merge</b-form-radio>
              <b-form-radio value="subst">Overwrite</b-form-radio>
            </b-form-radio-group>
            <b-button
              :disabled="!Boolean(gw.file)"
              type="submit"
              variant="primary"
              class="mt-3 mr-3"
              >Start Upload &#8682;
            </b-button>
            <b-button type="reset" variant="danger" class="mt-3"
              >Reset
            </b-button>
          </b-form>
        </b-card>

        <b-card title="Upload Meter" class="shadow">
          <div slot="footer">
            <small class="text-muted"
              >{{ meterCount }} meter(s) configured</small
            >
          </div>
          <b-form @submit="onSubmitMeter" @reset="onResetMeter">
            <b-form-file
              v-model="meter.file"
              :state="Boolean(meter.file)"
              accept="application/xml, application/json"
              :placeholder="meter_text"
              drop-placeholder="Drop file here..."
            >
            </b-form-file>
            <b-form-radio-group
              id="meter-upload-policy"
              v-model="meter.policy"
              name="meter-upload-policy"
              class="mt-3"
            >
              <b-form-radio value="append">Append</b-form-radio>
              <b-form-radio value="merge">Merge</b-form-radio>
              <b-form-radio value="subst">Overwrite</b-form-radio>
            </b-form-radio-group>
            <b-button
              :disabled="!Boolean(meter.file)"
              type="submit"
              variant="primary"
              class="mt-3 mr-3"
              >Start Upload &#8682;
            </b-button>
            <b-button type="reset" variant="danger" class="mt-3"
              >Reset
            </b-button>
          </b-form>
        </b-card>

        <b-card title="Upload LoRa Devices" class="shadow">
          <div slot="footer">
            <small class="text-muted"
              >{{ LoRaCount }} LoRa devices(s) configured</small
            >
          </div>
          <b-form @submit="onSubmitLoRa" @reset="onResetLoRa">
            <b-form-file
              v-model="LoRa.file"
              :state="Boolean(LoRa.file)"
              accept="application/xml,application/json"
              :placeholder="lora_text"
              drop-placeholder="Drop file here..."
            >
            </b-form-file>
            <b-form-radio-group
              id="lora-upload-policy"
              v-model="LoRa.policy"
              name="lora-upload-policy"
              class="mt-3"
            >
              <b-form-radio value="append">Append</b-form-radio>
              <b-form-radio value="merge">Merge</b-form-radio>
              <b-form-radio value="subst">Overwrite</b-form-radio>
            </b-form-radio-group>
            <b-button
              :disabled="!Boolean(LoRa.file)"
              type="submit"
              variant="primary"
              class="mt-3 mr-3"
              >Start Upload &#8682;
            </b-button>
            <b-button type="reset" variant="danger" class="mt-3"
              >Reset
            </b-button>
          </b-form>
        </b-card>

        <b-card title="Upload Bridge Configuration" class="shadow">
          <div slot="footer">
            <small class="text-muted"
              >{{ BridgeCount }} meters(s) configured</small
            >
          </div>
          <b-form @submit="onSubmitIEC" @reset="onResetIEC">
            <b-form-file
              v-model="bridge.file"
              :state="Boolean(bridge.file)"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              :placeholder="iec_text"
              drop-placeholder="Drop file here..."
            >
            </b-form-file>
            <b-form-radio-group
              id="bridge-upload-policy"
              v-model="bridge.policy"
              name="bridge-upload-policy"
              class="mt-3"
            >
              <b-form-radio value="append">Append</b-form-radio>
              <b-form-radio value="merge">Merge</b-form-radio>
              <b-form-radio value="subst">Overwrite</b-form-radio>
              <b-form-radio
                value="delete"
                v-b-tooltip.hover
                title="Removes all specified meters"
                >Delete</b-form-radio
              >
            </b-form-radio-group>
            <b-button
              :disabled="!Boolean(bridge.file)"
              type="submit"
              variant="primary"
              class="mt-3 mr-3"
              >Start Upload &#8682;
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
import { Channel, Cmd, webSocket } from "@/mixins/web-socket";
import { hasPrivilegesWaitForUser } from "@/mixins/privileges";
import store from "../store";
import { MODULES, NO_ACCESS_ROUTE, PRIVILEGES } from "@/store/modules/user";
import mixins from "vue-typed-mixins";
import Vue from "vue";

const extraBackendPath =
  process.env.VUE_APP_SMF_DOCKER === "true" ? "/backend" : "";

export default mixins(webSocket, Vue).extend({
  name: "smfConfigUpload",
  props: [],
  mixins: [webSocket],

  mounted() {
    //   console.log("$http: "+ this.$http);
    this.ws_open("/smf/api/upload/v0.9");
  },

  data() {
    return {
      deviceCount: 0,
      gatewayCount: 0,
      meterCount: 0,
      LoRaCount: 0,
      BridgeCount: 0,
      dev: {
        file: null as any,
        policy: "append",
        version: "v0.9"
      },
      gw: {
        file: null as any,
        policy: "append"
      },
      meter: {
        file: null as any,
        policy: "append"
      },
      LoRa: {
        file: null as any,
        policy: "append"
      },
      bridge: {
        file: null as any,
        policy: "subst"
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
      this.ws_subscribe("table.bridge.count"); // TBridge
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
            } else if (obj.channel == "table.bridge.count") {
              this.BridgeCount = obj.value;
            }
          }
        }
      }
    },
    uploadData(
      file: File,
      channel: Channel,
      additionalInfo: object
    ): Promise<object> {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          const data = {
            fileName: file.name,
            fileContent: btoa(fileReader.result as string),
            ...additionalInfo
          };
          this.ws_submit_record(Cmd.insert, channel, {
            data
          });
          resolve(data);
        };
        fileReader.onerror = error => {
          console.error(error);
          reject(error);
        };
        fileReader.readAsBinaryString(file);
      });
    },
    onSubmitDevices(evt: Event) {
      evt.preventDefault();
      this.uploadData(this.dev.file, Channel.ConfigUploadDevices, {
        policy: this.dev.policy,
        version: this.dev.version
      })
        .then(() => {
          this.$toasted.global.sml_attention_ok(
            " Device configuration uploaded",
            "info"
          );
        })
        .finally(() => {
          this.onResetDevices(null);
        });
    },
    onResetDevices(evt: Event | null) {
      if (evt) {
        evt.preventDefault();
      }
      this.dev.file = null;
      this.dev.policy = "append";
      this.dev.version = "v0.9";
    },
    onSubmitGateway(evt: Event) {
      evt.preventDefault();
      this.uploadData(this.gw.file, Channel.ConfigUploadGateways, {
        policy: this.gw.policy
      })
        .then(() => {
          this.$toasted.global.sml_attention_ok(
            " Gateway configuration uploaded",
            "info"
          );
        })
        .finally(() => {
          this.onResetGateway(null);
        });
    },
    onResetGateway(evt: Event | null) {
      if (evt) {
        evt.preventDefault();
      }
      this.gw.file = null;
      this.gw.policy = "append";
    },
    onSubmitMeter(evt: Event) {
      evt.preventDefault();
      this.uploadData(this.meter.file, Channel.ConfigUploadMeters, {
        policy: this.meter.policy
      })
        .then(() => {
          this.$toasted.global.sml_attention_ok(
            " Meter configuration uploaded",
            "info"
          );
        })
        .finally(() => {
          this.onResetMeter(null);
        });
    },
    onResetMeter(evt: Event | null) {
      if (evt) {
        evt.preventDefault();
      }
      this.meter.file = null;
      this.meter.policy = "append";
    },
    onSubmitLoRa(evt: Event) {
      evt.preventDefault();
      this.uploadData(this.LoRa.file, Channel.ConfigUploadLoRa, {
        policy: this.LoRa.policy
      })
        .then(() => {
          this.$toasted.global.sml_attention_ok(
            " LoRa configuration uploaded",
            "info"
          );
        })
        .finally(() => {
          this.onResetLoRa(null);
        });
    },
    onResetLoRa(evt: Event | null) {
      if (evt) {
        evt.preventDefault();
      }
      this.LoRa.file = null;
      this.LoRa.policy = "append";
    },
    onSubmitIEC(evt: Event) {
      evt.preventDefault();
      this.uploadData(this.bridge.file, Channel.ConfigUploadBridge, {
        policy: this.bridge.policy
      })
        .then(() => {
          this.$toasted.global.sml_attention_ok(
            " Bridge configuration uploaded",
            "info"
          );
        })
        .finally(() => {
          this.onResetIEC(null);
        });
    },
    onResetIEC(evt: Event | null) {
      if (evt) {
        evt.preventDefault();
      }
      this.bridge.file = null;
      this.bridge.policy = "subst";
    }
  },

  computed: {
    device_text(): string {
      if (!this.dev.file) {
        return "Select a device configuration file...";
      }
      return (
        this.dev.file.name + " with " + this.dev.file.size + " bytes selected."
      );
    },
    gateway_text(): string {
      if (!this.gw.file) {
        return "Select a gateway configuration file...";
      }
      return (
        this.gw.file.name + " with " + this.gw.file.size + " bytes selected."
      );
    },
    meter_text(): string {
      if (!this.meter.file) {
        return "Select a meter configuration file...";
      }
      return (
        this.meter.file.name +
        " with " +
        this.meter.file.size +
        " bytes selected."
      );
    },
    lora_text(): string {
      if (!this.LoRa.file) {
        return "Select a LoRa configuration file...";
      }
      return (
        this.LoRa.file.name +
        " with " +
        this.LoRa.file.size +
        " bytes selected."
      );
    },
    iec_text(): string {
      if (!this.bridge.file) {
        return "Select a Bridge configuration file...";
      }
      return (
        this.bridge.file.name +
        " with " +
        this.bridge.file.size +
        " bytes selected."
      );
    }
  },
  beforeRouteEnter(to: any, from: any, next: any) {
    hasPrivilegesWaitForUser(
      store,
      MODULES.CONFOG_UPLOAD,
      PRIVILEGES.VIEW
    ).then(result => {
      next(result ? true : NO_ACCESS_ROUTE);
    });
  }
});
</script>

<style scoped lang="css"></style>
