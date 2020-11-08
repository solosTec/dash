<template lang="html">
  <section class="smf-config-bridge">
    <template>
      <div>
        <vue-headful
          title="smf :: config Bridges"
          description="SMF dashboard"
          keywords="SMF, solosTec"
        />
      </div>
    </template>

    <b-jumbotron
      fluid
      :header="$t('header-bridge')"
      :lead="$t('lead-bridge', { count: this.items.length })"
    />

    <b-container fluid>
      <b-row>
        <b-col md="9">
          <tblIEC
            ref="IEC"
            :items="items"
            :nav="nav"
            v-model="selected"
            @rowSelected="rowSelected"
            class="p-3 shadow"
          />
        </b-col>
        <b-col md="3">
          <b-form v-on:submit.prevent class="p-3 shadow">
            <b-form-group
              :label="$t('config-bridge-02')"
              :description="$t('config-bridge-01')"
              label-cols-sm="4"
              label-cols-lg="3"
            >
              <b-input-group>
                <b-form-input
                  id="smf-form-iec-address"
                  type="text"
                  v-model="form.address"
                  required
                  placeholder="<IP address (dotted)>"
                  minlength="7"
                  maxlength="15"
                  size="15"
                />
                <b-form-input
                  id="smf-form-iec-service"
                  type="number"
                  v-model="form.port"
                  required
                />
              </b-input-group>
            </b-form-group>

            <b-form-group
              :label="$t('config-bridge-03')"
              :description="$t('config-bridge-06')"
              label-cols-sm="4"
              label-cols-lg="3"
            >
              <b-form-radio-group
                id="smf-form-iec-direction"
                v-model="form.direction"
                name="smf-form-iec-direction"
              >
                <b-form-radio
                  value="in"
                  v-b-popover.hover="
                    'The TCP/IP connection will be established by the meter device.'
                  "
                  title="Incoming connection"
                  >{{ $t("config-bridge-05") }}</b-form-radio
                >
                <b-form-radio
                  value="out"
                  v-b-popover.hover="
                    'The TCP/IP connection will be established by the IEC node.'
                  "
                  title="Outgoing connection"
                  >{{ $t("config-bridge-04") }}</b-form-radio
                >
              </b-form-radio-group>
            </b-form-group>

            <b-form-group
              :label="$t('config-bridge-07')"
              :description="$t('config-bridge-08')"
              label-cols-sm="4"
              label-cols-lg="3"
            >
              <b-form-input
                id="smf-form-iec-interval"
                type="text"
                v-model="form.interval"
                v-mask="'##:##:##'"
                required
                placeholder="<readout interval>"
                maxlength="64"
              />
            </b-form-group>

            <b-form-group
              :description="btnUpdateTitle"
              label-cols-sm="4"
              label-cols-lg="3"
            >
              <b-input-group class="pt-1">
                <b-button
                  type="submit"
                  variant="primary"
                  :disabled="updateDisabled"
                  v-on:click.stop="onMeterUpdate"
                >
                  {{ $t("action-update") }}
                </b-button>
              </b-input-group>
            </b-form-group>

            <b-form-group
              :description="btnDeleteTitle"
              label-cols-sm="4"
              label-cols-lg="3"
            >
              <b-input-group class="pt-3">
                <b-button
                  type="submit"
                  variant="danger"
                  :disabled="!isRecordSelected"
                  v-on:click.stop="onMeterDelete"
                  >{{ $t("action-remove") }}</b-button
                >
              </b-input-group>
            </b-form-group>
          </b-form>
          <b-form v-on:submit.prevent class="p-3 shadow">
            <b-form-group
              description="Remove orphaned entries"
              label-cols-sm="4"
              label-cols-lg="3"
            >
              <b-input-group class="pt-3">
                <b-button
                  type="submit"
                  variant="warning"
                  v-on:click.stop="onIECCleanup"
                  >Cleanup
                </b-button>
              </b-input-group>
            </b-form-group>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script lang="ts">
import { webSocket, Channel, Cmd } from "@/mixins/web-socket";
import tblIEC from "@/components/smf-table-iec.vue";
import mixins from "vue-typed-mixins";
import Vue from "vue";

import { TranslateResult } from "vue-i18n";

interface UiMeter {
  pk: string;
  meter: string;
  address: string;
  port: number;
  direction: string;
  interval: string;
}

