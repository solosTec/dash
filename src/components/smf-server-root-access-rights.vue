﻿
<template lang="html">
    <div>
        <b-row>
            <b-col md="4">
                <b-form-group label-cols-lg="3" :label="'User'">
                    <b-form-select :value="currentUser" :options="userOptions" @change="onUserSelectionChanged"/>
                </b-form-group>
            </b-col>
            <b-col md="4">
                <b-form-group label-cols-lg="3" :label="'Role'">
                    <b-form-select :value="currentRole" :options="roleOptions" @change="onRoleSelectionChanged"/>
                </b-form-group>
            </b-col>
            <b-col md="4">
                <b-form-group label-cols-lg="3" :label="'Meter'">
                    <b-form-select :value="currentMeter" :options="meterOptions" @change="onMeterSelectionChanged"/>
                </b-form-group>
            </b-col>
        </b-row>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {
        RootAccessRights,
        UIRootAccessMeter,
        UIRootAccessRights,
        UIRootAccessRightsRole,
        UIRootAccessUser
    } from '@/backend-api/root-access-rights';

    const roleNames = (accessRights: RootAccessRights): string[] => Object.keys(accessRights.values);

    export default Vue.extend({
        name: 'smfServerRootAccessRights',
        props: {
            rootAccessRights: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                uiRootAccessRights: {}  as UIRootAccessRights,
                currentUser: null as UIRootAccessUser | null,
                currentRole: null as UIRootAccessRightsRole | null,
                currentMeter: null as UIRootAccessMeter | null,
            }
        },
        computed: {
            userOptions(): any[] {
                return this.uiRootAccessRights.users.map(user => ({text: user.userName, value: user}));
            },
            roleOptions(): any[] {
                return this.uiRootAccessRights.roles.map(role => ({text: role.roleName, value: role}));
            },
            meterOptions(): any[] {
                return this.uiRootAccessRights.meters.map(meter => ({text: meter.id, value: meter}))
            }
        },
        methods: {
            onUserSelectionChanged(user: UIRootAccessUser) {
                this.currentUser = user;
                this.queryMeter();
            },
            onRoleSelectionChanged(role: UIRootAccessRightsRole) {
                this.currentRole = role;
                this.queryMeter();
            },
            onMeterSelectionChanged(meter: UIRootAccessMeter) {
                this.currentMeter = meter;
                this.queryMeter();
            },
            queryMeter() {
                if (this.currentMeter && this.currentUser && this.currentRole) {
                    this.$emit('queryMeter', {
                        meter: this.currentMeter,
                        user: this.currentUser,
                        role: this.currentRole
                    });
                }
            }
        },
        watch: {
            rootAccessRights: {
                immediate: true,
                handler (accessRights: RootAccessRights) {

                    const roles = roleNames(accessRights).map(roleName => ({
                            roleName,
                            ...accessRights.values[roleName]
                        })
                    );

                    const users: UIRootAccessUser[] = roles.filter(role => role.user).map(role => ({
                            userName: role.ACCESS_USER_NAME,
                            userId: role.user
                        })
                    );

                    const meters: UIRootAccessMeter[] = [];
                    roles.filter(role => role.devices && role.devices.length > 0).forEach(role => {
                        role.devices
                            .filter(device => device.type !== 11 && device.type !== 4)
                            .forEach(device => meters.push(device));
                    });

                    this.uiRootAccessRights = {
                        server: accessRights.srv,
                        roles,
                        users,
                        meters
                    };

                    this.currentRole = roles.find(role => role.devices && role.devices.length > 0) ||  null
                    this.currentUser = users.length > 0 ? users[0] : null;
                    this.currentMeter = meters.length > 0 ? meters[0]: null;
                    this.queryMeter();
                }
            }
        }
    });
</script>
