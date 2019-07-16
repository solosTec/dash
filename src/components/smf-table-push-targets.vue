<template lang="html">

    <section class="smf-table-push-targets">
        <b-table ref="tablePushTargets"
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


            <template slot="details" slot-scope="row">
                <b-button size="sm" @click="row.toggleDetails">
                    {{ row.detailsShowing ? 'Hide' : 'Show' }} Register
                </b-button>
            </template>

            <template slot="row-details" slot-scope="row">
                <b-card>
                    <ul>
                        <li v-for="(register, key) in row.item.registers" :key="key">{{ getRegisterName(register) }}</li>
                    </ul>
                </b-card>
            </template>

        </b-table>
    </section>

</template>

<script lang="js">


    export default {
        name: 'smf-table-push-targets',
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
                        key: 'interval',
                        label: 'Interval',
                        sortable: true,
                        formatter: (value, key, item) => {
                            if (value > 60*60) return (value / (60*60)) + " h";
                            if (value > 60) return (value / 60) + " min";
                            return value + " sec";
                        },
                        class: 'text-right'
                    },
                    {
                        key: 'delay',
                        label: 'Delay',
                        sortable: true,
                        formatter: (value, key, item) => {
                            if (value > 60*60) return (value / (60*60)) + " h";
                            if (value > 60) return (value / 60) + " min";
                            if (value === 0) return "-";
                            return value + " sec";
                        },
                        class: 'text-right'
                    },
                    {
                        key: 'name',
                        label: 'Push Target',
                        sortable: true
                    },
                    {
                        key: 'OBIS',
                        label: 'Profile',
                        sortable: true,
                        class: 'text-right',
                        formatter: (value, key, item) => {
                            if (value === '8181c78610ff') return '1 minute values';
                            else if (value === '8181c78611ff') return '15 minute values';
                            else if (value === '8181c78612ff') return 'hourly values';
                            else if (value === '8181c78613ff') return 'daily values';
                            else if (value === '8181c78614ff') return 'last 2 hour values';
                            else if (value === '8181c78615ff') return 'last week values';
                            else if (value === '8181c78616ff') return 'monthly values';
                            else if (value === '8181c78617ff') return 'annual values';
                            else if (value === '8181c78618ff') return 'initial values';
                            return value.toUpperCase();
                        }
                    },
                    //service: "8181c78a21ff"??
                    //source: "8181c78a42ff"??
                    {
                        key: 'details',
                        label: 'Show Details',
                        class: 'text-center'
                    }
                ],
                //items: [{nr:1, active: true, entries: 101, OBIS:'77', name:'name'}],
                sortBy: 'nr',
                sortDesc: false,
                sortDirection: 'desc',
            }
        },
        methods: {
            getRegisterName(reg) {
                var name = reg.toUpperCase();
                if (name === '8181C78203FF') return name + " - Hersteller-Identifikation";  //  Manufacturer
                else if (name === '8181C78205FF') return name + " - öffentlicher Schlüssel";
                else if (name === '810000090B00') return name + " - Sekundenindex"; //  second index from meter
                else if (name === '0100000009FF') return name + " - Geräteeinzelidentifikation";
                else if (name === '0100000000FF') return name + " - Identifikationsnummer 1.0 ServerId -> Seriennummer";
                else if (name === '0000600100FF') return name + " - Identifikationsnummer 2.1 Seriennummer";
                else if (name === '0000601000FF') return name + " - Geraetename";
                else if (name === '0000616100FF') return name + " - Fehlerregister";
                else if (name === '0100010800FF') return name + " - Zaehlerstand Totalregister";
                else if (name === '0100010801FF') return name + " - Zaehlerstand Tarif 1";
                else if (name === '0100010802FF') return name + " - Zaehlerstand Tarif 2";
                else if (name === '0100100700FF') return name + " - aktuelle Wirkleistung";
                else if (name === '0100011100FF') return name + " - letzter signierter Total-Zaehlerstand";
                else if (name === '0100240700FF') return name + " - Wirkleistung L1";
                else if (name === '0100380700FF') return name + " - Wirkleistung L2";
                else if (name === '01004C0700FF') return name + " - Wirkleistung L3";
                else if (name === '010060320002') return name + " - Aktuelle Chiptemperatur";
                else if (name === '010060320003') return name + " - Minimale Chiptemperatur";
                else if (name === '010060320004') return name + " - Maximale Chiptemperatur";
                else if (name === '010060320005') return name + " - Gemittelte Chiptemperatur";
                else if (name === '010060320303') return name + " - Spannungsminimum";
                else if (name === '010060320304') return name + " - Spannungsmaximum";
                else if (name === '01001F0700FF') return name + " - Strom L1";
                else if (name === '0100200700FF') return name + " - Spannung L1";
                else if (name === '0100330700FF') return name + " - Strom L2";
                else if (name === '0100340700FF') return name + " - Spannung L2";
                else if (name === '0100470700FF') return name + " - Strom L3";
                else if (name === '0100480700FF') return name + " - Spannung L3";
                else if (name === '010000090B00') return name + " - Zeitstempel (UTC)";
                else if (name === '0700030000FF') return name + " - Verbrauch in m³ (nicht korrigiert)";

                return reg.toUpperCase();
            }
        },
        computed: {
        }
    }
</script>

<style scoped lang="css">
</style>
