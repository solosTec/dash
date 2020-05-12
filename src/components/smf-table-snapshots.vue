﻿<template lang="html">

    <section class="smf-table-snapshots">
        <b-table ref="tableSnapshots"
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
            <template v-slot:cell(index)="data">
                {{ data.index + 1 + (nav.perPage * (nav.currentPage - 1)) }}
            </template>

            <template v-slot:cell(install)="row">
                <b-button size="sm">Run</b-button>
            </template>

        </b-table>
    </section>

</template>

<script lang="js">


    export default {
        name: 'smf-table-snapshots',
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
                //values: [],
                //selected: [],
                isBusy: false,
                fields: [
                    {
                        key: 'index',
                        class: 'text-right small text-muted'
                    },
                    // pk
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
                        key: 'install',
                        label: 'Install',
                        class: 'text-center'
                    },
                    {
                        key: 'remark',
                        label: 'Remark',
                        sortable: false
                    }

                ],
                sortBy: 'utc',
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
