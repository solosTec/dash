<template lang="html">
  <b-form-group :label="$t(lableKey)" :label-for="lableKey">
    <b-form-input
      :type="type"
      @blur="vuelidateFormModel[formProperty].$touch()"
      :id="lableKey"
      :min="min ? min : ''"
      :max="max ? max : ''"
      v-model="vuelidateFormModel.$model[formProperty]"
      :placeholder="$t(lableKey) | fmtPlaceholder"
      :state="
        vuelidateFormModel[formProperty].$dirty
          ? !vuelidateFormModel[formProperty].$invalid
          : null
      "
    ></b-form-input>
    <template v-for="(errorMessage, errorKey) in errorMessages">
      <b-form-invalid-feedback
        :key="errorKey"
        v-if="!vuelidateFormModel[formProperty][errorKey]"
      >
        {{ $t(errorMessage) }}
      </b-form-invalid-feedback>
    </template>
    <slot></slot>
  </b-form-group>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "smfSelect",
  props: {
    lableKey: {
      type: String,
      required: true
    },
    vuelidateFormModel: {
      type: Object as any,
      required: true
    },
    formProperty: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: false,
      default: () => "text"
    },
    min: {
      type: [Number, String],
      required: false
    },
    max: {
      type: [Number, String],
      required: false
    },
    errorMessages: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  methods: {},
  computed: {},
  watch: {}
});
</script>
