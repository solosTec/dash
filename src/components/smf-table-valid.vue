<template lang="html">

     <b-container class="smf-table-valid" fluid>
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
                     <smf-row-count-selector v-model="nav.perPage" store-key="valid" class="col" />
                     <b-pagination v-model="nav.currentPage" :total-rows="nav.visibleRows" :per-page="nav.perPage" class="justify-content-end" />
                 </b-form-row>
             </b-col>
         </b-row>
         <!--table with IEC devices-->
         <b-row>
             <b-col md="12">
                 <b-table ref="tableValid"
                          bordered
                          striped
                          small
                          hover
                          show-empty
                          stacked="md"
                          selectable
                          select-mode="single"
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
                          :sort-direction="sortDirection"
                          class="shadow">

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

<script lang="ts">

    import Vue from 'vue';

    export default Vue.extend({
        name: 'smf-table-valid',
        props: {
            items: Array,
            nav: Object,
            selected: Array
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
                        key: 'from',
                        label: 'Start',
                        sortable: true
                    },
                    {
                        key: 'to',
                        label: 'End',
                        sortable: true
                    },
                    {
                        key: 'type',
                        label: 'Type',
                        sortable: true,
                        formatter: (value: number) => {
                            switch (value) {
                                case 1: return "missing";
                                case 2: return "implausible";
                                case 3: return "out-of-range";
                                default:
                                    break;
                            }
                            return "other";
                        }
                    },
                    {
                        key: 'quantity',
                        label: 'Quantity',
                        sortable: true
                    },
                    {
                        key: 'edited',
                        label: 'Edited',
                        class: 'text-center',
                        formatter: (value: boolean) => {
                            return value
                                ? "YES"
                                : "no";
                        }
                    }
                ],
                sortBy: 'meter',
                sortDesc: false,
                sortDirection: 'desc',
            }
        },
        methods: {
            onFiltered(filteredItems: any[]) {
                // Trigger pagination to update the number of buttons/pages due to filtering
                this.nav.visibleRows = filteredItems.length;
                this.nav.currentPage = 1
            },
            rowSelected(items: any) {
                //this.$emit('input', items);
                //this.$emit('input', selected);
                //this.selected = items;
            }
        },
        computed: {
        }
    })
</script>

<style scoped lang="css">
</style>
