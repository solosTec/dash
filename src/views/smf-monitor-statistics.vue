<template lang="html">
  <section class="smf-monitor-statistics">
    <template>
      <div>
        <vue-headful
          description="SMF dashboard"
          keywords="SMF, solosTec"
          title="smf :: statistics"
        />
      </div>
    </template>

    <!-- <b-jumbotron fluid header="All subscribers that are online" :lead="statistics.length + ' statistics so far'"> -->
    <b-jumbotron
      :header="$t('header-monitor-statistics')"
      :lead="$t('lead-monitor-statistics', { count: this.statistics.length })"
      fluid
    >
      <b-progress :max="deviceCount" class="mt-2" height="1.2rem" show-value>
        <b-progress-bar :value="statistics.length" variant="success" />
        <b-progress-bar
          :value="deviceCount - statistics.length"
          variant="warning"
        />
      </b-progress>
    </b-jumbotron>

    <b-container fluid>
      <b-row>
        <b-col md="4">
          <b-form-group
            :label="$t('tbl-filter')"
            class="mb-0"
            label-align-sm="right"
            label-cols-sm="3"
            label-size="sm"
          >
            <b-input-group size="sm">
              <b-form-input v-model="filter" :placeholder="$t('tbl-search')" />
              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''"
                  >{{ $t("action-clear") }}
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="4">
          <smf-row-count-selector
            v-model="perPage"
            class="col"
            store-key="statistics"
          />
        </b-col>
        <b-col md="4">
          <b-pagination
            v-model="currentPage"
            :per-page="perPage"
            :total-rows="statistics.length"
            align="fill"
            class="justify-content-end"
            size="sm"
          />
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <!-- table -->
          <b-table
            ref="statisticsTable"
            :busy="isBusy"
            :current-page="currentPage"
            :fields="fields"
            :filter="filter"
            :items="statistics"
            :per-page="perPage"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            bordered
            class="shadow"
            hover
            primary-key="pk"
            select-mode="range"
            selectable
            selectedVariant="info"
            show-empty
            small
            stacked="md"
            striped
            @row-selected="rowSelected"
          >
            <!-- A virtual column -->
            <template v-slot:cell(index)="data">
              {{ data.index + 1 + perPage * (currentPage - 1) }}
            </template>

            <template v-slot:cell(login)="row">
              <div
                v-b-tooltip.hover
                :title="row.item.login | fmtChronographWithDateTime"
              >
                {{ row.item.login | fmtChronographRelative($i18n.locale) }}
              </div>
            </template>

            <!-- loading slot -->
            <div slot="table-busy" class="text-center text-danger">
              <strong>Loading... {{ busyLevel }}%</strong>
            </div>
          </b-table>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script lang="ts">
import {
  Cmd,
  webSocket,
  WSDeleteResponse,
  WSInsertResponse,
  WSLoadResponse,
  WSModifyResponse,
  WSResponse
} from "@/mixins/web-socket";
import { hasPrivilegesWaitForUser } from "@/mixins/privileges";
import store from "../store";
import { MODULES, NO_ACCESS_ROUTE, PRIVILEGES } from "@/store/modules/user";
import mixins from "vue-typed-mixins";
import Vue from "vue";
import { TableChronographRefreshInSeconds } from "../constants/global-config";
import { Session } from "@/api/session";
import { BTableItem } from "@/shared/b-table-item";

interface UiStatistics extends BTableItem {
  pk: string;
  name: string;
  initial?: Date;
  lastLogin: Date;
  loginCounter: number;
}
let tmpStatistics = [] as UiStatistics[];

