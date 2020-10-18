<template lang="html">
  <div>
    <b-row>
      <b-col md="6">
        <b-form-group label-cols-sm="3" :label="$t('tbl-filter')" class="mb-0">
          <b-input-group>
            <b-form-input v-model="filter" :placeholder="$t('tbl-search')" />
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">{{
                $t("action-del")
              }}</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-row>
          <smf-row-count-selector
            v-model="perPage"
            store-key="devices"
            class="col"
          />
          <b-pagination
            v-model="currentPage"
            :total-rows="visibleRows"
            :per-page="perPage"
            class="justify-content-end"
          />
        </b-form-row>
      </b-col>
    </b-row>
    <slot name="editButtons"></slot>
    <b-row>
      <b-col>
        <b-table
          ref="table"
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
          :fields="internalFields"
          :items="$props.items"
          :busy="isBusy"
          primary-key="pk"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          @filtered="onFiltered"
          class="shadow data-table"
        >
          <!-- A virtual column -->
          <template v-slot:cell(index)="data">
            {{ data.index + 1 + perPage * (currentPage - 1) }}
          </template>

          <!-- caption slot -->
          <template slot="table-caption">
            <div>{{ tableCaption }}</div>
            <div class="d-none d-md-block d-lg-block d-xl-block">
              <slot name="editButtons"></slot>
            </div>
          </template>

          <!-- import templates from the parent - makes it possible to customize
                     columns individually for every smf-data-table-->
          <template
            v-for="slotName in Object.keys($scopedSlots)"
            v-slot:[slotName]="slotScope"
          >
            <slot :name="slotName" v-bind="slotScope"></slot>
          </template>

          <!-- loading slot -->
          <div slot="table-busy" class="text-center text-danger">
            <strong>Loading... {{ busyLevel }}%</strong>
          </div>
        </b-table>
      </b-col>
    </b-row>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "smfDataTable",
  props: ["tableName", "fields", "busyLevel", "items"],
  data() {
    return {
      currentPage: 1,
      perPage: 15,
      filter: null as null | string,
      visibleRows: 0,
      sortBy: "name",
      sortDesc: false,
      sortDirection: "desc",
      selected: [],
      internalFields: [] as any[]
    };
  },
  methods: {
    onFiltered(filteredItems: any[]) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.visibleRows = filteredItems.length;
      this.currentPage = 1;
    },
    rowSelected(items: any) {
      this.selected = items;
      this.$emit("itemSelected", items);
    }
  },
  computed: {
    tableCaption(): string {
      return `${this.selected.length}/${this.items.length} ${this.tableName}(s) selected
                        - ${this.visibleRows} ${this.tableName}(s) filtered`;
    },
    isBusy(): boolean {
      if (this.busyLevel === undefined) {
        return false;
      }
      return this.busyLevel !== 100;
    }
  },
  watch: {
    items: {
      immediate: true,
      handler(newItems) {
        this.visibleRows = (newItems || []).length;
      }
    },
    fields: {
      // run on component init and add the default calumns
      immediate: true,
      handler(newFields) {
        this.internalFields = [
          {
            key: "index",
            class: "text-right small text-muted"
          },
          ...newFields
        ];
      }
    }
  }
});
</script>
<style lang="scss" scoped></style>
