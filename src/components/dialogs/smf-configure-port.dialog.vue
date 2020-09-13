<template lang="html">
    <b-form @submit.prevent="" class="port-config-dialog">
        <b-form-group>
            <b-input-group prepend="Bits per Second" class="mt-2">
                <b-form-select
                    v-model="$v.formModel.$model.bitsPerSecond"
                    :options="bitsPerSecondOptions"
                    :placeholder="'Bits per Second' | fmtPlaceholder"
                    v-b-popover.hover="'Bits per Second'"
                    :state="$v.formModel.bitsPerSecond.$invalid ? false: null"></b-form-select>
                <b-form-invalid-feedback v-if="!$v.formModel.bitsPerSecond.required">
                    Bits per Second is required.
                </b-form-invalid-feedback>
            </b-input-group>
            <b-input-group prepend="Data bits" class="mt-2">
                <b-form-select
                    v-model="$v.formModel.$model.dataBits"
                    :options="dataBitsOptions"
                    :placeholder="'Data bits' | fmtPlaceholder"
                    v-b-popover.hover="'Data bits'"
                    :state="$v.formModel.dataBits.$invalid ? false: null"></b-form-select>
                <b-form-invalid-feedback v-if="!$v.formModel.dataBits.required">
                    Data bits is required.
                </b-form-invalid-feedback>
            </b-input-group>
            <b-input-group prepend="Parity" class="mt-2">
                <b-form-select
                    v-model="$v.formModel.$model.parity"
                    :options="parityOptions"
                    :placeholder="'Parity' | fmtPlaceholder"
                    v-b-popover.hover="'Parity'"
                    :state="$v.formModel.parity.$invalid ? false: null"></b-form-select>
                <b-form-invalid-feedback v-if="!$v.formModel.parity.required">
                    Parity is required.
                </b-form-invalid-feedback>
            </b-input-group>
            <b-input-group prepend="Stop bits" class="mt-2">
                <b-form-select
                    v-model="$v.formModel.$model.stopBits"
                    :options="stopBitsOptions"
                    :placeholder="'Stop bits' | fmtPlaceholder"
                    v-b-popover.hover="'Stop bits'"
                    :state="$v.formModel.stopBits.$invalid ? false: null"></b-form-select>
                <b-form-invalid-feedback v-if="!$v.formModel.stopBits.required">
                    Stop bits is required.
                </b-form-invalid-feedback>
            </b-input-group>
            <b-input-group prepend="Flow control" class="mt-2">
                <b-form-select
                    v-model="$v.formModel.$model.flowControl"
                    :options="flowControlOptions"
                    :placeholder="'Flow control' | fmtPlaceholder"
                    v-b-popover.hover="'Flow control'"
                    :state="$v.formModel.flowControl.$invalid ? false: null"></b-form-select>
                <b-form-invalid-feedback v-if="!$v.formModel.flowControl.required">
                    Flow control is required.
                </b-form-invalid-feedback>
            </b-input-group>
        </b-form-group>
    </b-form>
</template>
<script lang="ts">
import Vue from 'vue';
import {required} from 'vuelidate/lib/validators';
import {SmfDialogContentMixin} from '@/shared/smf-dialog.service';

export default Vue.extend({
    mixins: [SmfDialogContentMixin],
    data() {
        return {
            bitsPerSecondOptions: [75, 110, 300, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200],
            dataBitsOptions: [5, 6, 7, 8, 9],
            parityOptions: ['None', 'Odd', 'Even', 'Mark', 'Space'],
            stopBitsOptions: [1, 1.5, 2],
            flowControlOptions: ['None']
        }
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
            },
        }
    }
});
</script>
<style scoped>

.input-group-text {
    min-width: 150px;
}

</style>