export default mixins(webSocket, Vue).extend({
  name: "smfMonitorStatistics",
  props: [],
  mixins: [webSocket],

  mounted() {
    this.ws_open("/smf/api/statistics/v0.9");
  },

  data() {
    return {
      isBusy: false,
      busyLevel: 0,
      currentPage: 1,
      perPage: 10,
      fields: [
        {
          key: "index",
          class: "text-right small text-muted"
        },
        //  UUID
        {
          key: "pk",
          label: "Key",
          sortable: true
        },
        {
          key: "initial",
          label: "Initial",
          sortable: true
        },
        {
          key: "lastLogin",
          label: "Last Login",
          sortable: true
        },
        {
          key: "loginCounter",
          label: "Login Counter",
          sortable: true,
          class: "text-right"
        }
      ],
      // ToDo: define UiStatistics
      statistics: [] as UiStatistics[],
      selected: [] as UiStatistics[],
      sortBy: "name",
      sortDesc: false,
      sortDirection: "desc",
      filter: null as null | string,
      visibleRows: 0,
      deviceCount: 0,
      tableRefreshInterval: 0 as any
    };
  },

  beforeDestroy() {
    this.ws_close();
    clearInterval(this.tableRefreshInterval);
  },

  methods: {
    ws_on_open() {
      //  clear table
      this.statistics = [];
      this.ws_subscribe("config.statistics");
      this.ws_subscribe("table.device.count");
    },
    ws_on_data(obj: WSResponse) {
      if (obj.cmd) {
        console.log(
          this.$options.name +
            " websocket received " +
            obj.cmd +
            " / " +
            obj.channel
        );
        if (obj.cmd == Cmd.insert) {
          // {"cmd": "insert", "channel": "monitor.statistics",
          //  "rec":
          //  { "key": { "tag": "a835c092-c479-4237-aae4-02e597eff01c" },
          //  "data": { "gen": 15, "initial": null, "lastLogin": "2023-03-01 18:35:56", "loginCounter": 12 }
          const insertResponse = obj as WSInsertResponse<Session>;
          const bSession = insertResponse.rec.data;
          const loginTime = new Date(bSession.loginTime);
          const rec: UiStatistics = {
            pk: insertResponse.rec.key.tag as string,
            name: bSession.name,
            initial: bSession.initial,
            lastLogin: bSession.lastLogin,
            loginCounter: bSession.loginCounter
          };
          if (this.isBusy) {
            //  bulk insert
            tmpStatistics.push(rec);
          } else {
            //  operational insert
            this.statistics.push(rec);
          }
        } else if (obj.cmd === Cmd.delete) {
          const idx = this.statistics.findIndex(
            rec => rec.pk == (obj as WSDeleteResponse).key[0]
          );
          console.log("delete index " + idx);
          this.statistics.splice(idx, 1);
        } else if (obj.cmd == Cmd.modify) {
          const modResponse = obj as WSModifyResponse<Session>;
          this.statistics.find(rec => {
            if (rec.pk == modResponse.key[0]) {
              // console.log('modify record ' + rec.name);
              if (modResponse.value.rx != null) {
                rec.rx = modResponse.value.rx;
              } else if (modResponse.value.sx != null) {
                rec.sx = modResponse.value.sx;
              } else if (modResponse.value.px != null) {
                rec.px = modResponse.value.px;
              }
              //  update activity
              rec.lastSeen = new Date();
            }
          });
        } else if (obj.cmd == Cmd.clear) {
          this.statistics = [];
        } else if (obj.cmd == Cmd.load) {
          const loadResponse = obj as WSLoadResponse;
          if (loadResponse.show != null) {
            this.isBusy = loadResponse.show;

            if (this.isBusy) {
              // reset the tmpStatistics array if the initial upload starts
              tmpStatistics = [];
            } else {
              // set the tmpStatistics if the initial uploads is done
              this.statistics = tmpStatistics;
            }
          } else if (loadResponse.level != 0) {
            this.busyLevel = loadResponse.level;
          }
        } else if (obj.cmd === Cmd.update) {
          // TODO@ms check if WsUpdateResponse matches the response
          if (obj.channel != null) {
            console.log("update channel " + obj.channel);
            if (obj.channel == "table.device.count") {
              this.deviceCount = (obj as any).value;
            }
          }
        }
      }
    },
    rowSelected(items: any[]) {
      this.selected = items;
    }
  },

  computed: {
    isRecordSelected(): boolean {
      return this.selected.length != 0;
    }
  },
  created() {
    this.tableRefreshInterval = setInterval(() => {
      // use forceUpdate instead of a refresh - this keeps the
      // table state (e.g. selected rows)
      (this.$refs.statisticsTable as Vue).$forceUpdate();
    }, TableChronographRefreshInSeconds * 1000);
  },
  beforeRouteEnter(to: any, from: any, next: any) {
    hasPrivilegesWaitForUser(
      store,
      MODULES.STATUS_SESSION,
      PRIVILEGES.VIEW
    ).then(result => {
      next(result ? true : NO_ACCESS_ROUTE);
    });
  }
});
</script>

<style lang="css">
.smfTTFont {
  /* serif saves os from a samller font size */
  font-family: monospace, serif;
}
</style>
