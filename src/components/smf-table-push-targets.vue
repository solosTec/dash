<template lang="html">
  <section class="smf-table-push-targets">
    <b-table
      ref="tablePushTargets"
      bordered
      striped
      small
      hover
      show-empty
      stacked="md"
      selectable
      select-mode="single"
      selectedVariant="info"
      :fields="fields"
      :items="items"
      :busy="isBusy"
      primary-key="pk"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      class="shadow"
    >
      <template v-slot:cell(details)="row">
        <b-button size="sm" @click="row.toggleDetails">
          {{ row.detailsShowing ? "Hide" : "Show" }} Register
        </b-button>
      </template>

      <!--<template slot="row-details" slot-scope="row">
                <b-card>
                    <ul>
                        <li v-for="(register, key) in row.item.registers" :key="key">{{ register | | toRegisterName(true) }}</li>
                    </ul>
                </b-card>
            </template>-->
    </b-table>
  </section>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "smf-table-push-targets",
  props: {
    items: Array
  },
  created() {},
  mounted() {},
  data() {
    return {
      isBusy: false,
      fields: [
        {
          key: "nr",
          class: "text-right small text-muted",
          sortable: true
        },
        {
          key: "interval",
          label: "Interval",
          sortable: true,
          formatter: (value: number) => {
            if (value > 60 * 60) return value / (60 * 60) + " h";
            if (value > 60) return value / 60 + " min";
            return value + " sec";
          },
          class: "text-right"
        },
        {
          key: "delay",
          label: "Delay",
          sortable: true,
          formatter: (value: number) => {
            if (value > 60 * 60) return value / (60 * 60) + " h";
            if (value > 60) return value / 60 + " min";
            if (value === 0) return "-";
            return value + " sec";
          },
          class: "text-right"
        },
        {
          key: "name",
          label: "Push Target",
          sortable: true
        },
        {
          key: "OBIS",
          label: "Service",
          sortable: true,
          class: "text-right",
          formatter: (value: string) => {
            if (value === "8181c78a21ff") return "IP-Telemetry";
            else if (value === "8181c78a22ff") return "Service Interface";
            else if (value === "8181c78a23ff") return "OBIS List";
            //if (value === '8181c78610ff') return '1 minute values';
            //else if (value === '8181c78611ff') return '15 minute values';
            //else if (value === '8181c78612ff') return 'hourly values';
            //else if (value === '8181c78613ff') return 'daily values';
            //else if (value === '8181c78614ff') return 'last 2 hour values';
            //else if (value === '8181c78615ff') return 'last week values';
            //else if (value === '8181c78616ff') return 'monthly values';
            //else if (value === '8181c78617ff') return 'annual values';
            //else if (value === '8181c78618ff') return 'initial values';
            return value.toUpperCase();
          }
        },
        //service: "8181c78a21ff"??
        {
          key: "source",
          label: "Push Source",
          sortable: true,
          formatter: (value: string) => {
            if (value === "8181c78a42ff") return "Push Source";
            else if (value === "8181c78a43ff") return "Install Parameters";
            else if (value === "8181c78a44ff") return "Visible Devices";
            else if (value === "8181c78a45ff") return "Active Devices";
            return value.toUpperCase();
          }
        }
        //{
        //    key: 'details',
        //    label: 'Show Details',
        //    class: 'text-center'
        //}
      ],
      //items: [{nr:1, active: true, entries: 101, OBIS:'77', name:'name'}],
      sortBy: "nr",
      sortDesc: false,
      sortDirection: "desc"
    };
  },
  methods: {},
  computed: {}
});
</script>

<style scoped lang="css"></style>
