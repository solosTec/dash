<template lang="html">
    <b-form @submit.prevent="">
        <b-form-group>
            <b-input-group prepend="BaudRate" class="mt-2">
                <b-form-input
                    type="number"
                    v-model.number="$v.formModel.$model.baudRate"
                    v-b-popover.hover="'Baudrate'"
                    :placeholder="'Bausdate' | fmtPlaceholder"
                    :state="$v.formModel.baudRate.$invalid ? false: null">
                </b-form-input>
                <b-form-invalid-feedback v-if="!$v.formModel.baudRate.required">
                    BausRate is required.
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
    validations: {
        formModel: {
            baudRate: {
                required
            }
        }
    }
});
</script>
