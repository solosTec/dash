<template>
  <b-form-group
    label-cols-sm="5"
    label-cols-md="4"
    label-cols-lg="3"
    label-align-sm="right"
    label-size="sm"
    class="mb-0"
    :label="$t('tbl-lines-per-page')"
  >
    <b-form-select
      size="sm"
      :value="rowCount"
      :options="options"
      @change="onRowSelectionChanged"
    />
  </b-form-group>
</template>

<script lang="ts">
import Vue from "vue";

function createFullStoreKey(storeKey: string) {
  return `smf-${storeKey}-rowCount`;
}

export default Vue.extend({
  data() {
    return {
      options: [5, 10, 15, 20, 25, 50, 100].map(value => ({
        value,
        text: `${value}`
      })),
      rowCount: 15
    };
  },
  props: {
    value: {
      type: Number,
      required: true
    },
    storeKey: {
      type: String,
      required: true
    }
  },
  methods: {
    onRowSelectionChanged(rowCount: number) {
      this.rowCount = rowCount;
      this.$emit("input", rowCount);
    }
  },
  watch: {
    storeKey: {
      immediate: true,
      handler(newStoreKey) {
        const storedValue = localStorage.getItem(
          createFullStoreKey(newStoreKey)
        );
        this.rowCount = storedValue ? +storedValue : this.value;
        this.$emit("input", this.rowCount);
      }
    },
    rowCount: {
      handler(val) {
        localStorage.setItem(createFullStoreKey(this.storeKey), String(val));
      }
    }
  }
});
</script>
