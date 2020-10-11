<template>
  <div class="edit-buttons">
    <b-button
      :disabled="!isRecordSelected"
      type="button"
      variant="primary"
      v-on:click.stop="onUpdate"
      >{{ btnUpdateTitle }}
    </b-button>

    <b-button
      :disabled="!isRecordSelected"
      type="button"
      variant="danger"
      v-on:click.stop="onDelete"
      >{{ btnDeleteTitle }}
    </b-button>

    <b-button type="submit" variant="success" v-on:click.stop="onInsert"
      >{{ btnInsertTitle }}
    </b-button>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { TranslateResult } from "vue-i18n";
import { SmfDialogService } from "@/shared/smf-dialog.service";

export default Vue.extend({
  props: {
    selectedItems: {
      type: Array as PropType<{ name: string }[]>,
      required: true
    }
  },
  methods: {
    onUpdate() {
      this.$emit("onUpdate");
    },
    async onDelete() {
      const result = await SmfDialogService.confirmDelete(
        this,
        this.btnDeleteTitle
      );
      if (result) {
        this.$emit("onExecuteDelete");
      }
    },
    onInsert() {
      this.$emit("onInsert");
    }
  },
  computed: {
    btnUpdateTitle(): string | TranslateResult {
      if (this.selectedItems.length > 0) {
        return `${this.$t("action-update")} ${this.selectedItems[0].name}`;
      }
      return this.$t("action-update");
    },
    btnDeleteTitle(): string | TranslateResult {
      if (this.selectedItems.length === 0) {
        return this.$t("action-del");
      } else if (this.selectedItems.length === 1) {
        return `${this.$t("action-del")} ${this.selectedItems[0].name}`;
      }
      return `${this.$t("action-del")} ${this.selectedItems.length} record(s)`;
    },
    btnInsertTitle(): string | TranslateResult {
      return this.$t("action-add");
    },
    isRecordSelected(): boolean {
      return this.selectedItems.length !== 0;
    }
  },
  watch: {
    storeKey: {
      immediate: true,
      handler(newStoreKey) {}
    }
  }
});
</script>
<style lang="scss" scoped>
.edit-buttons {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.75em;
  button {
    margin-left: 0.25em;
  }
}
</style>
