<template>
    <b-form-group label-cols-sm="5" class="mb-0" :label="$t('tbl-lines-per-page')">
        <b-form-select
                :value="rowCount"
                :options="options"
                @change="onRowSelectionChanged"/>
    </b-form-group>
</template>

<script lang="ts">

    import Vue from 'vue'

    function createFullStoreKey(storeKey: string) {
        return `smf-${storeKey}-rowCount`;
    }

    export default Vue.extend({
        data() {
            return {
                options: [5,10,15,20, 25,50,100].map( value => ({ value, text: `${value}` }))
            }
        },
        computed: {
            rowCount: {
                set: function(val: number) {
                    localStorage.setItem(createFullStoreKey(this.storeKey), String(val));
                },
                get: function(): number {
                    const storedValue = localStorage.getItem(createFullStoreKey(this.storeKey));
                    return storedValue  ? +storedValue : this.value;
                }
            }
        },
        props: {
            'value': {
                type: Number,
                required: true
            },
            'storeKey': {
                type: String,
                required: true
            }
        },
        methods: {
            onRowSelectionChanged (rowCount: number) {
                this.rowCount = rowCount;
                this.$emit('input', rowCount);
            }
        }
    })

</script>
