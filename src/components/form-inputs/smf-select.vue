<template lang="html">
  <b-form-group :label="$t(lableKey)" :label-for="lableKey">
    <b-form-select
      @blur.native="vuelidateFormModel[formProperty].$touch()"
      :id="lableKey"
      v-model="vuelidateFormModel.$model[formProperty]"
      v-b-popover.hover="$t(lableKey)"
      :options="options"
      :state="
        vuelidateFormModel[formProperty].$dirty
          ? !vuelidateFormModel[formProperty].$invalid
          : null
      "
    ></b-form-select>
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
    options: {
      type: Array,
      required: true
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
