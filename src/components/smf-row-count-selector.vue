<template>
    <b-form-group label-cols-sm="5" class="mb-0" :label="$t('count-of-rows')">
        {{rowCount}}
        <b-form-select
                :value="rowCount"
                :options="options"
                @change="onRowSelectionChanged"/>
    </b-form-group>
</template>

<script lang="js">

    function createFullStoreKey(storeKey) {
        return `smf-${storeKey}-rowCount`;
    }

    export default {
        data() {
            return {
                options: [5,10,15,20, 25,50,100].map( value => ({ value, text: `${value}` }))
            }
        },
        computed: {
            rowCount: {
                set: function(val) {
                    localStorage.setItem(createFullStoreKey(this.storeKey), val);
                },
                get: function() {
                    const storedValue = localStorage.getItem(createFullStoreKey(this.storeKey));
                    return storedValue  ? storedValue : this.value;
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
            onRowSelectionChanged (rowCount) {
                this.rowCount = rowCount;
                this.$emit('input', rowCount);
            }
        }
    }

</script>
