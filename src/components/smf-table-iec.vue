﻿<template lang="html">

     <b-container class="smf-table-iec" fluid>
         <!--navigation-->
         <b-row>
             <b-col md="6">
                 <b-form-group label-cols-sm="3" :label="$t('tbl-filter')" class="mb-0">
                     <b-input-group>
                         <b-form-input v-model="nav.filter" :placeholder="$t('tbl-search')" />
                         <b-input-group-append>
                             <b-button :disabled="!nav.filter" @click="nav.filter = ''">{{ $t('action-del') }}</b-button>
                         </b-input-group-append>
                     </b-input-group>
                 </b-form-group>
             </b-col>
             <b-col md="6">
                 <b-form-row>
                     <smf-row-count-selector v-model="nav.perPage" store-key="meter" class="col" />
                     <b-pagination v-model="nav.currentPage" :total-rows="nav.visibleRows" :per-page="nav.perPage" class="justify-content-end" />
                 </b-form-row>
             </b-col>
         </b-row>
         <!--table with IEC devices-->
         <b-row>
             <b-col md="12">
                 <b-table ref="tableIEC"
                          bordered
                          striped
                          small
                          hover
                          show-empty
                          stacked="md"
                          selectable
                          select-mode="range"
                          selectedVariant="info"
                          @row-selected="rowSelected"
                          :fields="fields"
                          :items="items"
                          :busy="isBusy"
                          :current-page="nav.currentPage"
                          :per-page="nav.perPage"
                          :filter="nav.filter"
                          @filtered="onFiltered"
                          primary-key="pk"
                          :sort-by.sync="sortBy"
                          :sort-desc.sync="sortDesc"
                          :sort-direction="sortDirection">

                     <!-- A virtual column -->
                     <template v-slot:cell(index)="data">
                         {{ data.index + 1 + (nav.perPage * (nav.currentPage - 1)) }}
                     </template>

                     <!-- loading slot -->
                     <div slot="table-busy" class="text-center text-danger">
                         <strong>Loading... {{nav.busyLevel}}%</strong>
                     </div>

                 </b-table>
             </b-col>
         </b-row>
     </b-container>

</template>

<script lang="js">

    export default {
        name: 'smf-table-iec',
        props: {
            items: Array,
            nav: Object,
            value: Array
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
                    // pk
                    {
                        key: 'meter',
                        label: 'Meter',
                        sortable: true
                    },
                    {
                        key: 'address',
                        label: 'IP Address',
                        sortable: true
                    },
                    {
                        key: 'port',
                        label: 'IP Port',
                        sortable: true
                    },                    {
                        key: 'direction',
                        label: 'Direction',
                        class: 'text-center',
                        formatter: (value, key, item) => {
                            return value
                                ? "↤ incoming"
                                : "outgoing ↦";
                        }
                    },
                    {
                        key: 'interval',
                        label: 'Interval',
                        sortable: true,
                        //formatter: (value, key, item) => {
                        //    if (value > 100) {
                        //        return Math.floor(value / 60) + " min " + (value % 60) + " sec";
                        //    }
                        //    return value + " sec";
                        //}
                    }
                ],
                sortBy: 'ep',
                sortDesc: false,
                sortDirection: 'desc',
            }
        },
        methods: {
            onFiltered(filteredItems) {
                // Trigger pagination to update the number of buttons/pages due to filtering
                this.nav.visibleRows = filteredItems.length;
                this.nav.currentPage = 1
            },
            rowSelected(items) {
                //this.$emit('input', items);
                this.$emit('rowSelected', items);
            }
        },

        computed: {
        }
    }
</script>

<style scoped lang="css">
</style>
