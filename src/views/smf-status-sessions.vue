<template lang="html">
  <section class="smf-status-session">
    <template>
      <div>
        <vue-headful
          description="SMF dashboard"
          keywords="SMF, solosTec"
          title="smf :: status sessions"
        />
      </div>
    </template>

    <!-- <b-jumbotron fluid header="All subscribers that are online" :lead="sessions.length + ' sessions so far'"> -->
    <b-jumbotron
      :header="$t('header-status-session')"
      :lead="$t('lead-status-session', { count: this.sessions.length })"
      fluid
    >
      <b-progress :max="deviceCount" class="mt-2" height="1.2rem" show-value>
        <b-progress-bar :value="sessions.length" variant="success" />
        <b-progress-bar
          :value="deviceCount - sessions.length"
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
            store-key="sessions"
          />
        </b-col>
        <b-col md="4">
          <b-pagination
            v-model="currentPage"
            :per-page="perPage"
            :total-rows="sessions.length"
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
            ref="sessionTable"
            :busy="isBusy"
            :current-page="currentPage"
            :fields="fields"
            :filter="filter"
            :items="sessions"
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

            <template v-slot:cell(stop)="row">
              <b-button
                class="shadow"
                size="sm"
                variant="warning"
                @click="onSessionAction(row.item)"
                >Stop
              </b-button>
            </template>

            <!-- loading slot -->
            <div slot="table-busy" class="text-center text-danger">
              <strong>Loading... {{ busyLevel }}%</strong>
            </div>
          </b-table>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <b-form class="p-3 shadow" v-on:submit.prevent>
            <b-input-group class="pt-3">
              <b-button
                :disabled="!isRecordSelected"
                type="submit"
                variant="danger"
                v-on:click.stop="onSessionStop"
                >{{ btnStopTitle }}
              </b-button>
            </b-input-group>
          </b-form>
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

interface UiSession extends BTableItem {
  pk: string;
  name: string;
  loginTime?: Date;
  source: string;
  pLayer: string;
  dLayer: string;
  rx: number;
  sx: number;
  px: number;
  login: Date;
  lastSeen: Date;
}
let tmpSessions = [] as UiSession[];

export default mixins(webSocket, Vue).extend({
  name: "smfStatusSession",
  props: [],
  mixins: [webSocket],

  mounted() {
    this.ws_open("/smf/api/session/v0.8");
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
          key: "name",
          label: "Name",
          sortable: true
        },
        {
          key: "pLayer",
          label: "Transport",
          sortable: true
        },
        {
          key: "dLayer",
          label: "Data",
          sortable: true
        },
        {
          key: "rx",
          label: "RX",
          sortable: true,
          class: "text-right",
          formatter: (value: number) => this.ws_format_bytes(value)
        },
        {
          key: "sx",
          label: "SX",
          sortable: true,
          class: "text-right",
          formatter: (value: number) => this.ws_format_bytes(value)
        },
        {
          key: "px",
          label: "PX",
          sortable: true,
          class: "text-right",
          formatter: (value: number) => this.ws_format_bytes(value)
        },
        {
          key: "login",
          label: "Login",
          sortable: true
        },
        {
          key: "source",
          label: "Source",
          sortable: true,
          class: "text-right",
          formatter: (value: any) => value.toString().padStart(10, "0"),
          tdClass: "smfTTFont"
        },
        {
          key: "stop",
          label: "Action",
          class: "text-center"
        },
        {
          key: "lastSeen",
          label: "Last Activity",
          sortable: true,
          formatter: (value: any) => {
            return (
              ("00" + value.getUTCHours()).slice(-2) +
              ":" +
              ("00" + value.getUTCMinutes()).slice(-2) +
              ":" +
              ("00" + value.getUTCSeconds()).slice(-2)
            );
          },
          class: "text-right"
        }
      ],
      sessions: [] as UiSession[],
      selected: [] as UiSession[],
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
      this.sessions = [];
      this.ws_subscribe("status.session");
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
          const insertResponse = obj as WSInsertResponse<Session>;
          const bSession = insertResponse.rec.data;
          const loginTime = new Date(bSession.loginTime.substring(0, 19));
          const rec: UiSession = {
            pk: insertResponse.rec.key.tag as string,
            name: bSession.name,
            source: bSession.source,
            pLayer: bSession.pLayer,
            dLayer: bSession.dLayer,
            rx: bSession.rx,
            sx: bSession.sx,
            px: bSession.px,
            login: loginTime,
            lastSeen: loginTime
          };
          if (this.isBusy) {
            //  bulk insert
            tmpSessions.push(rec);
          } else {
            //  operational insert
            this.sessions.push(rec);
          }
        } else if (obj.cmd === Cmd.delete) {
          const idx = this.sessions.findIndex(
            rec => rec.pk == (obj as WSDeleteResponse).key[0]
          );
          console.log("delete index " + idx);
          this.sessions.splice(idx, 1);
        } else if (obj.cmd == Cmd.modify) {
          const modResponse = obj as WSModifyResponse<Session>;
          this.sessions.find(rec => {
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
          this.sessions = [];
        } else if (obj.cmd == Cmd.load) {
          const loadResponse = obj as WSLoadResponse;
          if (loadResponse.show != null) {
            this.isBusy = loadResponse.show;

            if (this.isBusy) {
              // reset the tmpSessions array if the initial upload starts
              tmpSessions = [];
            } else {
              // set the tmpSessions if the initial uploads is done
              this.sessions = tmpSessions;
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
    },
    onSessionStop() {
      this.selected.forEach(element => {
        this.ws_submit_key("stop", "status.session", [element.pk]);
      });
    },
    onSessionAction(item: any) {
      this.ws_submit_key("stop", "status.session", [item.pk]);
    }
  },

  computed: {
    isRecordSelected(): boolean {
      return this.selected.length != 0;
    },
    btnStopTitle(): string {
      if (this.selected.length == 0) {
        return "Stop";
      } else if (this.selected.length == 1) {
        return "Stop Session " + this.selected[0].name;
      }
      return "Stop " + this.selected.length + " Sessions";
    }
  },
  created() {
    this.tableRefreshInterval = setInterval(() => {
      // use forceUpdate instead of a refresh - this keeps the
      // table state (e.g. selected rows)
      (this.$refs.sessionTable as Vue).$forceUpdate();
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
