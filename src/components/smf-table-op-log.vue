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
            :current-page="nav.currentPage"
            :per-page="nav.perPage"
            primary-key="index"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            class="shadow">

            <!-- A virtual column -->
            <template slot="index" slot-scope="data">
                {{ data.index + 1 + (nav.perPage * (nav.currentPage - 1)) }}
            </template>

        </b-table>
    </section>

</template>

<script lang="js">


    export default {
        name: 'smf-table-op-log',
        props: {
            items: Array,
            nav: Object
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
                            else if (value == 1048611) return 'power failure (return)';
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
                            if (value == '8101000000FF') return 'ETH (ext)';
                            else if (value == '8102000000FF') return "ETH (custom)";
                            else if (value == '8103000000FF') return "RS232 (service)";

                            else if (value == '8104000000FF') return "ETH (WAN)";
                            else if (value == '8105000000FF') return "eHZ";
                            else if (value == '8106000000FF') return "W-MBus";
                            else if (value == '8141000000FF') return "IP";
                            else if (value == '814200000001') return "SML(ext)";
                            else if (value == '814200000002') return "SML(custom)";
                            else if (value == '814200000003') return "SML(service)";
                            else if (value == '814200000004') return "SML(WAN)";
                            else if (value == '814200000005') return "SML(eHZ)";
                            else if (value == '814200000006') return "SML(W-MBUS)";
                            else if (value == '8145000000FF') return "Push(SML)";
                            else if (value == '8146000000FF') return "Push(IP-T source)";
                            else if (value == '8147000000FF') return "Push(IP-T target)";
                            else if (value == '814800000001') return "WAN(DHCP)";
                            else if (value == '814800000002') return "WAN(IP)";
                            else if (value == '814800000003') return "WAN(PPPoE)";
                            else if (value == '814900000001') return "WAN(IP-T - Cntrl)";
                            else if (value == '814900000002') return "WAN(IPT)";
                            else if (value == '814A000000FF') return "WAN(NTP)";
                            else if (value == '818100000001') return "OBISLOG";
                            else if (value == '818100000002') return "SCM";
                            else if (value == '818100000003') return "UPDATE";
                            else if (value == '818100000004') return "SMLC";
                            else if (value == '818100000005') return "OHDL_MUCCFG";
                            else if (value == '818100000006') return "OHDL_SMLDL";
                            else if (value == '818100000007') return "AUTHC";
                            else if (value == '818100000008') return "BSZ";
                            else if (value == '818100000009') return "DATACOLL";
                            else if (value == '81810000000A') return "SHDL";
                            else if (value == '81810000000B') return "GPRS";
                            else if (value == '81810000000C') return "LEDIO";
                            else if (value == '81810000000D') return "LISTC";
                            else if (value == '81810000000E') return "SYNC_MUC";
                            else if (value == '81810000000F') return "SYNC_MUCDC";
                            else if (value == '818100000010') return "EHZIF";
                            else if (value == '818100000011') return "USERIF";
                            else if (value == '818100000012') return "WMBUS";
                            else if (value == '818100000013') return "WANGSM";
                            else if (value == '818100000014') return "WANPLC";

                            else if (value == '8146000011FF') return 'Load switch mdoule events';
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
                    },
                    {
                        key: 'details',
                        label: 'Details',
                        sortable: false
                    }
                    
                ],
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
