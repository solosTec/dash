<template lang="html">

    <section class="smf-table-op-log">
        <b-table ref="tableOpLog"
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
                 :busy="isBusy"
                 primary-key="pk"
                 :sort-by.sync="sortBy"
                 :sort-desc.sync="sortDesc"
                 :sort-direction="sortDirection"
                 class="shadow">

            <!--:current-page="currentPage"
    @row-selected="rowSelected"
    :per-page="perPage"
    :filter="filter"
    @filtered="onFiltered"-->

        </b-table>
    </section>

</template>

<script lang="js">


    export default {
        name: 'smf-table-op-log',
        props: {
            items: Array,
        },
        created() {
        },
        mounted() {
        },
        data() {
            return {
                isBusy: false,
                fields: [
                    {
                        key: 'nr',
                        class: 'text-right small text-muted',
                        sortable: true
                    },
                    {
                        key: 'actTime',
                        label: 'actTime',
                        sortable: true
                    },
                    {
                        key: 'regPeriod',
                        label: 'regPeriod',
                        sortable: true,
                        class: 'text-right'
                    },
                    {
                        key: 'valTime',
                        label: 'valTime',
                        sortable: true,
                        class: 'text-right'
                    },
                    {
                        key: 'status',
                        label: 'status',
                        sortable: true,
                        class: 'text-right'
                    },
                    {
                        key: 'event',
                        label: 'event',
                        class: 'text-center'
                    },
                    {
                        key: 'peer',
                        label: 'peer',
                        sortable: true
                    },
                    {
                        key: 'utc',
                        label: 'utc',
                        sortable: true
                    },
                    {
                        key: 'serverId',
                        label: 'serverId',
                        sortable: true
                    },
                    {
                        key: 'target',
                        label: 'target',
                        sortable: true
                    },
                    {
                        key: 'pushNr',
                        label: 'pushNr',
                        sortable: true
                    }
                ],
                //items: [{nr:1, active: true, entries: 101, OBIS:'77', name:'name'}],
                sortBy: 'nr',
                sortDesc: false,
                sortDirection: 'desc',
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
