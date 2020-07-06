﻿
<template lang="html">
    <div>
        <b-row>
            <b-col md="3">
                <b-form-group :label="'User'">
                    <b-form-select :value="currentUser" :options="users" @change="onUserSelectionChanged"/>
                </b-form-group>
            </b-col>
            <b-col md="3">
                <b-form-group :label="'Role'">
                    <b-form-select :value="currentRole" :options="roles" @change="onRoleSelectionChanged"/>
                </b-form-group>
            </b-col>
            <b-col md="3">
                <b-form-group :label="'Meter'">
                    <b-form-select :value="currentMeter" :options="meters" @change="onMeterSelectionChanged"/>
                </b-form-group>
            </b-col>
        </b-row>

        <div>Server: {{serverName}}</div>
        <div>Users: {{users}}</div>
        <div>Roles: {{roles}}</div>
        <div>Meters: {{meters}}</div>
        <div>Raw-Data:</div>
        <div>{{rootAccessRights}}</div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {RootAccessRights, RootAccessRightsRole, RootAccessRightsUser} from '@/backend-api/root-access-rights';

    interface Meter {
        value: string;
        text: string;
    }

    const roleNames = (accessRights: RootAccessRights): string[] => {
        return Object.keys(accessRights.values).filter(role => accessRights.values[role])
    }

    function userNames(accessRights: RootAccessRights) {
        return (roleName: string) => {
            const users = accessRights.values[roleName];
            return Object.keys(users)
        };
    }

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
                currentUser: null as string | null,
                currentRole: null as string | null,
                currentMeter: null as string | null,
            }
        },
        computed: {
            serverName(): string {
                const accessRights = (this.rootAccessRights as RootAccessRights);
                return accessRights.srv;
            },
            users(): string[] {
                const accessRights = (this.rootAccessRights as RootAccessRights);
                return roleNames(accessRights).map(userNames(accessRights)).flat();
            },
            roles(): string[] {
                const accessRights = (this.rootAccessRights as RootAccessRights);
                return roleNames(accessRights);
            },
            meters(): Meter[] {
                const accessRights = (this.rootAccessRights as RootAccessRights);
                return roleNames(accessRights).map(roleName => {
                    const role: RootAccessRightsRole = accessRights.values[roleName];

                    return Object.entries(role).map(userEntry => {
                        const user: RootAccessRightsUser = userEntry[1]
                        const propertyEntries = Object.entries(user);
                        return propertyEntries
                            .map(propertyEntry => ({value: propertyEntry[0], text: propertyEntry[1]}))
                            // remove properties that ends with 'FFFF' - these are not meters
                            .filter(property => !property.value.endsWith('FFFF'))
                    })
                }).flat(2) // flaten the meters per user per role:
            }
        },
        methods: {
            onUserSelectionChanged(user: string) {
                this.currentUser = user;
                this.queryMeter();
            },
            onRoleSelectionChanged(role: string) {
                this.currentRole = role;
                this.queryMeter();
            },
            onMeterSelectionChanged(meter: string) {
                this.currentMeter =  meter;
                this.queryMeter();
            },
            queryMeter() {
                if (this.currentMeter && this.currentUser && this.currentRole) {
                    this.$emit('queryMeter', {
                        meterNrHex: this.currentMeter,
                        userHex: this.currentUser,
                        roleHex: this.currentRole
                    });
                }
            }
        }
    });
</script>
