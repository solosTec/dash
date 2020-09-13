<template lang="html">
    <b-modal ref="dialog"
             :title=title
             @close="close"
             @cancel="close"
             @ok="ok"
             :ok-disabled="okDisabled"
             centered>
        <div ref="dialogContent"/>
    </b-modal>
</template>
<script lang="ts">
import Vue, {PropType} from 'vue';
import {DialogFormState, VueComponentInstance} from '@/shared/smf-dialog.service';
import {BModal} from 'bootstrap-vue';

export default Vue.extend({
    name: 'smfGenericFormDialog',
    props: {
        parent: {
            type: Object as PropType<VueComponentInstance>,
            required: true
        },
        dialogContentComponent: {
            type: Object as PropType<VueComponentInstance>,
            required: true
        },
        title: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            dialogRefElement: null as (HTMLElement | null),
            okDisabled: true,
            formModel: null,
        }
    },
    created() {
        this.$mount();
        this.dialogRefElement = this.parent.$root.$el.appendChild(this.$el);
    },
    methods: {
        close() {
            this.$emit('close', null);
            this.$destroy();
        },
        ok() {
            // cleaup the json object - no listeners required
            this.$emit('close', JSON.parse(JSON.stringify(this.formModel)));
            this.$destroy();
        }
    },
    mounted() {
        // show the modal dialog immediately.
        (this.$refs.dialog as BModal).show();

        const originalFormModel = JSON.stringify(this.dialogContentComponent.formModel);

        this.dialogContentComponent.$on('formState', ({invalid, formModel}: DialogFormState<any>) => {
            const changed = originalFormModel !== JSON.stringify(formModel)
            this.okDisabled = !changed || invalid;
            this.formModel = formModel;
        });

        // the dialog must be rendered first before the this.$refs.dialogContent is available
        setTimeout(() => {
            this.dialogContentComponent.$mount(this.$refs.dialogContent)
        });

    },
    destroyed() {
        // remove the dialog form the dom
        if (this.dialogRefElement) {
            this.dialogRefElement.remove();
        }
        // remove all event listeners regostered by $on.
        this.$off();
        this.dialogContentComponent.$off();
    }
});


</script>
