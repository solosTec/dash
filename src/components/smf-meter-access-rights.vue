﻿
<template lang="html">
    <div>
        <smf-data-table
                :busyLevel="100"
                tableName="Meter Rights"
                :items="uiMeterAccessRights"
                :fields="fields"
        >
        </smf-data-table>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {MeterAccessRights, nonRightsCodes} from '../backend-api/meter-access-rights';
    import smfDataTable from '@/components/smf-data-table.vue';

    const OBIS_CODE_MAP: { [code: string]: string } = {
        '810060050000': 'Gateway Status Word',
        '81490D0600FF': 'IP-T Status',
        '81490D0700FF': 'IP-T Parameter',
        '8181C78201FF': 'Device Identification (Firmware Version)',
        '0080800010FF': 'Memory Usage',
        '81060F0700FF': 'wireless M-Bus Parameters',
        '81060F0600FF': 'wireless M-Bus Status',
        '8181C79300FF': 'IEC Configuration',
        '81818160FFFF': 'Access Rights',
        '818127320701': 'Logbook',
        '8104000600FF': 'WAN Interface Attributes',
        '8104000700FF': 'WAN Interface Parameters',
        '8104020700FF': 'GSM Parameters',
        '81040D0600FF': 'GSM Provider',
        '81040D0700FF': 'Provider Parameters',
        '8148170700FF': 'LAN/DSL Parameters',
        '81480D0600FF': 'LAN/DSL dynamic Parameters',
        '8104180700FF': 'PLC Parameters',
        '81040E0600FF': 'dynamic PLC Parameters',
        '8181C78A01FF': 'Push Process Attributes',
        '81811006FFFF': 'Visible Sensors',
        '81811106FFFF': 'Active Sensors',
        '8181C78810FF': 'Time/Date Parameters',
        '8181C78801FF': 'NTP Parameters',
        '8181C78600FF': 'Data Mirror Attributes',
        '8181C78620FF': 'Data Collector Attributes',
    }

    interface UIMeterAccessRights {
        code: string;
        name?: string;
        value: number;
        r: boolean;
        w: boolean;
        x: boolean;
    }

    const fields = [
        {
            key: 'code',
            label: 'Code'
        },
        {
            key: 'name',
            label: 'Name'
        },
        {
            key: 'r',
            label: 'Read'
        },
        {
            key: 'w',
            label: 'Write'
        },
        {
            key: 'x',
            label: 'Execute'
        }
    ];

    export default Vue.extend({
        name: 'smfMeterAccessRights',
        components: {
            smfDataTable
        },
        props: {
            meterAccessRights: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                uiMeterAccessRights: [] as UIMeterAccessRights[],
                fields,
            }
        },
        computed: {},
        methods: {},
        watch: {
            meterAccessRights: {
                immediate: true,
                handler(accessRights: MeterAccessRights) {
                    if (!accessRights){
                        this.uiMeterAccessRights =[];
                        return;
                    }
                    const accessRightKeys = Object.keys(accessRights.values).filter(key => !nonRightsCodes.includes(key));
                    this.uiMeterAccessRights = accessRightKeys.map(key => {
                        const value = Number(accessRights.values[key]);
                        const name = OBIS_CODE_MAP[key];
                        return ({
                            code: key,
                            name,
                            value,
                            x: (value & 0b100) === 0b100, // 2^2
                            w: (value & 0b010) === 0b010, // 2^1
                            r: (value & 0b001) === 0b001 // 2^0
                        })
                    })
                }
            }
        }
    });
</script>
