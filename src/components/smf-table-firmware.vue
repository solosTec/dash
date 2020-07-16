<template lang="html">

    <section class="smf-table-firmware">
        <b-table ref="tableFirmware"
                 bordered
                 striped
                 small
                 hover
                 show-empty
                 stacked="md"
                 selectable
                 select-mode="single"
                 selectedVariant="info"
                 :fields="fields"
                 :items="items"
                 primary-key="ident"
                 :sort-by.sync="sortBy"
                 :sort-desc.sync="sortDesc"
                 :sort-direction="sortDirection"
                 class="shadow">

            <!-- A virtual column -->
            <template v-slot:cell(index)="data">
                {{ data.index + 1 + (nav.perPage * (nav.currentPage - 1)) }}
            </template>

        </b-table>
    </section>

</template>

<script lang="js">


    export default {
        name: 'smf-table-firmware',
        props: {
            items: Array
        },
        created() {
        },
        mounted() {
        },
        data() {
            return {
                //values: [],
                //selected: [],
                isBusy: false,
                fields: [
                    {
                        key: 'nr',
                        label: 'Nr',
                        sortable: true,
                        class: 'text-right small'
                    },
                    {
                        key: 'name',
                        label: 'Name',
                        sortable: true
                    },
                    {
                        key: 'version',
                        label: 'Version',
                        sortable: true
                    },
                    {
                        key: 'active',
                        label: 'Active',
                        sortable: true,
                        formatter: (value) => {
                            if (value) return '✔';
                            return '✖';
                        },
                        class: 'text-center'
                    },
                    {
                        key: 'srv',
                        label: 'Server',
                        sortable: true
                    },
                ],
                sortBy: 'nr',
                sortDesc: false,
                sortDirection: 'desc',
                currentPage: 1,
                perPage: 10
            }
        },
        methods: {
        },
        computed: {
        }
    }
</script>

<style scoped lang="css">
</style>
