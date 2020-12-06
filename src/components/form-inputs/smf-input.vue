<template lang="html">
  <b-form-group :label="$t(lableKey)" :label-for="lableKey">
    <b-form-input
      :type="type"
      @blur="vuelidateFormModel[formProperty].$touch()"
      :id="lableKey"
      :min="min ? min : ''"
      :max="max ? max : ''"
      :number="type === 'number'"
      @input="transformInput"
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
import Vue, { PropType } from "vue";
import { InputTransformer } from "./input-transformer";
import { VueComponentInstance } from "../../shared/smf-dialog.service";

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
    },
    inputTransformer: {
      type: Object as PropType<InputTransformer>,
      required: false
    }
  },
  data() {
    return {};
  },
  methods: {
    transformInput(val: string): void {
      if (!this.inputTransformer) {
        return;
      }
      (this.vuelidateFormModel as any).$model[
        this.formProperty
      ] = this.inputTransformer.transform(val);
    }
  },
  computed: {},
  watch: {}
});
</script>
