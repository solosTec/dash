<template>
    <b-form-group label-cols-sm="5" class="mb-0" :label="$t('count-of-rows')">
        <b-form-select
                :value="rowCount"
                :options="options"
                @change="onRowSelectionChanged"/>
    </b-form-group>
</template>

<script lang="js">

    export default {
        data() {
            return {
                rowCount: this.value,
                options: [5,10,15,20, 25,50,100].map( value => ({ value, text: `${value}` }))
            }
        },
        props: ['value'],
        methods: {
            onRowSelectionChanged (rowCount) {
                this.rowCount = rowCount;
                this.$emit('input', this.rowCount);
            }
        }
    }

</script>

<style>

</style>
