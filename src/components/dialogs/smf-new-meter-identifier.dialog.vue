<template lang="html">
  <b-form class="port-config-dialog" @submit.prevent="">
    <!-- connection -->
    <smf-select
      lable-key="smf-form-meter-connection"
      :vuelidate-form-model="$v.formModel"
      form-property="connection"
      :options="connectionOptions"
      :error-messages="{ required: 'smf-form-meter-connection-is-required' }"
    >
    </smf-select>

    <!-- manufacturerCode -->
    <smf-input
      lable-key="smf-form-meter-manufacturer-code"
      :vuelidate-form-model="$v.formModel"
      form-property="manufacturerCode"
      :error-messages="{
        required: 'smf-form-meter-manufacturer-code-is-required',
        alpha: 'smf-form-meter-manufacturer-code-only-alpha'
      }"
    >
      <b-form-invalid-feedback
        v-if="
          !$v.formModel.manufacturerCode.minLength ||
            !$v.formModel.manufacturerCode.maxLength
        "
      >
        {{ $t("smf-form-meter-manufacturer-code-three-characters") }}
      </b-form-invalid-feedback>
    </smf-input>

    <!-- Meter-Id -->
    <smf-input
      lable-key="smf-form-meter-meterId"
      :vuelidate-form-model="$v.formModel"
      form-property="meterId"
      :error-messages="{
        required: 'smf-form-meter-meterId-is-required',
        meterIdHex: 'smf-form-meter-meterId-must-be-eight-digit-hex'
      }"
    >
    </smf-input>

    <!-- Version -->
    <smf-input
      lable-key="smf-form-meter-version"
      :vuelidate-form-model="$v.formModel"
      form-property="version"
      type="number"
      min="1"
      max="255"
      :error-messages="{
        required: 'smf-form-meter-version-is-required'
      }"
    >
      <b-form-invalid-feedback
        v-if="!$v.formModel.version.minValue || !$v.formModel.version.maxValue"
      >
        {{ $t("smf-form-meter-version-out-of-range") }}
      </b-form-invalid-feedback>
    </smf-input>

    <!-- medium -->
    <smf-select
      lable-key="smf-form-meter-medium"
      :vuelidate-form-model="$v.formModel"
      form-property="medium"
      :options="sortedMediumOptions"
    >
      <b-form-invalid-feedback v-if="!$v.formModel.medium.required">
        {{ $t("smf-form-meter-medium-is-required") }}
      </b-form-invalid-feedback>
    </smf-select>
  </b-form>
</template>
<script lang="ts">
import Vue from "vue";
import {
  maxLength,
  required,
  minLength,
  alpha,
  helpers,
  maxValue,
  minValue
} from "vuelidate/lib/validators";
import { SmfDialogContentMixin } from "@/shared/smf-dialog.service";
import { i18n } from "@/plugins/i18n";
import SmfSelect from "@/components/form-inputs/smf-select.vue";
import SmfInput from "@/components/form-inputs/smf-input.vue";
import { TranslateResult } from "vue-i18n";

const meterIdHex = helpers.regex("alpha", /^[a-fA-F0-9]{8}$/);

interface OptionItem {
  value: string | number;
  text: string | TranslateResult;
}
export default Vue.extend({
  mixins: [SmfDialogContentMixin],
  components: { SmfSelect, SmfInput },
  i18n,
  data() {
    return {
      connectionOptions: [
        { value: 1, text: "wireless" },
        { value: 2, text: "wired" }
      ],
      mediumOptions: [
        { value: 2, text: this.$t("smf-form-meter-medium-electricity") },
        { value: 3, text: this.$t("smf-form-meter-medium-gas") },
        { value: 4, text: this.$t("smf-form-meter-medium-heat") },
        { value: 5, text: this.$t("smf-form-meter-medium-steam") },
        { value: 6, text: this.$t("smf-form-meter-medium-hot-water") },
        { value: 7, text: this.$t("smf-form-meter-medium-water") },
        { value: 1, text: this.$t("smf-form-meter-medium-oil") },
        { value: 0, text: this.$t("smf-form-meter-medium-other") },
        {
          value: 8,
          text: this.$t("smf-form-meter-medium-heat-cost-allocator")
        },
        {
          value: 9,
          text: this.$t("smf-form-meter-medium-compressed-air")
        },
        {
          value: 0xa,
          text: this.$t("smf-form-meter-medium-cooling-load-meter-outlet")
        },
        {
          value: 0xb,
          text: this.$t("smf-form-meter-medium-cooling-load-meter-inlet")
        },
        {
          value: 0xc,
          text: this.$t("smf-form-meter-medium-heat-inlet")
        },
        {
          value: 0xd,
          text: this.$t("smf-form-meter-medium-heat-cooling")
        },
        {
          value: 0xe,
          text: this.$t("smf-form-meter-medium-bus")
        },
        {
          value: 0xf,
          text: this.$t("smf-form-meter-medium-unknown")
        },
        {
          value: 0x14,
          text: this.$t("smf-form-meter-medium-calorific-value")
        },
        {
          value: 0x15,
          text: this.$t("smf-form-meter-medium-boiling-water")
        },
        {
          value: 0x16,
          text: this.$t("smf-form-meter-medium-cold-water")
        },
        {
          value: 0x17,
          text: this.$t("smf-form-meter-medium-dual-water")
        },
        {
          value: 0x18,
          text: this.$t("smf-form-meter-medium-pressure")
        },
        {
          value: 0x19,
          text: this.$t("smf-form-meter-medium-a-d-converter")
        },
        {
          value: 0x1a,
          text: this.$t("smf-form-meter-medium-smoke-detector")
        },
        {
          value: 0x1b,
          text: this.$t("smf-form-meter-medium-room-sensor")
        },
        {
          value: 0x1c,
          text: this.$t("smf-form-meter-medium-gas-detector")
        },
        {
          value: 0x20,
          text: this.$t("smf-form-meter-medium-circuit-breaker")
        },
        {
          value: 0x21,
          text: this.$t("smf-form-meter-medium-ventil")
        },
        {
          value: 0x25,
          text: this.$t("smf-form-meter-medium-display")
        },
        {
          value: 0x28,
          text: this.$t("smf-form-meter-medium-sewage")
        },
        {
          value: 0x29,
          text: this.$t("smf-form-meter-medium-waste")
        },
        {
          value: 0x2a,
          text: this.$t("smf-form-meter-medium-carbon-dioxide")
        }
      ] as OptionItem[]
    };
  },
  validations: {
    formModel: {
      connection: { required },
      manufacturerCode: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(3),
        alpha
      },
      meterId: {
        required,
        meterIdHex
      },
      version: {
        required,
        minValue: minValue(1),
        maxValue: maxValue(255)
      },
      medium: { required }
    }
  },
  methods: {},
  computed: {
    sortedMediumOptions(): OptionItem[] {
      //    original ordering is perfect
      return this.mediumOptions;
    }
  }
});
</script>
<style scoped></style>
