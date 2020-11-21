<template lang="html">
  <b-form class="port-config-dialog" @submit.prevent="">
    <!-- connection -->
    <b-form-group
      :label="$t('smf-form-meter-connection')"
      label-for="smf-form-meter-connection"
    >
      <b-form-select
        autofocus
        @blur.native="$v.formModel.connection.$touch()"
        id="smf-form-meter-connection"
        v-model="$v.formModel.$model.connection"
        v-b-popover.hover="$t('smf-form-meter-connection')"
        :options="connectionOptions"
        :state="
          $v.formModel.connection.$dirty
            ? !$v.formModel.connection.$invalid
            : null
        "
      ></b-form-select>
      <b-form-invalid-feedback v-if="!$v.formModel.connection.required">
        {{ $t("smf-form-meter-connection-is-required") }}
      </b-form-invalid-feedback>
    </b-form-group>

    <!-- manufacturerCode -->
    <b-form-group
      :label="$t('smf-form-meter-manufacturer-code')"
      label-for="smf-form-meter-manufacturer-code"
    >
      <b-form-input
        @blur="$v.formModel.manufacturerCode.$touch()"
        id="smf-form-meter-manufacturer-code"
        v-model="$v.formModel.$model.manufacturerCode"
        :placeholder="$t('smf-form-meter-manufacturer-code') | fmtPlaceholder"
        :state="
          $v.formModel.manufacturerCode.$dirty
            ? !$v.formModel.manufacturerCode.$invalid
            : null
        "
      ></b-form-input>
      <b-form-invalid-feedback v-if="!$v.formModel.manufacturerCode.required">
        {{ $t("smf-form-meter-manufacturer-code-is-required") }}
      </b-form-invalid-feedback>
      <b-form-invalid-feedback
        v-if="
          !$v.formModel.manufacturerCode.minLength ||
            !$v.formModel.manufacturerCode.maxLength
        "
      >
        {{ $t("smf-form-meter-manufacturer-code-three-characters") }}
      </b-form-invalid-feedback>
      <b-form-invalid-feedback v-if="!$v.formModel.manufacturerCode.alpha">
        {{ $t("smf-form-meter-manufacturer-code-only-alpha") }}
      </b-form-invalid-feedback>
    </b-form-group>

    <!-- Meter-Id -->
    <b-form-group
      :label="$t('smf-form-meter-meterId')"
      label-for="smf-form-meter-meterId"
    >
      <b-form-input
        id="smf-form-meter-meterId"
        @blur="$v.formModel.meterId.$touch()"
        v-model="$v.formModel.$model.meterId"
        :placeholder="$t('smf-form-meter-meterId') | fmtPlaceholder"
        :state="
          $v.formModel.meterId.$dirty ? !$v.formModel.meterId.$invalid : null
        "
      ></b-form-input>
      <b-form-invalid-feedback v-if="!$v.formModel.meterId.required">
        {{ $t("smf-form-meter-meterId-is-required") }}
      </b-form-invalid-feedback>
      <b-form-invalid-feedback v-if="!$v.formModel.meterId.meterIdHex">
        {{ $t("smf-form-meter-meterId-must-be-eight-digit-hex") }}
      </b-form-invalid-feedback>
    </b-form-group>

    <!-- Version -->
    <b-form-group
      :label="$t('smf-form-meter-version')"
      label-for="smf-form-meter-version"
    >
      <b-form-input
        id="smf-form-meter-version"
        @blur="$v.formModel.version.$touch()"
        type="number"
        min="1"
        max="255"
        v-model="$v.formModel.$model.version"
        :placeholder="$t('smf-form-meter-version') | fmtPlaceholder"
        :state="
          $v.formModel.version.$dirty ? !$v.formModel.version.$invalid : null
        "
      ></b-form-input>
      <b-form-invalid-feedback v-if="!$v.formModel.version.required">
        {{ $t("smf-form-meter-version-is-required") }}
      </b-form-invalid-feedback>
      <b-form-invalid-feedback
        v-if="!$v.formModel.version.minValue || !$v.formModel.version.maxValue"
      >
        {{ $t("smf-form-meter-version-out-of-range") }}
      </b-form-invalid-feedback>
    </b-form-group>

    <!-- medium -->
    <b-form-group
      :label="$t('smf-form-meter-medium')"
      label-for="smf-form-meter-medium"
    >
      <b-form-select
        @blur.native="$v.formModel.medium.$touch()"
        id="smf-form-meter-medium"
        v-model="$v.formModel.$model.medium"
        v-b-popover.hover="$t('smf-form-meter-medium')"
        :options="sortedMediumOptions"
        :state="
          $v.formModel.medium.$dirty ? !$v.formModel.medium.$invalid : null
        "
      ></b-form-select>
      <b-form-invalid-feedback v-if="!$v.formModel.medium.required">
        {{ $t("smf-form-meter-medium-is-required") }}
      </b-form-invalid-feedback>
    </b-form-group>
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

const meterIdHex = helpers.regex("alpha", /^[a-fA-F0-9]{8}$/);

interface OptionItem {
  value: string;
  text: string;
}
export default Vue.extend({
  mixins: [SmfDialogContentMixin],
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
