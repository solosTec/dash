<template lang="html">
  <section class="smf-table-data-mirror">
    <b-table
      ref="tableDataMirror"
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

      <template v-slot:row-details="row">
        <b-card>
          <ul>
            <li v-for="(register, key) in row.item.registers" :key="key">
              {{ register | toRegisterName(true) }}
            </li>
          </ul>
        </b-card>
      </template>
    </b-table>
  </section>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "smf-table-data-mirror",
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
          key: "active",
          label: "Active",
          sortable: true
        },
        {
          key: "entries",
          label: "Entries",
          sortable: true,
          class: "text-right"
        },
        {
          // register period
          key: "period",
          label: "Period (sec)",
          sortable: true,
          class: "text-right"
        },
        {
          key: "OBIS",
          label: "Profile",
          sortable: true,
          class: "text-right",
          formatter: (value: string) => {
            if (value === "8181c78610ff") return "1 minute values";
            else if (value === "8181c78611ff") return "15 minute values";
            else if (value === "8181c78612ff") return "hourly values";
            else if (value === "8181c78613ff") return "daily values";
            else if (value === "8181c78614ff") return "last 2 hour values";
            else if (value === "8181c78615ff") return "last week values";
            else if (value === "8181c78616ff") return "monthly values";
            else if (value === "8181c78617ff") return "annual values";
            else if (value === "8181c78618ff") return "initial values";
            return value.toUpperCase();
          }
        },
        {
          key: "details",
          label: "Show Details",
          class: "text-center"
        }
        //{
        //    key: 'name',
        //    label: 'Profile',
        //    sortable: true
        //}
      ],
      //items: [{nr:1, active: true, entries: 101, OBIS:'77', name:'name'}],
      sortBy: "nr",
      sortDesc: false,
      sortDirection: "desc"
    };
  }
});
</script>

<style scoped lang="css"></style>
