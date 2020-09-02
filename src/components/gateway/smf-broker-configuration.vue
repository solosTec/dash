<template lang="html">
    <b-form @submit.prevent="">
        <b-card-group deck class="pt-4">

            <b-card v-for="uiBroker in $v.uiBrokers.$each.$iter" :key="uiBroker.hardwarePort.$model"
                    class="broker-card"
                    :header="' Hardware Port ' + uiBroker.hardwarePort.$model + '  ('+uiBroker.name.$model+')'">

                <b-form-group label="Send Login" label-cols-sm="4" label-cols-lg="3">
                    <b-input-group-prepend is-text>
                        <b-form-checkbox v-model="uiBroker.login.$model" class="mr-n2" switch>
                            <span class="sr-only">Send login data</span>
                        </b-form-checkbox>
                    </b-input-group-prepend>
                </b-form-group>

                <b-form-group description="Dotted decimal notation for IP-address or hostname">

                    <b-table-simple hover small caption-top>
                        <b-tbody>
                            <b-tr v-for="(address, idx) in uiBroker.addresses.$each.$iter" :key="idx">
                                <b-td>
                                    <b-form-group>
                                        <b-input-group prepend="Host" class="mt-2">
                                            <b-form-input
                                                type="text"
                                                v-model.trim="address.host.$model"
                                                v-b-popover.hover="'Specify a known hostname or an IPv4/IPv6 address'"
                                                :placeholder="'Hostname or IP-address' | fmtPlaceholder"
                                                :state="address.host.$invalid ? false: null">
                                            </b-form-input>
                                            <b-form-invalid-feedback v-if="!address.host.required">
                                                Host is required.
                                            </b-form-invalid-feedback>
                                            <b-form-invalid-feedback v-if="!address.host.hostValidator">
                                                Invalid input.
                                            </b-form-invalid-feedback>
                                        </b-input-group>
                                    </b-form-group>
                                </b-td>
                                <b-td>
                                    <b-form-group>
                                        <b-input-group prepend="Service" class="mt-2">
                                            <b-form-input
                                                type="number"
                                                v-model.trim="address.service.$model"
                                                :placeholder="'Service' | fmtPlaceholder"
                                                :state="address.service.$invalid ? false : null">
                                            </b-form-input>
                                            <b-form-invalid-feedback v-if="!address.service.required">
                                                Service is required.
                                            </b-form-invalid-feedback>
                                            <b-form-invalid-feedback v-if="!address.service.integer">
                                                Input is not a number.
                                            </b-form-invalid-feedback>
                                        </b-input-group>
                                    </b-form-group>
                                </b-td>
                                <b-td class="text-right">
                                    <b-input-group class="mt-2">
                                    <b-button size="sm" variant="danger" class="button-delete"
                                              @click="removeAddress(address.$model, uiBroker.$model)">
                                        Delete
                                    </b-button>
                                    </b-input-group>
                                </b-td>
                            </b-tr>
                        </b-tbody>
                        <b-tfoot>
                            <b-td colspan="3" class="text-right">
                                <b-button size="sm" variant="success" @click="addAddress(uiBroker.$model)">
                                    Add
                                </b-button>
                            </b-td>
                        </b-tfoot>
                    </b-table-simple>

                </b-form-group>
                <b-form-group label-cols-sm="4"
                              label-cols-lg="3"
                              class="text-right">
                    <b-button type="submit" variant="primary"
                              :disabled="!uiBrokerHasChanged(uiBroker.$model) || uiBroker.addresses.$invalid"
                              @click.stop.prevent="onBrokerUpdate(uiBroker.$model)">{{
                            btnUpdateTitle(uiBroker.$model)
                        }}
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
import {required, integer, ipAddress, or, helpers} from 'vuelidate/lib/validators'

const hostName = helpers.regex(
    'alpha',
    /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/);

interface UIBroker {
    hardwarePort: string;
    name: string;
    login: boolean;
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
    validations: {
        uiBrokers: {
            $each: {
                hardwarePort: {},
                name: {},
                login: {},
                addresses: {
                    required,
                    $each: {
                        host: {
                            required,
                            hostValidator: or(hostName, ipAddress)
                        },
                        service: {
                            required,
                            integer
                        }
                    }
                }
            }
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
        uiBrokerHasChanged(uiBroker: UIBroker): boolean {
            const originalBroker = this.originalUiBrokers.find(ob => ob.hardwarePort === uiBroker.hardwarePort)
            return JSON.stringify(originalBroker) !== JSON.stringify(uiBroker);
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
                login: uiBroker.login,
                addresses: uiBroker.addresses
            }
            this.$emit('brokerUpdate', bBroker);
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
                            login: bBroker.login,
                            addresses: bBroker.addresses
                        } as UIBroker;
                    }
                    return {
                        hardwarePort: hardwareBroker.port,
                        name: hardwareBroker.name,
                        login: false,
                        addresses: [],
                    } as UIBroker
                });
                this.originalUiBrokers = JSON.parse(JSON.stringify(this.uiBrokers));
                // reset the form - resets the dirty state to false and removes all validation infos
                this.$v.uiBrokers.$reset();
            }
        }
    }
});
</script>
<style scoped>
.broker-card {
    min-width: calc(50% - 30px);
    max-width: calc(50% - 30px);
    margin-bottom: 30px;
}
.button-delete {
    margin-top: 0.25rem;
    margin-right: -0.25rem;
}
</style>
