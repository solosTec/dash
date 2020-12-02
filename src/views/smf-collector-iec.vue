<template lang="html">
  <section class="smf-collector-iec">
    <template>
      <div>
        <vue-headful
          title="smf :: IEC collector (RS485)"
          description="SMF dashboard"
          keywords="SMF, solosTec"
        />
      </div>
    </template>

    <b-jumbotron
      fluid
      :header="$t('header-collector-iec')"
      :lead="$t('lead-collector-iec', { count: this.records.length })"
    />

    <b-container fluid>
      <b-row>
        <b-col md="4">
          <b-form-group
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            :label="$t('tbl-filter')"
          >
            <b-input-group size="sm">
              <b-form-input v-model="filter" :placeholder="$t('tbl-search')" />
              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''">{{
                  $t("action-clear")
                }}</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-form-row>
            <smf-row-count-selector
              v-model="perPage"
              store-key="records"
              class="col"
            />
          </b-form-row>
        </b-col>
        <b-col md="4">
          <b-pagination
            v-model="currentPage"
            :total-rows="records.length"
            :per-page="perPage"
            class="justify-content-end"
            align="fill"
            size="sm"
          />
        </b-col>
      </b-row>

      <b-row>
        <b-col md="12">
          <!-- table -->
          <b-table
            ref="IECTable"
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
            :items="records"
            :busy="isBusy"
            :current-page="currentPage"
            :per-page="perPage"
            :filter="filter"
            primary-key="pk"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            class="shadow"
          >
            <!-- A virtual column -->
            <template v-slot:cell(index)="data">
              {{ data.index + 1 + perPage * (currentPage - 1) }}
            </template>

            <!-- loading slot -->
            <div slot="table-busy" class="text-center text-danger">
              <strong>Loading... {{ busyLevel }}%</strong>
            </div>

            <template v-slot:cell(event)="data">
              <span v-b-popover.hover="data.value" :title="data.item.ep">{{
                formatDescription(data.value)
              }}</span>
            </template>
          </b-table>
        </b-col>
      </b-row>

      <b-row align-h="end">
        <b-col md="12">
          <b-button-group size="sm">
            <b-button @click="selectAllRows">Select all</b-button>
            <b-button @click="clearSelected" class="mx-2"
              >Clear selected</b-button
            >
            <b-button @click="removeSelected" variant="warning"
              >Remove {{ this.selected.length }}</b-button
            >
          </b-button-group>
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
import { BTable } from "bootstrap-vue";

let tmpRecords = [] as any[];

export default mixins(webSocket, Vue).extend({
  name: "smfCollectorIEC",
  props: [],
  mixins: [webSocket],
  components: {},
  mounted() {
    this.isBusy = true;
    let rec = {
      id: 0,
      ts: new Date(),
      event: "EVENT",
      ep: "address:port",
      tag: "918273981273"
    } as any;
    //rec["_rowVariant"] = 'success';
    this.records.push(rec);
    this.ws_open("/smf/api/iec/v0.8");
    this.isBusy = false;
  },
  data() {
    return {
      isBusy: false,
      busyLevel: 0,
      currentPage: 1,
      perPage: 10,
      fields: [
        {
          key: "id",
          label: "ID",
          formatter: (value: string) => {
            return value + 1;
          },
          class: "text-right small text-muted",
          sortable: true
        },
        {
          key: "ts",
          label: "TimeStamp",
          formatter: (value: any) => {
            return value.toLocaleString();
          },
          sortable: true
        },
        {
          key: "event",
          label: "Event",
          sortable: false
        },
        {
          key: "ep",
          label: "Endpoint",
          sortable: true
        }
      ],
      records: [] as any[],
      selected: [] as any[],
      sortBy: "id",
      sortDesc: false,
      sortDirection: "desc",
      filter: null as null | string,
      visibleRows: 0
    };
  },
  beforeDestroy() {
    this.ws_close();
  },
  methods: {
    ws_on_open() {
      this.records = [];
      this.ws_subscribe("monitor.IEC");
      this.ws_subscribe("table.bridge.count");
    },
    ws_on_data(obj: any) {
      if (obj.cmd != null) {
        console.log(
          this.$options.name +
            " websocket received " +
            obj.cmd +
            " / " +
            obj.channel
        );

        if (obj.cmd == "update") {
          if (obj.channel != null) {
            if (obj.channel == "table.bridge.count") {
              //this.recordCount = obj.value;
            }
          }
        } else if (obj.cmd == "insert") {
          console.log("message " + obj.rec.key.id);
          let rec = {
            id: obj.rec.key.id,
            ts: obj.rec.data.ts,
            event: obj.rec.data.event,
            ep: obj.rec.data.ep
          } as any;
          tmpRecords.push(rec);
        } else if (obj.cmd == "clear") {
          //  clear table
          this.records = [];
        } else if (obj.cmd == "delete") {
          console.log("delete record ", obj.key);
          const idx = this.records.findIndex(rec => rec.id == obj.key[0]);
          console.log("delete index " + idx);
          this.records.splice(idx, 1);
        } else if (obj.cmd == "load") {
          //  load status
          if (obj.show != null) {
            console.log("load state " + obj.show);
            this.isBusy = obj.show;

            if (this.isBusy) {
              // reset the tmpRecords array if the initial upload starts
              tmpRecords = [];
            } else {
              // set the tmpRecords if the initial uploads is done
              this.records = tmpRecords;
            }
          } else if (obj.level != 0) {
            this.busyLevel = obj.level;
          }
        }
      }
    },
    formatDescription(str: string) {
      if (str.length > 64) return `${str.substring(0, 64)}...`;
      return str;
    },
    rowSelected(items: any[]) {
      this.selected = items;
    },
    selectAllRows() {
      (this.$refs.IECTable as BTable).selectAllRows();
    },
    clearSelected() {
      (this.$refs.IECTable as BTable).clearSelected();
    },
    removeSelected() {
      this.selected.forEach(element => {
        console.log("delete:", element.id);
        this.ws_submit_key("delete", "monitor.IEC", { tag: [element.id] });
      });
    }
  },
  computed: {},
  beforeRouteEnter(to: any, from: any, next: any) {
    hasPrivilegesWaitForUser(
      store,
      MODULES.TASK_PLAUSIBILITY,
      PRIVILEGES.VIEW
    ).then(result => {
      next(result ? true : NO_ACCESS_ROUTE);
    });
  }
});
</script>

<style scoped lang="css"></style>
