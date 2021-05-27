<template lang="html">
  <section class="smf-config-iec">
    <template>
      <div>
        <vue-headful
          description="SMF dashboard"
          keywords="SMF, solosTec"
          title="smf :: config IEC"
        />
      </div>
    </template>

    <b-jumbotron
      :header="$t('header-iec')"
      :lead="$t('lead-iec', { count: this.configs.length })"
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
        </b-col>
      </b-row>
    </b-container>
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
import { MeterIEC } from "@/api/meter-iec";
import { Converter } from "@/shared/converter";
import { SmfDialogService } from "@/shared/smf-dialog.service";
import SmfNewOrEditIecDialogDialog from "@/components/dialogs/smf-new-or-edit-iec-config.dialog.vue";
import covertTimeStampToDate = Converter.covertTimeStampToDate;

interface UiMeterIEC extends BTableItem {
  _name?: string;
  tag: string;
  meter: string;
  host: string;
  port: number;
  interval: string;
  lastSeen?: Date;
}

const fields = [
  {
    key: "meter",
    label: "Meter",
    sortable: true
  },
  {
    key: "host",
    label: "Host",
    sortable: true
  },
  {
    key: "port",
    label: "Port"
  },
  {
    key: "interval",
    label: "Interval",
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

let tmpConfigs: UiMeterIEC[] = [];

export default mixins(webSocket, Vue).extend({
  name: "smfConfigIec",
  props: [],
  components: {
    smfDataTable,
    smfTableEditButtons
  },
  mixins: [webSocket],
  mounted() {
    this.ws_open("/smf/api/iec/v0.8");
  },
  data() {
    return {
      isBusy: true,
      busyLevel: 0,
      fields,
      configs: [] as UiMeterIEC[],
      selected: [] as UiMeterIEC[]
    };
  },
  beforeDestroy() {
    this.ws_close();
  },
  methods: {
    ws_on_open() {
      this.configs = [];
      this.ws_subscribe(Channel.ConfigIec);
    },
    ws_on_data(obj: WSResponse) {
      console.log(obj);
      if (obj.cmd === Cmd.insert) {
        const insertResponse = obj as WSInsertResponse<MeterIEC>;
        const bIec = insertResponse.rec.data;
        const rec: UiMeterIEC = {
          tag: insertResponse.rec.key.tag as string,
          meter: bIec.meter,
          host: bIec.host != null ? bIec.host : "0.0.0.0",
          port: bIec.port != null ? bIec.port : 7009,
          interval: Converter.mapTimeStampToHHMMSS(bIec.interval),
          lastSeen: covertTimeStampToDate(bIec.lastSeen)
        };
        rec._name = this.deriveName(rec);

        if (this.isBusy) {
          tmpConfigs.push(rec);
        } else {
          this.configs.push(rec);
        }
      } else if (obj.cmd === Cmd.modify) {
        const modResponse = obj as WSModifyResponse<MeterIEC>;
        this.configs.forEach((rec: UiMeterIEC) => {
          if (rec.tag === modResponse.key[0]) {
            if (modResponse.value.interval) {
              rec.interval = Converter.mapTimeStampToHHMMSS(
                modResponse.value.interval
              );
            } else if (modResponse.value.lastSeen) {
              rec.lastSeen = covertTimeStampToDate(modResponse.value.lastSeen);
            } else {
              rec = Object.assign(rec, modResponse.value);
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
        "Update IEC Config",
        SmfNewOrEditIecDialogDialog,
        this.selected[0]
      );
      if (data) {
        this.ws_submit_record(Cmd.modify, Channel.ConfigIec, {
          key: [data.tag],
          data
        });
      }
    },
    async onExecuteConfigDelete() {
      this.selected.forEach(element => {
        this.ws_submit_key(Cmd.delete, Channel.ConfigIec, {
          tag: [element.tag]
        });
      });
    },
    async onConfigInsert() {
      const newConfig = await SmfDialogService.openFormDialog(
        this,
        "Add new IEC config",
        SmfNewOrEditIecDialogDialog,
        { host: "0.0.0.0", port: 7009, interval: "00:00:00" }
      );
      console.log(newConfig);
      if (newConfig) {
        this.ws_submit_record(Cmd.insert, Channel.ConfigIec, {
          key: [null],
          data: {
            ...newConfig
          }
        });
      }
    },
    deriveName(rec: UiMeterIEC) {
      return `${rec.meter}`;
    }
  },
  beforeRouteEnter(to: Route, from: Route, next: any) {
    hasPrivilegesWaitForUser(store, MODULES.CONFIG_IEC, PRIVILEGES.VIEW).then(
      result => {
        next(result ? true : NO_ACCESS_ROUTE);
      }
    );
  }
});
</script>
