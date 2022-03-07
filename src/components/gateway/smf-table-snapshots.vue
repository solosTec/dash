<template lang="html">
  <section class="smf-table-snapshots">
    <b-table
      ref="tableSnapshots"
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
      :current-page="nav.currentPage"
      :per-page="nav.perPage"
      primary-key="index"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      class="shadow"
    >
      <!-- A virtual column -->
      <template v-slot:cell(index)="data">
        {{ data.index + 1 + nav.perPage * (nav.currentPage - 1) }}
      </template>

      <template v-slot:cell(install)="row">
        <b-button
          size="sm"
          type="submit"
          variant="secondary"
          v-on:click.stop="onSnapshotInstall(row.item)"
          >Install</b-button
        >&nbsp;
        <b-button
          size="sm"
          type="submit"
          variant="warning"
          v-on:click.stop="onSnapshotDelete(row.item)"
          >Delete</b-button
        >
      </template>
    </b-table>
  </section>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "smf-table-snapshots",
  props: {
    items: Array,
    nav: Object
  },
  created() {},
  mounted() {},
  data() {
    return {
      //values: [],
      //selected: [],
      isBusy: false,
      fields: [
        {
          key: "index",
          class: "text-right small text-muted"
        },
        // pk
        {
          key: "ts",
          label: "UTC",
          sortable: true,
          formatter: (value: any) => {
            return value.toLocaleString();
          }
        },
        {
          key: "serverId",
          label: "Server ID",
          sortable: true,
          tdClass: "smfTTFont",
          class: "text-right"
        },
        {
          key: "fw",
          label: "Version",
          sortable: true
        },
        {
          key: "install",
          label: "Command",
          class: "text-center"
        },
        {
          key: "desc",
          label: "Remark",
          sortable: false
        }
      ],
      sortBy: "utc",
      sortDesc: false,
      sortDirection: "desc"
    };
  },
  methods: {
    onSnapshotInstall(item: any) {
      //console.log(item.key);
      this.$emit("onSnapshotInstall", item.key);
    },
    onSnapshotDelete(item: any) {
      //console.log(item.key);
      this.$emit("onSnapshotDelete", item.key);
    }
  },
  computed: {}
});
</script>

<style scoped lang="css"></style>
