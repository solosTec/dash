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
import Vue, {PropType} from 'vue';
import {required} from 'vuelidate/lib/validators';
import {BBrokerPortHardwareConfig} from '@/api/broker';
import {SmfDialogService} from '@/shared/smf-dialog.service';

export default Vue.extend({
    name: 'smfConfigurePortDialog',
    props: {
        formModel: {
            type: Object as PropType<BBrokerPortHardwareConfig>,
            required: true
        }
    },
    validations: {
        formModel: {
            baudRate: {
                required
            }
        }
    },
    mounted() {
        // emit the initial state - because we mount the component after creation
        SmfDialogService.emitFormState.call(this);
    },
    watch: {
        '$v': {
            immediate: true,
            handler() {
                SmfDialogService.emitFormState.call(this);
            },
            deep: true
        }
    }
});
</script>
