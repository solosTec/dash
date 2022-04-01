<template lang="html">
  <section class="smf-monitor-iec-gw">
    <template>
      <div>
        <vue-headful
          title="smf :: monitor IEC gw"
          description="SMF dashboard"
          keywords="SMF, solosTec"
        />
      </div>
    </template>

    <!-- <b-jumbotron fluid header="System Status" :lead="nodes.length + ' nodes online'" /> -->
    <b-jumbotron
      fluid
      :header="$t('header-monitor-iec-gw')"
      :lead="$t('lead-monitor-iec-gw', { count: this.gateways.length })"
    />

    <b-container fluid>
      <b-row>
        <b-col md="4"></b-col>
        <b-col md="4">
          <b-form-row>
            <smf-row-count-selector
              v-model="perPage"
              store-key="iecGatewayStatus"
              class="col"
            />
          </b-form-row>
        </b-col>
        <b-col md="4">
          <b-pagination
            v-model="currentPage"
            :total-rows="gateways.length"
            :per-page="perPage"
            class="justify-content-end"
            align="fill"
            size="sm"
          />
        </b-col>
      </b-row>
      <div class="edit-buttons">
        <b-button
          :disabled="selected.length === 0"
          type="button"
          variant="primary"
          v-on:click.stop="onUpdate"
          >{{ btnUpdateTitle }}
        </b-button>
      </div>
      <b-row>
        <b-col md="12">
          <b-table
            ref="sysTable"
            bordered
            striped
            small
            hover
            show-empty
            stacked="md"
            selectable
            select-mode="range"
            selectedVariant="info"
            @row-selected="rowSelected"
            :fields="fields"
            :items="gateways"
            :busy="isBusy"
            primary-key="key"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            :current-page="currentPage"
            :per-page="perPage"
            class="shadow"
          >
            <!-- A virtual column -->
            <template v-slot:cell(index)="data"> {{ data.index + 1 }}</template>

            <template #cell(state)="data">
              <span v-html="data.value"></span>
            </template>

            <!-- loading slot -->
            <div slot="table-busy" class="text-center text-danger">
              <strong>Loading... {{ busyLevel }}%</strong>
            </div>

            <template v-slot:cell(details)="data">
              <b-button
                variant="outline"
                style="margin-left: 5px"
                v-if="data.item.units && data.item.units.length > 0"
                size="sm"
                @click="data.toggleDetails"
              >
                <b-icon-zoom-in v-if="!data.detailsShowing"></b-icon-zoom-in>
                <b-icon-zoom-out v-if="data.detailsShowing"></b-icon-zoom-out>
              </b-button>
            </template>

            <template #row-details="row">
              <div v-if="row.item.units && row.item.units.length > 0">
                <ul class="unit-list">
                  <template v-for="unit in row.item.units">
                    <li :key="unit">{{ unit }}</li>
                  </template>
                </ul>
              </div>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script lang="ts">
import { Channel, Cmd, webSocket } from "@/mixins/web-socket";
import { mapState } from "vuex";
import { hasPrivilegesWaitForUser } from "@/mixins/privileges";
import store, { AppState } from "../store";
import { MODULES, NO_ACCESS_ROUTE, PRIVILEGES } from "@/store/modules/user";
import mixins from "vue-typed-mixins";
import Vue from "vue";
import { TranslateResult } from "vue-i18n";
import { DialogMode, SmfDialogService } from "@/shared/smf-dialog.service";
import SmfNewOrEditIecDialogDialog from "@/components/dialogs/smf-new-or-edit-iec-config.dialog.vue";

