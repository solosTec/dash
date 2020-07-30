<template lang="html">
    <b-form @submit.prevent="">

        <b-card-group deck class="pt-4">
            <b-card header="wireless LMN" title="Transparent mode ttyAPP0"
                    sub-title="Reconfiguration requires a restart">

                <b-form-group label="TCP/IP Address"
                              label-for="smf-broker.ttyAPP0.host"
                              description="Dotted decimal notation or hostname"
                              label-cols-sm="4"
                              label-cols-lg="3">
                    <b-input-group name="smf-broker.ttyAPP0.host" class="mt-2">
                        <b-input-group-prepend is-text>
                            <b-form-checkbox v-model="broker.ttyAPP0.transparent" class="mr-n2" switch>
                                <span class="sr-only">Switch for following text input</span>
                            </b-form-checkbox>
                        </b-input-group-prepend>
                        <b-form-input id="smf-broker.ttyAPP0.host"
                                      type="text"
                                      :disabled="!broker.ttyAPP0.transparent"
                                      v-model="broker.ttyAPP0.host"
                                      placeholder="Hostname"/>

                        <b-form-input id="smf-broker.ttyAPP0.host"
                                      type="number"
                                      :disabled="!broker.ttyAPP0.transparent"
                                      v-model="broker.ttyAPP0.service"
                                      placeholder="IP port"/>
                    </b-input-group>
                </b-form-group>
                <b-form-group label-cols-sm="4"
                              label-cols-lg="3">
                    <b-button
                            type="submit"
                            variant="primary"
                            @click.stop.prevent="onBrokerUpdate('ttyAPP0')">{{btnUpdateTitle}}
                    </b-button>
                </b-form-group>

            </b-card>

            <b-card header="wired LMN" title="Transparent mode ttyAPP1" sub-title="Reconfiguration requires a restart">

                <b-form-group label="TCP/IP Address"
                              label-for="smf-broker.ttyAPP1.host"
                              description="Dotted decimal notation or hostname"
                              label-cols-sm="4"
                              label-cols-lg="3">
                    <b-input-group name="smf-broker.ttyAPP1.host" class="mt-2">
                        <b-input-group-prepend is-text>
                            <b-form-checkbox v-model="broker.ttyAPP1.transparent" class="mr-n2" switch>
                                <span class="sr-only">Switch for following text input</span>
                            </b-form-checkbox>
                        </b-input-group-prepend>

                        <b-form-input id="smf-broker.ttyAPP1.host"
                                      type="text"
                                      :disabled="!broker.ttyAPP1.transparent"
                                      v-model="broker.ttyAPP1.host"
                                      placeholder="Hostname"/>
                        <b-form-input id="smf-broker.ttyAPP1.host"
                                      type="number"
                                      :disabled="!broker.ttyAPP1.transparent"
                                      v-model="broker.ttyAPP1.service"
                                      placeholder="IP port"/>
                    </b-input-group>
                </b-form-group>
                <b-form-group label-cols-sm="4"
                              label-cols-lg="3">
                    <b-button
                            type="submit"
                            variant="primary"
                            @click.stop.prevent="onBrokerUpdate('ttyAPP1')">{{btnUpdateTitle}}
                    </b-button>
                </b-form-group>
            </b-card>
        </b-card-group>
    </b-form>
</template>

<script lang="ts">
    import Vue, {PropType} from 'vue';
    import {Gateway} from '@/backend-api/gateway';

    export default Vue.extend({
        name: 'smfBrokerConfiguration',
        components: {},
        props: {
            gateway: {
                type: Object as PropType<Gateway>,
                required: true
            },
            broker: {
                type: Object,
                required: true
            },

        },
        data() {
            return {}
        },
        computed: {
            btnUpdateTitle(): string {
                return "Update " + this.gateway.serverId;
            },
        },
        methods: {
            onBrokerUpdate(port: string) {
                this.$emit('brokerUpdate', {port, broker: this.broker});
            },
        },
        watch: {}
    });
</script>
