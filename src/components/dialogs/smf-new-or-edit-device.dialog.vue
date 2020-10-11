<template lang="html">
  <b-form class="port-config-dialog" @submit.prevent="">
    <b-form-group :label="$t('config-device-01')" label-for="smf-form-dev-name">
      <b-form-input
        id="smf-form-dev-name"
        v-model="$v.formModel.$model.name"
        :placeholder="$t('config-device-01-01')"
        :state="$v.formModel.name.$invalid ? false : null"
        type="text"
      />
    </b-form-group>

    <b-form-group label="MSISDN" label-for="smf-form-dev-msisdn">
      <b-form-input
        id="smf-form-dev-msisdn"
        v-model="$v.formModel.$model.msisdn"
        placeholder="<MSISDN>"
        :state="$v.formModel.msisdn.$invalid ? false : null"
        type="text"
      />
    </b-form-group>

    <b-form-group :label="$t('config-device-02')" label-for="smf-form-dev-pwd">
      <b-input-group>
        <b-form-input
          id="smf-form-dev-pwd"
          v-model="$v.formModel.$model.pwd"
          :placeholder="$t('config-device-02-02')"
          :state="$v.formModel.pwd.$invalid ? false : null"
          type="text"
        />
        <b-input-group-append>
          <b-button
            v-b-tooltip.hover
            title="Generate password"
            variant="info"
            v-on:click.stop="generatePassword"
            >&#x21ba;
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>

    <b-form-group
      :label="$t('config-device-03')"
      label-for="smf-form-dev-descr"
    >
      <b-form-input
        id="smf-form-dev-descr"
        v-model="$v.formModel.$model.descr"
        :placeholder="$t('config-device-03-03')"
        type="text"
      />
    </b-form-group>

    <b-form-group label="" label-for="smf-form-dev-enabled">
      <b-form-checkbox
        v-model="$v.formModel.$model.enabled"
        name="smf-form-dev-enabled"
        switch
      >
        {{
          $v.formModel.$model.enabled
            ? $t("config-device-04")
            : $t("config-device-05")
        }}
      </b-form-checkbox>
    </b-form-group>
  </b-form>
</template>
<script lang="ts">
import Vue from "vue";
import { required } from "vuelidate/lib/validators";
import { SmfDialogContentMixin } from "@/shared/smf-dialog.service";
import { generatePassword } from "@/shared/generate-password";
import { i18n } from "@/plugins/i18n";

export default Vue.extend({
  mixins: [SmfDialogContentMixin],
  i18n,
  data() {
    return {};
  },
  validations: {
    formModel: {
      name: { required },
      msisdn: { required },
      pwd: { required },
      descr: {},
      enabled: { required }
    }
  },
  methods: {
    generatePassword() {
      this.$v.formModel.$model.pwd = generatePassword();
    }
  }
});
</script>
<style scoped></style>
