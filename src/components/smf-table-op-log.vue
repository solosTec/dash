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
                 primary-key="index"
                 :sort-by.sync="sortBy"
                 :sort-desc.sync="sortDesc"
                 :sort-direction="sortDirection"
                 class="shadow">

            <!-- A virtual column -->
            <template slot="index" slot-scope="data">
                {{ data.index + 1 }}
            </template>

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
                        key: 'index',
                        class: 'text-right small text-muted'
                    },
                    //{
                    //    key: 'actTime',
                    //    label: 'actTime',
                    //    sortable: true
                    //},
                    //{
                    //    key: 'regPeriod',
                    //    label: 'regPeriod',
                    //    sortable: true,
                    //    class: 'text-right'
                    //},
                    //{
                    //    key: 'valTime',
                    //    label: 'valTime',
                    //    sortable: true,
                    //    class: 'text-right'
                    //},
                    {
                        key: 'status',
                        label: 'Status',
                        sortable: true,
                        formatter: (value, key, item) => {
                            return value.toString(16);
                        },
                        class: 'text-right'
                    },
                    {
                        key: 'event',
                        label: 'Event',
                        //class: 'text-center',
                        formatter: (value, key, item) => {
                            if (value == 8388608) return 'cyclic log entry';
                            else if (value == 1048577) return 'power return';
                            else if (value == 1048578) return 'power failure';
                            else if (value == 8454146) return 'time base is saved';
                            else if (value == 34603017) return 'customer/service interface not connected';
                            else if (value == 1232076810) return 'IP-T access is done';
                            else if (value == 1248854026) return 'NTP access is done';
                            else if (value == 8388617) return 'push not successful';
                            else if (value == 8388616) return 'push successful';
                            else if (value == 1232076814) return 'IP-T access lost';
                            return value;
                        }
                    },
                    {
                        key: 'peer',
                        label: 'Peer',
                        sortable: true,
                        formatter: (value, key, item) => {
                            if (value == '818100000013') return 'WAN/GSM';
                            else if (value == '818100000001') return "OBISLOG";
                            else if (value == '818100000002') return "SCM";
                            else if (value == '818100000011') return "USERIF";
                            else if (value == '814A000000FF') return 'WAN (NTP)';
                            else if (value == '8146000002FF') return 'addressed profile';
                            else if (value == '8146000003FF') return 'installation parameters';
                            //else if (value == '8146000005FF') return 'addressed profile (5)';
                            else if (value == '8146000012FF') return 'Load switch module status';
                            return value;
                        }
                    },
                    {
                        key: 'utc',
                        label: 'UTC',
                        sortable: true,
                        formatter: (value, key, item) => {
                            return value.toLocaleString()
                        }
                    },
                    {
                        key: 'serverId',
                        label: 'Server ID',
                        sortable: true
                    },
                    {
                        key: 'target',
                        label: 'Target',
                        sortable: true
                    },
                    {
                        key: 'pushNr',
                        label: 'Push Nr',
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
