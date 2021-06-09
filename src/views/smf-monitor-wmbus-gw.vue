<template lang="html">
  <section class="smf-monitor-wmbus-gw">
    <template>
      <div>
        <vue-headful
          title="smf :: monitor wMBus gw"
          description="SMF dashboard"
          keywords="SMF, solosTec"
        />
      </div>
    </template>

    <b-jumbotron
      fluid
      :header="$t('header-monitor-wmbus-gw')"
      :lead="$t('lead-monitor-wmbus-gw', { count: this.gateways.length })"
    />

    <b-container fluid>
      <b-row>
        <b-col md="4"> </b-col>
        <b-col md="4">
          <b-form-row>
            <smf-row-count-selector
              v-model="perPage"
              store-key="wmbusGatewayStatus"
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
            <template v-slot:cell(index)="data">{{ data.index + 1 }}</template>

            <template #cell(state)="data">
              <span v-html="data.value"></span>
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
import { webSocket } from "@/mixins/web-socket";
import { mapState } from "vuex";
import { hasPrivilegesWaitForUser } from "@/mixins/privileges";
import store, { AppState } from "../store";
import { MODULES, NO_ACCESS_ROUTE, PRIVILEGES } from "@/store/modules/user";
import mixins from "vue-typed-mixins";
import Vue from "vue";

export default mixins(webSocket, Vue).extend({
  name: "smfMonitorWMBusgw",
  props: [],
  mixins: [webSocket],
  mounted() {
    this.ws_open("/smf/api/wmbusgw/v0.9");
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
          class: "text-right",
          sortable: true
        },
        {
          key: "connectCounter",
          label: "Connects",
          sortable: true,
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
                return "<b>waiting</b>";
              case 2:
                return "online";
              default:
                break;
            }
            return value;
          },
          sortable: true
        },
        {
          key: "meter",
          label: "Meter",
          sortable: true
        },
        {
          key: "lastSeen",
          label: "Last Update",
          formatter: (value: any) => {
            return value == null ? "" : value.toLocaleString();
          },
          sortable: true
        }
      ],
      gateways: [] as any[],
      sortBy: "class",
      sortDesc: false,
      sortDirection: "desc"
    };
  },

  beforeDestroy() {
    this.ws_close();
  },

  methods: {
    rowSelected() {},

    ws_on_open() {
      //  clear table
      this.gateways = [];

      this.ws_subscribe("status.wMBusgw");
      this.ws_subscribe("table.gwwMBus.count");
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
            if (obj.channel == "table.gwwMBus.count") {
              //  unused yet
            } else {
              console.error("update - unknown channel: " + obj.channel);
            }
          }
        } else if (obj.cmd == "insert") {
          if (obj.channel == "status.wMBusgw") {
            const rec = {
              key: obj.rec.key.tag,
              host: obj.rec.data.host,
              port: obj.rec.data.port,
              connectCounter: obj.rec.data.connectCounter,
              meter: obj.rec.data.meter,
              state: obj.rec.data.state,
              lastSeen: new Date()
            };
            this.gateways.push(rec);
          }
        } else if (obj.cmd == "clear") {
          //  clear table
          this.gateways = [];
        } else if (obj.cmd == "delete") {
          // console.log('lookup node ' + obj.key);
          const idx = this.gateways.findIndex(rec => rec.key == obj.key[0]);
          // console.log('delete index ' + idx);
          this.gateways.splice(idx, 1);
        } else if (obj.cmd == "modify") {
          if (obj.channel == "status.wMBusgw") {
            //const self = this;
            this.gateways.find(function(rec) {
              if (rec.key == obj.key[0]) {
                console.log("modify record " + rec.key);
                rec.lastSeen = new Date();
                if (obj.value.connectCounter != null) {
                  rec.connectCounter = obj.value.connectCounter;
                } else if (obj.value.meter != null) {
                  rec.meter = obj.value.meter;
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
                      break;
                    default:
                      break;
                  }
                }
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
    }
  },
  computed: {
    tableCaption(): string {
      return "Showing " + this.gateways.length + " wMBus gateways";
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

<style scoped lang="css"></style>
