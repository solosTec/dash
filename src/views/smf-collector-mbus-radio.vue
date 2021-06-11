<template lang="html">
  <section class="smf-collector-mbus-radio">
    <template>
      <div>
        <vue-headful
          title="smf :: mBus collector (radio)"
          description="SMF dashboard"
          keywords="SMF, solosTec"
        />
      </div>
    </template>

    <b-jumbotron
      fluid
      :header="$t('header-collector-mbus-radio')"
      :lead="$t('lead-collector-mbus-radio', { count: this.records.length })"
    />

    <b-container fluid>
      <b-row>
        <b-col md="4">
          <b-form-group
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            :label="$t('tbl-filter')"
            class="mb-0"
          >
            <b-input-group size="sm">
              <b-form-input v-model="filter" :placeholder="$t('tbl-search')" />
              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''">
                  {{ $t("action-clear") }}
                </b-button>
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
            ref="wMBusTable"
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
              >Remove {{ selected.length }}</b-button
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
  name: "smfCollectormBusRadio",
  props: [],
  mixins: [webSocket],
  components: {},
  mounted() {
    this.isBusy = true;
    let rec = {
      id: 0,
      ts: new Date(),
      data: "DATA",
      tag: 1
    } as any;
    //rec["_rowVariant"] = 'success';
    this.records.push(rec);
    this.ws_open("/smf/api/wmbus/v0.9");
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
          key: "serverId",
          label: "Meter",
          sortable: true
        },
        {
          key: "manufacturer",
          label: "Manufacturer",
          sortable: true
        },
        {
          key: "medium",
          label: "Device",
          formatter: (value: Number | undefined) => {
            switch (value) {
              case 0x01:
                return "Oil";
              case 0x02:
                return "Electricity";
              case 0x03:
                return "Gas";
              case 0x04:
                return "Heat";
              case 0x05:
                return "Steam";
              case 0x06:
                return "Warm Water (30C...90C)";
              case 0x07:
                return "Water";
              case 0x08:
                return "Heat Cost Allocator";
              case 0x09:
                return "Compressed Air";
              //DEV_TYPE_CLM_OUTLET = 0x0A, //!< Cooling load meter (Volume measured at return temperature: outlet)
              //DEV_TYPE_CLM_INLET = 0x0B, //!< Cooling load meter (Volume measured at flow temperature: inlet)
              //DEV_TYPE_HEAT_INLET = 0x0C, //!< Heat (Volume measured at flow temperature: inlet)
              //DEV_TYPE_HEAT_COOLING_LOAD_METER = 0x0D, //!< Heat / Cooling load meter
              case 0x0e:
                return "Bus"; // / System component
              //DEV_TYPE_UNKNOWN_MEDIUM = 0x0F, //!< Unknwon medium

              //// 0x10 to 0x13 reserved
              //DEV_TYPE_CALORIFIC_VALUE = 0x14,	//! Calorific value
              case 0x15:
                return "Hot water (>=90C)";
              case 0x16:
                return "Cold water";
              case 0x17:
                return "Dual register"; // (hot/cold) Water Meter
              case 0x18:
                return "Pressure meter";
              //DEV_TYPE_AD_CONVERTER = 0x19, //!<	A/D Converter
              //DEV_TYPE_SMOKE_DETECTOR = 0x1A,	//!<	Room sensor  (e.g. temperature or humidity)
              case 0x1b:
                return "Room sensor"; //!<	Room sensor  (e.g. temperature or humidity)
              //DEV_TYPE_GAS_DETECTOR = 0x1C,	//!<	Gas detector
              case 0x37:
                return "RF meter";
              default:
                break;
            }
            return String(value);
          },
          sortable: true
        },
        {
          key: "frameType",
          label: "Type",
          formatter: (value: Number | undefined) => {
            switch (value) {
              case 0x70:
                return "app error";
              case 0x72:
                return "header long";
              case 0x78:
                return "no header";
              case 0x7a:
                return "header short";
              case 0x7c:
                return "DLMS long";
              case 0x7d:
                return "DLMS short";
              case 0x7e:
                return "SML long";
              case 0x7f:
                return "SML short";
              case 0x8c:
                return "Link layer";
              case 0xa0:
                return "private";
              default:
                break;
            }
            return String(value);
          },
          sortable: true
        },
        {
          key: "payload",
          label: "Payload",
          formatter: (value: String | undefined) => {
            return value && value.length > 32
              ? value.substring(0, 32) + "..."
              : value;
          },
          sortable: false
        }
      ],
      records: [] as any[],
      selected: [] as any[],
      sortBy: "ts",
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
      this.ws_subscribe("monitor.wMBus");
      this.ws_subscribe("table.wMBus.count");
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
            if (obj.channel == "table.wMBus.count") {
              //this.recordCount = obj.value;
            }
          }
        } else if (obj.cmd == "insert") {
          console.log("message " + obj.rec.key.id);
          let rec = {
            id: obj.rec.key.tag,
            ts: obj.rec.data.ts,
            serverId: obj.rec.data.serverId,
            manufacturer: obj.rec.data.manufacturer,
            medium: obj.rec.data.medium,
            frameType: obj.rec.data.frameType,
            payload: obj.rec.data.payload
          } as any;
          tmpRecords.push(rec);
        } else if (obj.cmd == "clear") {
          //  clear table
          this.records = [];
        } else if (obj.cmd == "delete") {
          //console.log('lookup record ' + obj.key);
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
    rowSelected(items: any[]) {
      this.selected = items;
    },
    selectAllRows() {
      (this.$refs.wMBusTable as BTable).selectAllRows();
    },
    clearSelected() {
      (this.$refs.wMBusTable as BTable).clearSelected();
    },
    removeSelected() {
      console.log(this.selected);
      this.selected.forEach(element => {
        this.ws_submit_key("delete", "monitor.wMBus", { tag: [element.id] });
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
