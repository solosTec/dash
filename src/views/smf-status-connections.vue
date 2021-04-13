<template lang="html">
  <section class="smf-status-connections">
    <template>
      <div>
        <vue-headful
          title="smf :: status connections"
          description="SMF dashboard"
          keywords="SMF, solosTec"
        />
      </div>
    </template>

    <!-- <b-jumbotron fluid header="Running dial-up connections." :lead="connections.length + ' connection(s) so far'"/> -->
    <b-jumbotron
      fluid
      :header="$t('header-status-connections')"
      :lead="$t('lead-status-connections', { count: this.connections.length })"
    />

    <b-container fluid>
      <b-row>
        <b-col md="12">
          <!-- table -->
          <b-table
            ref="connectionTable"
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
            :items="connections"
            primary_key="tag"
            :busy="isBusy"
            :current-page="currentPage"
            :per-page="perPage"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            class="shadow"
          >
            <!-- caption slot -->
            <!-- <template slot="table-caption">{{ tableCaption }}</template> -->

            <!-- A virtual column -->
            <template v-slot:cell(index)="data">
              {{ data.index + 1 + perPage * (currentPage - 1) }}
            </template>

            <!-- loading slot -->
            <div slot="table-busy" class="text-center text-danger">
              <strong>Loading... {{ busyLevel }}%</strong>
            </div>
          </b-table>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="2" offset-md="10">
          <b-pagination
            v-model="currentPage"
            :total-rows="connections.length"
            :per-page="perPage"
          />
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script lang="ts">
import { webSocket } from "@/mixins/web-socket";
import { hasPrivilegesWaitForUser } from "@/mixins/privileges";
import store from "../store";
import { MODULES, NO_ACCESS_ROUTE, PRIVILEGES } from "@/store/modules/user";
import mixins from "vue-typed-mixins";
import Vue from "vue";

export default mixins(webSocket, Vue).extend({
  name: "smfStatusConnection",
  props: [],
  mixins: [webSocket],

  mounted() {
    this.ws_open("/smf/api/connection/v0.8");
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
          class: "text-right small"
        },
        //  UUID + UUID
        {
          key: "caller",
          label: "Caller",
          sortable: true
        },
        {
          key: "callee",
          label: "Callee",
          sortable: true
        },
        {
          key: "local",
          label: "Type",
          sortable: true,
          formatter: (value: boolean) => {
            return value ? "local" : "remote";
          }
        },
        {
          key: "aLayer",
          label: "Layer A",
          sortable: true
        },
        {
          key: "bLayer",
          label: "Layer B",
          sortable: true
        },
        {
          key: "throughput",
          label: "Throughput",
          sortable: true,
          class: "text-right",
          formatter: (value: number) => {
            return this.ws_format_bytes(value);
          }
        },
        {
          key: "start",
          label: "Start",
          sortable: true,
          formatter: (value: any) => {
            return value.toUTCString();
          }
        }
      ],
      connections: [] as any[],
      selected: [] as any[],
      sortBy: "caller",
      sortDesc: false,
      sortDirection: "desc"
    };
  },

  beforeDestroy() {
    this.ws_close();
  },

  methods: {
    ws_on_open() {
      //  clear table
      this.connections = [];
      this.ws_subscribe("status.connection");
    },
    ws_on_data(obj: any) {
      if (obj.cmd != null) {
        console.log("websocket received " + obj.cmd);
        if (obj.cmd == "insert") {
          const start = new Date(obj.rec.data.start.substring(0, 19));
          const rec = {
            tag: obj.rec.key.tag,
            caller: obj.rec.data.caller,
            callee: obj.rec.data.callee,
            aLayer: obj.rec.data.aLayer,
            bLayer: obj.rec.data.bLayer,
            local: obj.rec.data.local,
            throughput: obj.rec.data.throughput,
            start: start
          };
          this.connections.push(rec);
        } else if (obj.cmd == "delete") {
          const idx = this.connections.findIndex(rec => obj.key[0] == rec.tag);
          console.log("delete index " + idx);
          this.connections.splice(idx, 1);
        } else if (obj.cmd == "modify") {
          this.connections.find(function(rec) {
            if (obj.key[0] == rec.tag) {
              // console.log('modify record ' + rec.name);
              if (obj.value.throughput != null) {
                rec.throughput = obj.value.throughput;
              }
            }
          });
        } else if (obj.cmd == "clear") {
          this.connections = [];
        } else if (obj.cmd == "load") {
          if (obj.show != null) {
            this.isBusy = obj.show;
          } else if (obj.level != 0) {
            this.busyLevel = obj.level;
          }
        }
      }
    },
    rowSelected(items: any[]) {
      this.selected = items;
    }
  },
  beforeRouteEnter(to: any, from: any, next: any) {
    hasPrivilegesWaitForUser(
      store,
      MODULES.STATUS_CONNECTION,
      PRIVILEGES.VIEW
    ).then(result => {
      next(result ? true : NO_ACCESS_ROUTE);
    });
  }
});
</script>

<style scoped lang="css"></style>
