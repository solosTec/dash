<template lang="html">
  <b-container class="smf-table-bridge" fluid>
    <!--navigation-->
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
            <b-form-input
              v-model="nav.filter"
              :placeholder="$t('tbl-search')"
            />
            <b-input-group-append>
              <b-button :disabled="!nav.filter" @click="nav.filter = ''">{{
                $t("action-clear")
              }}</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="4">
        <b-form-row>
          <smf-row-count-selector
            v-model="nav.perPage"
            store-key="meter"
            class="col"
          />
        </b-form-row>
      </b-col>
      <b-col md="4">
        <b-pagination
          v-model="nav.currentPage"
          :total-rows="nav.visibleRows"
          :per-page="nav.perPage"
          class="justify-content-end"
          align="fill"
          size="sm"
        />
      </b-col>
    </b-row>
    <!--table with meter -->
    <b-row>
      <b-col md="12">
        <b-table
          ref="tableBridge"
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
          :items="items"
          :busy="isBusy"
          :current-page="nav.currentPage"
          :per-page="nav.perPage"
          :filter="nav.filter"
          @filtered="onFiltered"
          primary-key="pk"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
        >
          <!-- A virtual column -->
          <template v-slot:cell(index)="data">
            {{ data.index + 1 + nav.perPage * (nav.currentPage - 1) }}
          </template>

          <template v-slot:cell(reading)="row">
            <b-button
              size="sm"
              variant="warning"
              :disabled="!row.item.direction"
              class="shadow"
              @click="doMeterReadout(row.item)"
              >Start</b-button
            >
          </template>

          <!-- loading slot -->
          <div slot="table-busy" class="text-center text-danger">
            <strong>Loading... {{ nav.busyLevel }}%</strong>
          </div>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "smf-table-bridge",
  props: {
    items: Array,
    nav: Object,
    value: Array
  },

  created() {},

  mounted() {},

  data() {
    return {
      isBusy: false,
      fields: [
        {
          key: "index",
          class: "text-right small text-muted"
        },
        // pk
        {
          key: "meter",
          label: "Meter",
          sortable: true
        },
        {
          key: "address",
          label: "IP Address",
          sortable: true
        },
        {
          key: "port",
          label: "IP Port",
          sortable: true
        },
        {
          key: "direction",
          label: "Direction",
          class: "text-center",
          formatter: (value: boolean) => {
            return value ? "outgoing ↦" : "↤ incoming";
          },
          sortable: true
        },
        {
          key: "protocol",
          label: "Protocol",
          sortable: true
        },
        {
          key: "reading",
          label: "Readout",
          class: "text-center"
        },
        {
          key: "interval",
          label: "Interval",
          sortable: true,
          formatter: (value: string) => {
            return value.length > 9 ? value.substring(0, 9) : value;
          }
        }
      ],
      sortBy: "ep",
      sortDesc: false,
      sortDirection: "desc"
    };
  },
  methods: {
    onFiltered(filteredItems: any[]) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.nav.visibleRows = filteredItems.length;
      this.nav.currentPage = 1;
    },
    rowSelected(items: any) {
      //this.$emit('input', items);
      this.$emit("rowSelected", items);
    },
    doMeterReadout(item: any) {
      // send readout command
      this.$emit("doMeterReadout", item.pk);
    }
  },

  computed: {}
});
</script>

<style scoped lang="css"></style>
