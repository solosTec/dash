<template lang="html">
    <b-form @submit.prevent="">
        <b-card-group deck class="pt-4">
            <b-card v-for="uiBroker in uiBrokers" :key="uiBroker.hardwarePort"
                    :header="' Hardware Port ' + uiBroker.hardwarePort + '  ('+uiBroker.name+')'">

                <b-form-group label="Transparent mode" label-cols-sm="4"
                              label-cols-lg="3">
                    <b-input-group-prepend is-text>
                        <b-form-checkbox v-model="uiBroker.transparent" class="mr-n2" switch>
                            <span class="sr-only">Switch for following text input</span>
                        </b-form-checkbox>
                    </b-input-group-prepend>
                </b-form-group>

                <b-form-group label="TCP/IP Addresses"
                              description="Dotted decimal notation or hostname"
                              label-cols-sm="4"
                              label-cols-lg="3">

                    <b-table striped hover :items="uiBroker.addresses" :fields="fields" foot-clone>
                        <template v-slot:cell(host)="row">
                            <b-form-input v-model="row.item.host"/>
                        </template>
                        <template v-slot:cell(service)="row">
                            <b-form-input v-model="row.item.service"/>
                        </template>
                        <template v-slot:cell(action)="row">
                            <b-button size="sm"
                                      variant="danger"
                                      @click="removeAddress(row.item, uiBroker)">Delete</b-button>
                        </template>
                        <template v-slot:foot()="row">
                            <div class="text-right">
                                <b-button v-if="row.column === 'action'"
                                          size="sm"
                                          variant="success"
                                          @click="addAddress(uiBroker)">Add</b-button>
                            </div>
                            <!-- do not clone the header -->
                            <span v-if="row.column !== 'action'"></span>
                        </template>
                    </b-table>

                </b-form-group>
                <b-form-group label-cols-sm="4"
                              label-cols-lg="3"
                              class="update-button-group">
                    <b-button
                        type="submit"
                        variant="primary"
                        :disabled="uiBrokerHasNotChanged(uiBroker)"
                        @click.stop.prevent="onBrokerUpdate(uiBroker)">{{ btnUpdateTitle(uiBroker) }}
                    </b-button>
                </b-form-group>

            </b-card>
        </b-card-group>
    </b-form>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {Gateway} from '@/api/gateway';
import {mapState} from 'vuex';
import {AppState} from '@/store';
import {BBroker, BBrokerAddress} from '@/api/broker';

interface UIBroker {
    hardwarePort: string;
    name: string;
    transparent: boolean;
    addresses: BBrokerAddress[];
}

export default Vue.extend({
    name: 'smfBrokerConfiguration',
    components: {},
    props: {
        gateway: {
            type: Object as PropType<Gateway>,
            required: true
        },
        brokers: {
            type: Array as PropType<BBroker[]>,
            required: true
        },

    },
    data() {
        return {
            fields: [
                {key: 'host', label: 'Hostname or IP-Address'},
                {key: 'service', label: 'Port'},
                {key: 'action', label: ''}
            ],
            uiBrokers: [] as UIBroker[],
            originalUiBrokers: [] as UIBroker[],
        }
    },
    computed: {
        ...mapState({
            hardwareBrokers: state => {
                return (state as AppState).hardware.brokers;
            }
        })
    },
    methods: {
        btnUpdateTitle(uiBroker: UIBroker): string {
            return "Update " + uiBroker.hardwarePort + '  on ' + this.gateway.serverId;
        },
        uiBrokerHasNotChanged(uiBroker: UIBroker): boolean {
            const originalBroker = this.originalUiBrokers.find(ob => ob.hardwarePort === uiBroker.hardwarePort)
            return JSON.stringify(originalBroker) === JSON.stringify(uiBroker);
        },
        addAddress(uiBroker: UIBroker): void {
            uiBroker.addresses.push({host: '', service: undefined});
        },
        removeAddress(address: BBrokerAddress, uiBroker: UIBroker): void {
            uiBroker.addresses = uiBroker.addresses.filter(a => a !== address);
        },
        onBrokerUpdate(uiBroker: UIBroker) {
            const bBroker: BBroker = {
                hardwarePort: uiBroker.hardwarePort,
                transparent: uiBroker.transparent,
                addresses: uiBroker.addresses
            }
            this.$emit('brokerUpdate', {bBroker});
        }
    },
    watch: {
        brokers: {
            immediate: true,
            handler(brokers: BBroker[]) {
                this.uiBrokers = this.hardwareBrokers.map(hardwareBroker => {
                    // find the corresponding broker or create an empty one
                    const bBroker = brokers.find(b => b.hardwarePort === hardwareBroker.port)
                    if (bBroker) {
                        return {
                            hardwarePort: hardwareBroker.port,
                            name: hardwareBroker.name,
                            transparent: bBroker.transparent,
                            addresses: bBroker.addresses
                        } as UIBroker;
                    }
                    return {
                        hardwarePort: hardwareBroker.port,
                        name: hardwareBroker.name,
                        transparent: false,
                        addresses: [],
                    } as UIBroker
                });
                this.originalUiBrokers = JSON.parse(JSON.stringify(this.uiBrokers));
            }
        }
    }
});
</script>
<style scoped>
.card-deck .card {
    min-width: calc(50% - 30px);
    max-width: calc(50% - 30px);
    margin-bottom: 30px;
}

.update-button-group {
    text-align: right;
}
</style>
