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
      :disabled="true"
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
      :disabled="true"
    >
    </smf-input>

    <smf-input
      lable-key="wmbus-config-meter"
      :vuelidate-form-model="$v.formModel"
      form-property="meter"
      :error-messages="{
        required: 'wmbus-config-meter-is-required'
      }"
      :disabled="dialogMode === DialogMode.UPDATE"
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
import { DialogMode, SmfDialogContentMixin } from "@/shared/smf-dialog.service";
import { i18n } from "@/plugins/i18n";
import SmfInput from "@/components/form-inputs/smf-input.vue";

const aesHex = helpers.regex("alpha", /^[a-fA-F0-9]{1,256}$/);
export default Vue.extend({
  mixins: [SmfDialogContentMixin],
  components: { SmfInput },
  i18n,
  props: {
    dialogMode: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      DialogMode: DialogMode
    };
  },
  validations: {
    formModel: {
      address: { required },
      port: { required },
      aes: { required, aesHex },
      meter: { required }
    }
  },
  methods: {}
});
</script>
<style scoped></style>
