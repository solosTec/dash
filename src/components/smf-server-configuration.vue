<template lang="html">
    <b-form @submit.prevent="">

        <b-row>
            <b-col md="10" class="shadow">

                <b-row>
                    <b-col md="6">
                        <b-form-group :label="$t('config-gateway-05')" label-for="smf-form-gw-server-x">
                            <b-form-input id="smf-form-gw-server-x"
                                          type="text"
                                          v-model="form.serverId"
                                          :state="serverIdValidation"
                                          required
                                          :placeholder="getPlaceholder($t('config-gateway-05'))"
                                          maxlength="14"/>
                            <b-form-invalid-feedback :state="serverIdValidation">
                                A server ID must be a 14 characters long hexadecimal string
                            </b-form-invalid-feedback>
                            <b-form-valid-feedback :state="serverIdValidation">
                                OK
                            </b-form-valid-feedback>
                        </b-form-group>
                    </b-col>
                    <b-col md="6">
                        <b-form-group :label="$t('config-gateway-06')" label-for="smf-form-gw-manufacturer-x">
                            <b-form-input id="smf-form-gw-manufacturer-x"
                                          type="text"
                                          v-model="form.manufacturer"
                                          required
                                          :placeholder="getPlaceholder($t('config-gateway-06'))"/>
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col md="6">
                        <b-form-group :label="$t('config-gateway-07')" label-for="smf-form-gw-server-x">
                            <b-form-input id="smf-form-gw-user-x"
                                          type="text"
                                          v-model="form.userName"
                                          required
                                          :placeholder="getPlaceholder($t('config-gateway-07'))"
                                          maxlength="14"/>
                        </b-form-group>
                    </b-col>
                    <b-col md="6">
                        <b-form-group :label="$t('config-gateway-08')" label-for="smf-form-gw-pwd-x">
                            <b-input-group>
                                <b-form-input id="smf-form-gw-pwd-x"
                                              type="text"
                                              v-model="form.userPwd"
                                              required
                                              :placeholder="getPlaceholder($t('config-gateway-08'))"/>
                                <b-input-group-append>
                                    <b-button variant="info" v-on:click.stop="generatePassword">&#x21ba;</b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </b-form-group>
                    </b-col>
                </b-row>


            </b-col>
            <b-col md="2">

                <b-row class="p-3">
                    <b-col md="12">
                        <b-button type="submit" variant="primary" v-on:click.stop="onGatewayUpdate">{{btnUpdateTitle}}
                        </b-button>&nbsp;
                    </b-col>
                </b-row>

                <b-row class="p-3">
                    <b-col md="12">
                        <b-button type="submit" variant="warning" v-on:click.stop="onGatewayReboot"
                                  v-b-popover.hover="'Connection will be lost during reboot!'" :title="btnRebootTitle">
                            {{btnRebootTitle}}
                        </b-button>
                    </b-col>
                </b-row>

                <b-row class="p-3">
                    <b-col md="12">
                        <b-button type="submit" variant="danger" v-on:click.stop="onGatewayDelete">{{btnDeleteTitle}}
                        </b-button>
                    </b-col>
                </b-row>

            </b-col>
        </b-row>

        <!-- Modal Components -->
        <b-modal ref="dlgDeleteGateway"
                 :title=btnDeleteTitle
                 @ok="handleDeleteGatewayOk"
                 header-bg-variant="danger">
            <p>Proceed?</p>
        </b-modal>

        <b-modal ref="dlgRebootGateway"
                 :title=btnRebootTitle
                 @ok="handleRebootGatewayOk"
                 header-bg-variant="warning">
            <p>Proceed?</p>
        </b-modal>
    </b-form>
</template>
<script lang="ts">
    import Vue, {VueConstructor} from 'vue';
    import {generatePassword} from '@/shared/generate-password';
    import {MESSAGE_REQUEST} from '@/constants/msgTypes';
    import {SML_CODES} from '@/constants/rootCodes';
    import {BModal} from 'bootstrap-vue';

    export default (Vue as VueConstructor<Vue & {
        $refs: {
            dlgDeleteGateway: BModal;
            dlgRebootGateway: BModal;
        };
    }>).extend({
        name: 'smfServerConfiguration',
        props: [
            'gateways',
            'wsDelegate'
        ],
        data() {
            return {
                form: {
                    pk: '',
                    serverId: '',
                    manufacturer: 'solos::Tec',
                    descr: '',
                    model: '',
                    vFirmware: '',
                    userName: '',
                    userPwd: '',
                    online: 0,
                    name: ''
                }
            }
        },
        methods: {
            getPlaceholder(str: string): string {
                return "<" + str + ">";
            },
            onGatewayUpdate(event: Event) {
                event.preventDefault();
                this.wsDelegate.ws_submit_record("modify", "config.gateway", {
                    key: [this.form.pk],
                    data: {
                        serverId: this.form.serverId,
                        manufacturer: this.form.manufacturer,
                        userName: this.form.userName,
                        userPwd: this.form.userPwd
                    }
                });
            },
            onGatewayDelete(event: Event) {
                event.preventDefault();
                this.$refs.dlgDeleteGateway.show();
            },
            handleDeleteGatewayOk(event: Event) {
                event.preventDefault();
                this.gateways.forEach((gateway: any) => {
                    this.wsDelegate.ws_submit_key("delete", "config.gateway", {tag: [gateway.pk]});
                });
                this.$nextTick(() => {
                    // Wrapped in $nextTick to ensure DOM is rendered before closing
                    this.$refs.dlgDeleteGateway.hide();
                });
            },
            onGatewayReboot(event: Event) {
                event.preventDefault();
                this.$refs.dlgRebootGateway.show();
            },
            handleRebootGatewayOk(event: Event) {
                event.preventDefault();
                this.gateways.forEach((gateway: any) => {
                    this.wsDelegate.ws_submit_request(MESSAGE_REQUEST.setProcParameter, SML_CODES.CODE_REBOOT, [gateway.pk]);
                });
                this.$nextTick(() => {
                    // Wrapped in $nextTick to ensure DOM is rendered before closing
                    this.$refs.dlgRebootGateway.hide();
                });
            },
            generatePassword(event: MouseEvent) {
                event.preventDefault();
                this.form.userPwd = generatePassword();
            }
        },
        computed: {
            serverIdValidation(): boolean {
                if (this.form.serverId == null) return false;
                const rex = /[0-9A-Fa-f]{14}/g;   //  test for hexadecimal string with 14 characters
                return rex.test(this.form.serverId);
            },
            btnUpdateTitle() {
                if (this.gateways.length > 0) {
                    return "Update " + this.gateways[0].name;
                }
                return "Update";
            },
            btnDeleteTitle() {
                if (this.gateways.length === 0) {
                    return "Delete";
                } else if (this.gateways.length === 1) {
                    return "Delete " + this.gateways[0].name;
                }
                return "Delete " + this.gateways.length + " gateway(s)";
            },
            btnRebootTitle() {
                if (this.gateways.length === 0) {
                    return "Reboot";
                } else if (this.gateways.length === 1) {
                    return "Reboot " + this.gateways[0].name;
                }
                return "Reboot " + this.gateways.length + " gateway(s)";
            },
        },
        watch: {
            gateways: {
                // run on component init and propagate the form data
                immediate: true,
                // look inside the array for changes
                deep: true,
                handler(currentGateways) {
                    if (currentGateways.length > 0) {
                        this.form = {...currentGateways[0]}
                    }
                }
            }
        }
    });
</script>
