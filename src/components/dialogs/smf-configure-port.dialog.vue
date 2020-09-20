<template lang="html">
  <b-form class="port-config-dialog" @submit.prevent="">
    <b-form-group>
      <b-input-group class="mt-2" prepend="Bits per Second">
        <b-form-select
          v-model="$v.formModel.$model.bitsPerSecond"
          v-b-popover.hover="'Bits per Second'"
          :options="bitsPerSecondOptions"
          :placeholder="'Bits per Second' | fmtPlaceholder"
          :state="$v.formModel.bitsPerSecond.$invalid ? false : null"
        ></b-form-select>
        <b-form-invalid-feedback v-if="!$v.formModel.bitsPerSecond.required">
          Bits per Second is required.
        </b-form-invalid-feedback>
      </b-input-group>
      <b-input-group class="mt-2" prepend="Data bits">
        <b-form-select
          v-model="$v.formModel.$model.dataBits"
          v-b-popover.hover="'Data bits'"
          :options="dataBitsOptions"
          :placeholder="'Data bits' | fmtPlaceholder"
          :state="$v.formModel.dataBits.$invalid ? false : null"
        ></b-form-select>
        <b-form-invalid-feedback v-if="!$v.formModel.dataBits.required">
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
          v-model="$v.formModel.$model.stopBits"
          v-b-popover.hover="'Stop bits'"
          :options="stopBitsOptions"
          :placeholder="'Stop bits' | fmtPlaceholder"
          :state="$v.formModel.stopBits.$invalid ? false : null"
        ></b-form-select>
        <b-form-invalid-feedback v-if="!$v.formModel.stopBits.required">
          Stop bits is required.
        </b-form-invalid-feedback>
      </b-input-group>
      <b-input-group class="mt-2" prepend="Flow control">
        <b-form-select
          v-model="$v.formModel.$model.flowControl"
          v-b-popover.hover="'Flow control'"
          :options="flowControlOptions"
          :placeholder="'Flow control' | fmtPlaceholder"
          :state="$v.formModel.flowControl.$invalid ? false : null"
        ></b-form-select>
        <b-form-invalid-feedback v-if="!$v.formModel.flowControl.required">
          Flow control is required.
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
      bitsPerSecondOptions: [
        75,
        110,
        300,
        1200,
        2400,
        4800,
        9600,
        19200,
        38400,
        57600,
        115200
      ],
      dataBitsOptions: [5, 6, 7, 8, 9],
      parityOptions: ["None", "Odd", "Even", "Mark", "Space"],
      stopBitsOptions: [1, 1.5, 2],
      flowControlOptions: ["None"]
    };
  },
  validations: {
    formModel: {
      bitsPerSecond: {
        required
      },
      dataBits: {
        required
      },
      parity: {
        required
      },
      stopBits: {
        required
      },
      flowControl: {
        required
      }
    }
  }
});
</script>
<style scoped></style>
