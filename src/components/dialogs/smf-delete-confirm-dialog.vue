<template lang="html">
  <b-modal
    ref="dialog"
    :title="title"
    centered
    header-bg-variant="danger"
    @ok="deleteOk"
  >
    <p>Proceed?</p>
  </b-modal>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import { VueComponentInstance } from "@/shared/smf-dialog.service";
import { BModal } from "bootstrap-vue";

export default Vue.extend({
  name: "smfDeleteConfirmDialog",
  props: {
    parent: {
      type: Object as PropType<VueComponentInstance>,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dialogRefElement: null as HTMLElement | null
    };
  },
  created() {
    this.$mount();
    this.dialogRefElement = this.parent.$root.$el.appendChild(this.$el);
  },
  methods: {
    close() {
      this.$emit("close", false);
      this.$destroy();
    },
    deleteOk() {
      this.$emit("close", true);
      this.$destroy();
    }
  },
  mounted() {
    // show the modal dialog immediately.
    (this.$refs.dialog as BModal).show();
  },
  destroyed() {
    // remove the dialog form the dom
    if (this.dialogRefElement) {
      this.dialogRefElement.remove();
    }
    // remove all event listeners regostered by $on.
    this.$off();
  }
});
</script>
