<template lang="html">
  <b-form @submit.prevent="">
    <smf-input
      lable-key="wmbus-config-address"
      description-key="wmbus-config-address-description"
      :vuelidate-form-model="$v.formModel"
      form-property="address"
      :error-messages="{
        required: 'wmbus-config-address-is-required'
      }"
    >
    </smf-input>

    <smf-input
      lable-key="wmbus-config-port"
      :vuelidate-form-model="$v.formModel"
      form-property="port"
      type="number"
      :error-messages="{
        required: 'wmbus-config-port-is-required'
      }"
    >
    </smf-input>

    <smf-input
      lable-key="wmbus-config-aes"
      :vuelidate-form-model="$v.formModel"
      form-property="aes"
      :error-messages="{
        required: 'wmbus-config-aes-is-required',
        aesHex: 'wmbus-config-aes-must-be-hex'
      }"
    >
    </smf-input>
  </b-form>
</template>
<script lang="ts">
import Vue from "vue";
import { helpers, required } from "vuelidate/lib/validators";
import { SmfDialogContentMixin } from "@/shared/smf-dialog.service";
import { i18n } from "@/plugins/i18n";
import SmfInput from "@/components/form-inputs/smf-input.vue";

const aesHex = helpers.regex("alpha", /^[a-fA-F0-9]{1,256}$/);
export default Vue.extend({
  mixins: [SmfDialogContentMixin],
  components: { SmfInput },
  i18n,
  data() {
    return {};
  },
  validations: {
    formModel: {
      address: { required },
      port: { required },
      aes: { required, aesHex }
    }
  },
  methods: {}
});
</script>
<style scoped></style>
