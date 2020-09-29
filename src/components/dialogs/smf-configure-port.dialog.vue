<template lang="html">
  <b-form class="port-config-dialog" @submit.prevent="">
    <b-form-group>
      <b-input-group class="mt-2" prepend="Data bits">
        <b-form-select
          v-model="$v.formModel.$model.databits"
          v-b-popover.hover="'Data bits'"
          :options="dataBitsOptions"
          :placeholder="'Data bits' | fmtPlaceholder"
          :state="$v.formModel.databits.$invalid ? false : null"
        ></b-form-select>
        <b-form-invalid-feedback v-if="!$v.formModel.databits.required">
          Data bits is required.
        </b-form-invalid-feedback>
      </b-input-group>
      <b-input-group class="mt-2" prepend="Parity">
        <b-form-select
          v-model="$v.formModel.$model.parity"
          v-b-popover.hover="'Parity'"
          :options="parityOptions"
          :placeholder="'Parity' | fmtPlaceholder"
          :state="$v.formModel.parity.$invalid ? false : null"
        ></b-form-select>
        <b-form-invalid-feedback v-if="!$v.formModel.parity.required">
          Parity is required.
        </b-form-invalid-feedback>
      </b-input-group>
      <b-input-group class="mt-2" prepend="Stop bits">
        <b-form-select
          v-model="$v.formModel.$model.stopbits"
          v-b-popover.hover="'Stop bits'"
          :options="stopBitsOptions"
          :placeholder="'Stop bits' | fmtPlaceholder"
          :state="$v.formModel.stopbits.$invalid ? false : null"
        ></b-form-select>
        <b-form-invalid-feedback v-if="!$v.formModel.stopbits.required">
          Stop bits is required.
        </b-form-invalid-feedback>
      </b-input-group>
      <b-input-group class="mt-2" prepend="Flow control">
        <b-form-select
          v-model="$v.formModel.$model.flowcontrol"
          v-b-popover.hover="'Flow control'"
          :options="flowControlOptions"
          :placeholder="'Flow control' | fmtPlaceholder"
          :state="$v.formModel.flowcontrol.$invalid ? false : null"
        ></b-form-select>
        <b-form-invalid-feedback v-if="!$v.formModel.flowcontrol.required">
          Flow control is required.
        </b-form-invalid-feedback>
      </b-input-group>
      <b-input-group class="mt-2" prepend="Baudrate">
        <b-form-select
          v-model="$v.formModel.$model.baudrate"
          v-b-popover.hover="'Baudrate in bit/sec'"
          :options="baudrateOptions"
          :placeholder="'Baudrate' | fmtPlaceholder"
          :state="$v.formModel.baudrate.$invalid ? false : null"
        ></b-form-select>
        <b-form-invalid-feedback v-if="!$v.formModel.baudrate.required">
          Baudrate is required.
        </b-form-invalid-feedback>
      </b-input-group>
    </b-form-group>
  </b-form>
</template>
<script lang="ts">
import Vue from "vue";
import { required } from "vuelidate/lib/validators";
import { SmfDialogContentMixin } from "@/shared/smf-dialog.service";

export default Vue.extend({
  mixins: [SmfDialogContentMixin],
  data() {
    return {
      dataBitsOptions: [5, 6, 7, 8, 9],
      parityOptions: [
        { value: "odd", text: "Odd" },
        { value: "even", text: "Even" },
        { value: "none", text: "None" }
      ],
      stopBitsOptions: [
        { value: "one", text: "1" },
        { value: "onepointfive", text: "1.5" },
        { value: "two", text: "2" }
      ],
      flowControlOptions: [
        { value: "software", text: "Software" },
        { value: "hardware", text: "Hardware" },
        { value: "none", text: "None" }
      ],
      baudrateOptions: [
        600,
        1200,
        2400,
        4800,
        9600,
        14400,
        19200,
        38400,
        57600,
        115200
      ]
    };
  },
  validations: {
    formModel: {
      databits: { required },
      parity: { required },
      stopbits: { required },
      flowcontrol: { required },
      baudrate: { required }
    }
  }
});
</script>
<style scoped>
/* make the fromGroup labels with equal width*/
/*noinspection ALL*/
.input-group-text {
  min-width: 150px;
}
</style>
