<template lang="html">
  <section class="smf-config-wmbus">
    <template>
      <div>
        <vue-headful
          description="SMF dashboard"
          keywords="SMF, solosTec"
          title="smf :: config WMBus"
        />
      </div>
    </template>

    <b-jumbotron
      :header="$t('header-wmbus')"
      :lead="$t('lead-wmbus', { count: this.configs.length })"
      fluid
    />

    <b-container fluid>
      <b-row>
        <b-col md="12">
          <smf-data-table
            :busyLevel="busyLevel"
            :fields="fields"
            :items="configs"
            tableName="configs"
            @itemSelected="selected = $event"
          >
            <template v-slot:editButtons>
              <smf-table-edit-buttons
                :selectedItems="selected"
                @onUpdate="onConfigUpdate"
                @onExecuteDelete="onExecuteConfigDelete"
                @onInsert="onConfigInsert"
              ></smf-table-edit-buttons>
            </template>
          </smf-data-table>
        </b-col> </b-row
    ></b-container>
  </section>
</template>
<script lang="ts">
import {
  Channel,
  Cmd,
  webSocket,
  WSDeleteResponse,
  WSInsertResponse,
  WSLoadResponse,
  WSModifyResponse,
  WSResponse
} from "@/mixins/web-socket";
import smfDataTable from "@/components/smf-data-table.vue";
import smfTableEditButtons from "@/components/smf-table-edit-buttons.vue";
import mixins from "vue-typed-mixins";
import Vue from "vue";
import { Route } from "vue-router";
import { hasPrivilegesWaitForUser } from "@/mixins/privileges";
import store from "@/store";
import { MODULES, NO_ACCESS_ROUTE, PRIVILEGES } from "@/store/modules/user";
import { BTableItem } from "@/shared/b-table-item";
import { DialogMode, SmfDialogService } from "@/shared/smf-dialog.service";
import SmfNewOrEditWmBusDialogDialog from "@/components/dialogs/smf-new-or-edit-wm-bus-config.dialog.vue";
import { MeterWMBus } from "@/api/meter-wm-bus";
import { Converter } from "@/shared/converter";
import covertTimeStampToDate = Converter.covertTimeStampToDate;

interface UiMeterWMBus extends BTableItem {
  _name?: string;
  tag: string;
  meter: string;
  address: string;
  port: number;
  aes: string;
  lastSeen?: Date;
}

const fields = [
  {
    key: "meter",
    label: "Meter",
    sortable: true
  },
  {
    key: "address",
    label: "Address",
    sortable: true
  },
  {
    key: "port",
    label: "Port"
  },
  {
    key: "aes",
    label: "AES",
    sortable: true
  },
  {
    key: "lastSeen",
    label: "Last Seen",
    formatter: (value: any) => {
      return value == null ? "" : value.toLocaleString();
    },
    sortable: true
  }
];

let tmpConfigs: UiMeterWMBus[] = [];

export default mixins(webSocket, Vue).extend({
  name: "smfConfigWMBus",
  props: [],
  components: {
    smfDataTable,
    smfTableEditButtons
  },
  mixins: [webSocket],
  mounted() {
    this.ws_open("/smf/api/wmbus/v0.8");
  },
  data() {
    return {
      isBusy: true,
      busyLevel: 0,
      fields,
      configs: [] as UiMeterWMBus[],
      selected: [] as UiMeterWMBus[]
    };
  },
  beforeDestroy() {
    this.ws_close();
  },
  methods: {
    ws_on_open() {
      this.configs = [];
      this.ws_subscribe(Channel.ConfigWMBus);
    },
    ws_on_data(obj: WSResponse) {
      if (obj.cmd === Cmd.insert) {
        const insertResponse = obj as WSInsertResponse<MeterWMBus>;
        const bWmBus = insertResponse.rec.data;
        const rec: UiMeterWMBus = {
          tag: insertResponse.rec.key.tag as string,
          meter: bWmBus.meter,
          address: bWmBus.address != null ? bWmBus.address : "0.0.0.0",
          port: bWmBus.port != null ? bWmBus.port : 7009,
          aes: bWmBus.aes,
          lastSeen: covertTimeStampToDate(bWmBus.lastSeen)
        };
        rec._name = this.deriveName(rec);

        if (this.isBusy) {
          tmpConfigs.push(rec);
        } else {
          this.configs.push(rec);
        }
      } else if (obj.cmd === Cmd.modify) {
        const modResponse = obj as WSModifyResponse<MeterWMBus>;
        this.configs.forEach((rec: UiMeterWMBus) => {
          if (rec.tag === modResponse.key[0]) {
            if (!modResponse.value.lastSeen) {
              rec = Object.assign(rec, modResponse.value);
            } else {
              rec.lastSeen = covertTimeStampToDate(modResponse.value.lastSeen);
            }
            rec._name = this.deriveName(rec);
          }
        });
      } else if (obj.cmd === Cmd.clear) {
        this.configs = [];
      } else if (obj.cmd === Cmd.delete) {
        const key = (obj as WSDeleteResponse).key[0];
        this.configs = this.configs.filter(d => d.tag !== key);
      } else if (obj.cmd === Cmd.load) {
        const loadResponse = obj as WSLoadResponse;
        if (loadResponse.hasOwnProperty("show")) {
          this.isBusy = loadResponse.show;

          if (this.isBusy) {
            tmpConfigs = [];
          } else {
            this.configs = tmpConfigs;
            this.busyLevel = 100;
          }
        }
        if (loadResponse.hasOwnProperty("level")) {
          this.busyLevel = loadResponse.level;
        }
      }
    },
    async onConfigUpdate() {
      const data = await SmfDialogService.openFormDialog(
        this,
        "Update wM-Bus Config",
        SmfNewOrEditWmBusDialogDialog,
        this.selected[0],
        DialogMode.UPDATE
      );
      if (data) {
        this.ws_submit_record(Cmd.modify, Channel.ConfigWMBus, {
          key: [data.tag],
          data
        });
      }
    },
    async onExecuteConfigDelete() {
      this.selected.forEach(element => {
        this.ws_submit_key(Cmd.delete, Channel.ConfigWMBus, {
          tag: [element.tag]
        });
      });
    },
    async onConfigInsert() {
      const newConfig = await SmfDialogService.openFormDialog(
        this,
        "Add new wM-Bus config",
        SmfNewOrEditWmBusDialogDialog,
        { address: "0.0.0.0", port: 7009 },
        DialogMode.ADD
      );
      console.log(newConfig);
      if (newConfig) {
        this.ws_submit_record(Cmd.insert, Channel.ConfigWMBus, {
          key: [null],
          data: {
            ...newConfig
          }
        });
      }
    },
    deriveName(rec: UiMeterWMBus) {
      return `${rec.meter}`;
    }
  },
  beforeRouteEnter(to: Route, from: Route, next: any) {
    hasPrivilegesWaitForUser(store, MODULES.CONFIG_WMBUS, PRIVILEGES.VIEW).then(
      result => {
        next(result ? true : NO_ACCESS_ROUTE);
      }
    );
  }
});
</script>
