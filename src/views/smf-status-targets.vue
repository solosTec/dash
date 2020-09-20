<template lang="html">
  <section class="smf-status-targets">
    <template>
      <div>
        <vue-headful
          title="smf :: status targets"
          description="SMF dashboard"
          keywords="SMF, solosTec"
        />
      </div>
    </template>

    <!-- <b-jumbotron fluid header="Registered push targets." :lead="targets.length + ' targets registered'"/> -->
    <b-jumbotron
      fluid
      :header="$t('header-status-targets')"
      :lead="$t('lead-status-targets', { count: this.targets.length })"
    />
    <b-container fluid>
      <b-row>
        <b-col md="12">
          <!-- table -->
          <b-table
            ref="targetTable"
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
            primary_key="channel"
            :items="targets"
            :busy="isBusy"
            :current-page="currentPage"
            :per-page="perPage"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            class="shadow"
          >
            <!-- primary-key="pk" -->
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
            :total-rows="targets.length"
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
  name: "smfStatusTarget",
  props: [],
  mixins: [webSocket],

  mounted() {
    this.ws_open("/smf/api/target/v0.8");
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
        {
          key: "name",
          label: "Name",
          sortable: true
        },
        // {
        //     key: 'device',
        //     label: 'Device',
        //     sortable: true
        // },
        {
          key: "account",
          label: "Account",
          sortable: true
        },
        {
          key: "px",
          label: "PX",
          sortable: true,
          class: "text-right",
          formatter: (value: number) => {
            return this.ws_format_bytes(value);
          }
        },
        {
          key: "counter",
          label: "Messages",
          sortable: true,
          class: "text-right",
          formatter: (value: number) => {
            return value == 0 ? "" : value.toString();
          }
        },
        {
          //  pk
          key: "channel",
          label: "Channel",
          sortable: true,
          class: "text-right",
          formatter: (value: any) => {
            return value.toString().padStart(10, "0");
          }
        },
        {
          key: "regTime",
          label: "Registered",
          sortable: true,
          formatter: (value: any) => {
            return value.toUTCString();
          }
        }
      ],
      targets: [] as any[],
      selected: [] as any[],
      sortBy: "name",
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
      this.targets = [];
      this.ws_subscribe("status.target");
    },
    ws_on_data(obj: any) {
      if (obj.cmd != null) {
        console.log("websocket received " + obj.cmd);
        if (obj.cmd == "insert") {
          const regTime = new Date(obj.rec.data.regTime.substring(0, 19));
          const rec = {
            channel: obj.rec.key.channel,
            name: obj.rec.data.name,
            device: obj.rec.data.device,
            account: obj.rec.data.account,
            px: obj.rec.data.px,
            counter: obj.rec.data.counter,
            regTime: regTime
          };
          this.targets.push(rec);
        } else if (obj.cmd == "delete") {
          const idx = this.targets.findIndex(
            rec => obj.key.length == 1 && obj.key[0] == rec.channel
          );
          console.log("delete index " + idx);
          this.targets.splice(idx, 1);
        } else if (obj.cmd == "modify") {
          this.targets.find(function(rec) {
            if (obj.key.length == 1 && obj.key[0] == rec.channel) {
              if (obj.value.px != null) {
                rec.px = obj.value.px;
              } else if (obj.value.counter != null) {
                rec.counter = obj.value.counter;
              }
            }
          });
        } else if (obj.cmd == "clear") {
          this.targets = [];
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
      MODULES.STATUS_TARGET,
      PRIVILEGES.VIEW
    ).then(result => {
      next(result ? true : NO_ACCESS_ROUTE);
    });
  }
});
</script>

<style scoped lang="scss"></style>
