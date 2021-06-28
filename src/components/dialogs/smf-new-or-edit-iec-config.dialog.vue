<template lang="html">
  <b-form @submit.prevent="">
    <smf-input
      lable-key="iec-config-host"
      description-key="iec-config-host-description"
      :vuelidate-form-model="$v.formModel"
      form-property="host"
      :error-messages="{
        required: 'iec-config-host-is-required'
      }"
    >
    </smf-input>

    <smf-input
      lable-key="iec-config-port"
      :vuelidate-form-model="$v.formModel"
      form-property="port"
      type="number"
      :error-messages="{
        required: 'iec-config-port-is-required'
      }"
    >
    </smf-input>

    <smf-input
      lable-key="iec-config-interval"
      :vuelidate-form-model="$v.formModel"
      form-property="interval"
      :mask="'##:##:##'"
      :error-messages="{
        required: 'iec-config-interval-is-required'
      }"
      :disabled="true"
    >
    </smf-input>
  </b-form>
</template>
<script lang="ts">
import Vue from "vue";
import { required } from "vuelidate/lib/validators";
import { SmfDialogContentMixin } from "@/shared/smf-dialog.service";
import { i18n } from "@/plugins/i18n";
import SmfInput from "@/components/form-inputs/smf-input.vue";

export default Vue.extend({
  mixins: [SmfDialogContentMixin],
  components: { SmfInput },
  i18n,
  data() {
    return {};
  },
  validations: {
    formModel: {
      host: { required },
      port: { required },
      interval: { required }
    }
  },
  methods: {}
});
</script>
<style scoped></style>