export default mixins(webSocket, Vue).extend({
  name: "smfConfigGateway",
  props: [],
  mixins: [webSocket],
  components: {
    tblIEC
  },

  mounted() {
    this.ws_open("/smf/api/iec/v0.8");
  },

  data() {
    return {
      items: [] as UiMeter[],
      selected: [] as UiMeter[],
      nav: {
        currentPage: 1,
        visibleRows: 0,
        perPage: 5,
        isBusy: false,
        busyLevel: 0,
        filter: null
      },
      form: {
        pk: "",
        meter: "",
        address: "0.0.0.0",
        port: 7009,
        direction: "out",
        interval: "00:01:00"
      }
    };
  },
  beforeDestroy() {
    this.ws_close();
  },

  methods: {
    ws_on_open() {
      this.items = [];
      this.ws_subscribe("config.bridge");
      this.ws_subscribe("table.bidge.count");
    },
    cmd_load(channel: string, show: boolean, level: number) {
      this.nav.busyLevel = level;
      if (show != null) this.nav.isBusy = show;
    },
    cmd_insert(channel: string, key: any, data: any) {
      if (channel == "config.iec") {
        let rec: UiMeter = {
          pk: key.pk,
          meter: data.meter,
          address: data.address !== null ? data.address : "0.0.0.0",
          port: data.port !== null ? data.port : 7009,
          interval: data.interval,
          direction: data.direction ? "out" : "in"
        };
        this.items.push(rec);
      }
    },
    cmd_update(channel: string, cmd: string, value: any) {
      console.log("update", channel, cmd, value);
    },
    cmd_modify(channel: string, pk: any, value: any) {
      if (channel == "config.iec") {
        this.items.some((rec: UiMeter) => {
          //console.log(rec.pk, pk);
          if (rec.pk === pk) {
            console.log("value: ", value);
            if (value.port != null) {
              rec.port = value.port;
            } else if (value.meter != null) {
              rec.meter = value.meter;
            } else if (value.address != null) {
              rec.address = value.address;
            } else if (value.interval != null) {
              rec.interval = value.interval;
            } else if (value.direction != null) {
              rec.direction = value.direction;
            }
            return true; //  break
          }
        });
      }
    },
    cmd_delete(channel: string, pk: any) {
      if (channel == "config.iec") {
        const idx = this.items.findIndex(rec => rec.pk === pk);
        this.items.splice(idx, 1);
      }
    },
    ws_on_data(obj: any) {
      if (obj.cmd != null) {
        console.log("websocket received ", obj);
        switch (obj.cmd) {
          case "load":
            this.cmd_load(obj.channel, obj.show, obj.level);
            break;
          case "insert":
            this.cmd_insert(obj.channel, obj.rec.key, obj.rec.data);
            break;
          case "update":
            this.cmd_update(obj.channel, obj.cmd, obj.value);
            break;
          case "modify":
            this.cmd_modify(obj.channel, obj.key[0], obj.value);
            break;
          case "delete":
            this.cmd_delete(obj.channel, obj.key[0]);
            break;
          default:
            console.warn("undefined cmd ", obj);
            break;
        }
      }
    },
    onMeterUpdate(event: Event) {
      event.preventDefault();
      this.ws_submit_record("modify", "config.iec", {
        key: [this.form.pk],
        data: {
          pk: this.form.pk,
          address: this.form.address,
          port: this.form.port,
          direction: Boolean(this.form.direction == "out"),
          interval: this.form.interval
        }
      });
    },
    onMeterDelete(event: Event) {
      event.preventDefault();
      console.log("insert");
      this.ws_submit_record("remove", "config.iec", {
        key: [this.form.pk],
        data: {
          pk: this.form.pk,
          address: this.form.address
        }
      });
    },
    onMeterInsert(event: Event) {
      event.preventDefault();
      this.ws_submit_record("insert", "config.iec", {
        key: [this.form.pk],
        data: {
          address: this.form.address,
          port: this.form.port,
          direction: Boolean(this.form.direction == "out"),
          interval: this.form.interval
        }
      });
    },
    onIECCleanup(event: Event) {
      event.preventDefault();
      this.ws_submit_record(Cmd.cleanup, Channel.ConfigIEC, {
        type: "orphaned"
      });
    },
    rowSelected(items: UiMeter[]): void {
      this.selected = items;
      if (items.length > 0) {
        this.form.pk = items[0].pk;
        this.form.meter = items[0].meter;
        this.form.address = items[0].address;
        this.form.port = items[0].port;
        this.form.direction = items[0].direction ? "out" : "in";
        this.form.interval = items[0].interval;
      } else {
        // console.log('nothing selected');
        this.form.pk = "";
        this.form.meter = "";
        this.form.address = "0.0.0.0";
        this.form.port = 7009;
        this.form.direction = "out";
        this.form.interval = "00:01:0.0";
      }
    }
  },

  computed: {
    updateDisabled(): boolean {
      const regexTime = /\d{2}:\d{2}:\d{2}/;
      return !this.isRecordSelected || !regexTime.test(this.form.interval);
    },
    isRecordSelected(): boolean {
      return this.selected.length != 0;
    },
    btnInsertTitle(): string | TranslateResult {
      return this.$t("action-insert") + " " + this.form.meter;
    },
    btnDeleteTitle(): string | TranslateResult {
      if (this.selected.length === 0) {
        return this.$t("action-remove");
      } else if (this.selected.length === 1) {
        return this.$t("action-remove") + " " + this.selected[0].meter;
      }
      return (
        this.$t("action-remove") + " " + this.selected.length + " record(s)"
      );
    },
    btnUpdateTitle(): string | TranslateResult {
      if (this.selected.length > 0) {
        return this.$t("action-update") + " " + this.selected[0].meter;
      }
      return this.$t("action-update");
    }
  },

  watch: {
    items: {
      immediate: true,
      handler(newItems) {
        this.nav.visibleRows = (newItems || []).length;
      }
    }
  }
});
</script>

<style scoped lang="css"></style>
