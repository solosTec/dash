<template lang="html">
  <b-form v-on:submit.prevent class="p-3 shadow">
    <slot></slot>

    <b-input-group class="pt-1">
      <b-button
        type="submit"
        variant="primary"
        :disabled="!isRecordSelected"
        v-on:click.stop.prevent="updateItem"
        >{{ btnUpdateTitle }} </b-button
      >&nbsp;
    </b-input-group>

    <b-input-group class="pt-3">
      <b-button
        type="submit"
        variant="danger"
        :disabled="!isRecordSelected"
        v-on:click.stop.prevent="deleteItem"
        >{{ btnDeleteTitle }}
      </b-button>
    </b-input-group>

    <hr />

    <b-button
      type="submit"
      variant="success"
      :disabled="!isRecordNew"
      v-on:click.stop.prevent="insertItem"
      >{{ btnInsertTitle }}
    </b-button>
  </b-form>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "smfCrudForm",
  props: [
    "items", // items that are supposed to be edited by the user
    "identityPropertyName", // the property name of an item that is used to identify the item
    "formBackedValue" // the object that represents a form with it's property values
  ],
  data() {
    return {};
  },
  methods: {
    updateItem() {
      this.$emit("updateItem");
    },
    deleteItem() {
      this.$emit("deleteItem");
    },
    insertItem() {
      this.$emit("insertItem");
    }
  },
  computed: {
    btnUpdateTitle(): string {
      if (this.items.length === 1) {
        return "Update" + " " + this.items[0][this.identityPropertyName];
      }
      return "Update";
    },
    btnDeleteTitle(): string {
      if (!this.items.length) {
        return "Delete";
      } else if (this.items.length === 1) {
        return "Delete" + " " + this.items[0][this.identityPropertyName];
      }
      return "Delete" + " " + this.items.length + " record(s)";
    },
    btnInsertTitle(): string {
      return "Insert" + " " + this.formBackedValue[this.identityPropertyName];
    },
    isRecordSelected(): boolean {
      return this.items.length !== 0;
    },
    isRecordNew(): boolean {
      if (this.items.length != 0) {
        return (
          this.formBackedValue[this.identityPropertyName] !=
          this.items[0][this.identityPropertyName]
        );
      }
      return (
        !!this.formBackedValue[this.identityPropertyName] &&
        this.formBackedValue[this.identityPropertyName].length > 0
      );
    }
  },
  watch: {}
});
</script>