export default mixins(webSocket, Vue).extend({
  name: "smfMonitorIECgw",
  props: [],
  mixins: [webSocket],
  mounted() {
    this.ws_open("/smf/api/iecgw/v0.9");
  },
  data() {
    return {
      msgCount: 0,
      isBusy: false,
      busyLevel: 0,
      currentPage: 1,
      perPage: 10,
      fields: [
        {
          key: "index",
          class: "text-right small text-muted"
        },
        {
          key: "host",
          label: "Host",
          sortable: true
        },
        {
          key: "port",
          label: "Port",
          sortable: true
        },
        {
          key: "meterCounter",
          label: "Meters",
          sortable: true,
          class: "text-right"
        },
        {
          key: "connectCounter",
          label: "Connects",
          sortable: true,
          class: "text-right"
        },
        {
          key: "failureCounter",
          label: "Unreachable",
          sortable: true,
          class: "text-right"
        },
        {
          key: "rate",
          label: "Availability",
          sortable: true,
          formatter: (value: number) => {
            return value.toFixed(2) + " %";
          },
          class: "text-right"
        },
        {
          key: "state",
          label: "State",
          formatter: (value: any) => {
            switch (value) {
              case 0:
                return "offline";
              case 1:
                return "&#9203; <b>waiting</b>";
              case 2:
                return "&#9889; <em>online</em>";
              case 3:
                return "&#9208; <em>reconnect</em>";
              default:
                break;
            }
            return value;
          },
          sortable: true
        },
        {
          key: "interval",
          label: "Interval",
          formatter: (value: string) => {
            //    00:14:0.000000
            return value.substr(0, 9);
          },
          sortable: true
        },
        {
          key: "meter",
          label: "Nr",
          formatter: (value: any) => {
            return value + 1;
          },
          class: "text-right"
        },
        {
          key: "id",
          label: "Meter"
        },
        {
          key: "lastSeen",
          label: "Last Update",
          formatter: (value: any) => {
            return value == null ? "" : value.toLocaleString();
          },
          sortable: true
        },
        {
          key: "details",
          label: "",
          class: "details-cell"
        }
      ],
      gateways: [] as any[],
      sortBy: "class",
      sortDesc: false,
      sortDirection: "desc",
      selected: [] as any[]
    };
  },

  beforeDestroy() {
    this.ws_close();
  },

  methods: {
    rowSelected(items: any) {
      this.selected = items;
    },

    ws_on_open() {
      //  clear table
      this.gateways = [];

      this.ws_subscribe("status.IECgw");
      this.ws_subscribe("table.gwIEC.count");
    },

    calculate_availability(connectCounter: number, failureCounter: number) {
      return connectCounter == 0
        ? 0
        : 100 - (100 * failureCounter) / connectCounter;
    },
    ws_on_data(obj: any) {
      if (obj.cmd != null) {
        console.log(
          this.$options.name +
            " websocket received " +
            obj.cmd +
            " [" +
            obj.channel +
            "]"
        );
        if (obj.cmd == "update") {
          if (obj.channel != null) {
            //console.log('update channel ' + obj.channel + ": " + obj.value);
            if (obj.channel == "table.gwIEC.count") {
              //  unused yet
            } else {
              console.error("update - unknown channel: " + obj.channel);
            }
          }
        } else if (obj.cmd == "insert") {
          if (obj.channel == "status.IECgw") {
            const rec = {
              tag: obj.rec.key.tag,
              host: obj.rec.data.host,
              port: obj.rec.data.port,
              meterCounter: obj.rec.data.meterCounter,
              connectCounter: obj.rec.data.connectCounter,
              failureCounter: obj.rec.data.failureCounter,
              rate: this.calculate_availability(
                obj.rec.data.connectCounter,
                obj.rec.data.failureCounter
              ),
              meter: obj.rec.data.index,
              id: obj.rec.data.meter,
              state: obj.rec.data.state,
              interval: obj.rec.data.interval,
              lastSeen: new Date(),
              units: obj.rec.data.units,
              _showDetails: false
            };
            this.gateways.push(rec);
          }
        } else if (obj.cmd == "clear") {
          //  clear table
          this.gateways = [];
        } else if (obj.cmd == "delete") {
          // console.log('lookup node ' + obj.key);
          const idx = this.gateways.findIndex(rec => rec.tag == obj.key[0]);
          // console.log('delete index ' + idx);
          this.gateways.splice(idx, 1);
        } else if (obj.cmd == "modify") {
          if (obj.channel == "status.IECgw") {
            const self = this;
            this.gateways.find(function(rec) {
              if (rec.tag == obj.key[0]) {
                console.log("modify record " + rec.tag);
                if (obj.value.meterCounter != null) {
                  rec.meterCounter = obj.value.meterCounter;
                } else if (obj.value.connectCounter != null) {
                  rec.connectCounter = obj.value.connectCounter;
                } else if (obj.value.failureCounter != null) {
                  rec.failureCounter = obj.value.failureCounter;
                } else if (obj.value.index != null) {
                  rec.meter = obj.value.index;
                } else if (obj.value.meter != null) {
                  rec.id = obj.value.meter;
                } else if (obj.value.interval != null) {
                  rec.interval = obj.value.interval;
                } else if (obj.value.host != null) {
                  rec.host = obj.value.host;
                } else if (obj.value.port != null) {
                  rec.port = obj.value.port;
                } else if (obj.value.state != null) {
                  rec.state = obj.value.state;
                  switch (rec.state) {
                    case 0:
                      rec["_rowVariant"] = null;
                      break;
                    case 1:
                      rec["_rowVariant"] = "warning";
                      break;
                    case 2:
                      rec["_rowVariant"] = "success";
                      rec.lastSeen = new Date();
                      break;
                    default:
                      break;
                  }
                }
                rec.rate = self.calculate_availability(
                  rec.connectCounter,
                  rec.failureCounter
                );
              }
            });
          } else {
            console.error("modify - unknown channel: " + obj.channel);
          }
        } else if (obj.cmd == "load") {
          //  load status
          if (obj.show != null) {
            // console.log('load state ' + obj.show);
            this.isBusy = obj.show;
          } else if (obj.level != 0) {
            this.busyLevel = obj.level;
          }
        }
      }
    },
    async onUpdate() {
      const data = await SmfDialogService.openFormDialog(
        this,
        "Update IEC Config",
        SmfNewOrEditIecDialogDialog,
        this.selected[0],
        DialogMode.UPDATE
      );
      if (data) {
        console.log(data);
        this.ws_submit_record(Cmd.modify, Channel.ConfigGwIec, {
          key: [data.tag],
          data: {
            host: data.host,
            port: data.port,
            meter: data.id,
            interval: data.interval
          }
        });
      }
    }
  },
  computed: {
    tableCaption(): string {
      return "Showing " + this.gateways.length + " IEC gateways";
    },

    btnUpdateTitle(): string | TranslateResult {
      if (this.selected.length > 0) {
        return `${this.$t("action-update")} ${this.selected[0].host ||
          this.selected[0].host}`;
      }
      return this.$t("action-update");
    },
    ...mapState({
      totalIoFormatted: function(state: AppState) {
        return this.ws_format_bytes(state.websocket.sx + state.websocket.rx);
      },
      received: function(state: AppState) {
        return this.ws_format_bytes(state.websocket.rx);
      },
      send: function(state: AppState) {
        return this.ws_format_bytes(state.websocket.sx);
      }
    })
  },
  beforeRouteEnter(to: any, from: any, next: any) {
    hasPrivilegesWaitForUser(
      store,
      MODULES.MONITOR_SYSTEM,
      PRIVILEGES.VIEW
    ).then(result => {
      next(result ? true : NO_ACCESS_ROUTE);
    });
  }
});
</script>

<style scoped lang="scss">
.unit-list {
  text-align: right;
  margin-bottom: 0;
  margin-right: 15px;

  li {
    list-style: none;
  }
}

.edit-buttons {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.75em;

  button {
    margin-left: 0.25em;
  }
}
</style>
