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

const meterIdHex = helpers.regex("alpha", /^[a-fA-F0-9]{8}$/);

interface OptionItem {
  value: string;
  text: string;
}
export default Vue.extend({
  mixins: [SmfDialogContentMixin],
  components: { SmfSelect, SmfInput },
  i18n,
  data() {
    return {
      connectionOptions: [
        { value: "01", text: "wireless" },
        { value: "01", text: "wired" }
      ],
      mediumOptions: [
        { value: "00", text: this.$t("smf-form-meter-medium-other") },
        { value: "01", text: this.$t("smf-form-meter-medium-oil") },
        { value: "02", text: this.$t("smf-form-meter-medium-electricity") },
        { value: "03", text: this.$t("smf-form-meter-medium-gas") },
        { value: "04", text: this.$t("smf-form-meter-medium-heat") },
        { value: "05", text: this.$t("smf-form-meter-medium-steam") },
        { value: "06", text: this.$t("smf-form-meter-medium-hot-water") },
        { value: "07", text: this.$t("smf-form-meter-medium-water") },
        {
          value: "08",
          text: this.$t("smf-form-meter-medium-heat-cost-allocator")
        },
        {
          value: "09",
          text: this.$t("smf-form-meter-medium-compressed-air")
        },
        {
          value: "0A",
          text: this.$t("smf-form-meter-medium-cooling-load-meter-outlet")
        },
        {
          value: "0B",
          text: this.$t("smf-form-meter-medium-cooling-load-meter-inlet")
        },
        {
          value: "0C",
          text: this.$t("smf-form-meter-medium-heat-inlet")
        },
        {
          value: "0D",
          text: this.$t("smf-form-meter-medium-heat-cooling")
        },
        {
          value: "0E",
          text: this.$t("smf-form-meter-medium-bus")
        },
        {
          value: "0F",
          text: this.$t("smf-form-meter-medium-unknown")
        },
        {
          value: "14",
          text: this.$t("smf-form-meter-medium-calorific-value")
        },
        {
          value: "15",
          text: this.$t("smf-form-meter-medium-boiling-water")
        },
        {
          value: "16",
          text: this.$t("smf-form-meter-medium-cold-water")
        },
        {
          value: "17",
          text: this.$t("smf-form-meter-medium-dual-water")
        },
        {
          value: "18",
          text: this.$t("smf-form-meter-medium-pressure")
        },
        {
          value: "19",
          text: this.$t("smf-form-meter-medium-a-d-converter")
        },
        {
          value: "1A",
          text: this.$t("smf-form-meter-medium-smoke-detector")
        },
        {
          value: "1B",
          text: this.$t("smf-form-meter-medium-room-sensor")
        },
        {
          value: "1C",
          text: this.$t("smf-form-meter-medium-gas-detector")
        },
        {
          value: "20",
          text: this.$t("smf-form-meter-medium-circuit-breaker")
        },
        {
          value: "21",
          text: this.$t("smf-form-meter-medium-ventil")
        },
        {
          value: "25",
          text: this.$t("smf-form-meter-medium-display")
        },
        {
          value: "28",
          text: this.$t("smf-form-meter-medium-sewage")
        },
        {
          value: "29",
          text: this.$t("smf-form-meter-medium-waste")
        },
        {
          value: "2A",
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
      return this.mediumOptions
        .slice()
        .sort((opt1, opt2) => opt1.text.localeCompare(opt2.text));
    }
  }
});
</script>
<style scoped></style>
