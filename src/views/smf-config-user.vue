<template lang="html">

    <section class="smf-config-system">

        <template>
            <div>
                <vue-headful
                        title="smf :: config user"
                        description="SMF dashboard"
                        keywords="SMF, solosTec"
                />
            </div>
        </template>

        <b-jumbotron fluid :header="$t('header-user')" :lead="$t('lead-user', {count: this.users.length})"/>

        <b-container fluid>
            <b-row>
                <b-col md="9">
                    <smf-data-table
                         :busyLevel="busyLevel"
                         tableName="users"
                         :items="users"
                         :fields="fields"
                         @itemSelected="usersSelected">

                        <template v-slot:cell(lastAccess)="data">
                            <span>{{ data.item.lastAccess }} xxx</span>
                        </template>

                    </smf-data-table>
                </b-col>
                <b-col md="3">
                    <b-form v-on:submit.prevent class="p-3 shadow">
                    </b-form>
                </b-col>
            </b-row>
        </b-container>
    </section>
</template>

<script lang="ts">

    import {webSocket} from '@/mixins/web-socket';
    import mixins from 'vue-typed-mixins';
    import {hasPrivilegesWaitForUser} from "@/mixins/privileges";
    import store from "../store";
    import {MODULES, NO_ACCESS_ROUTE, PRIVILEGES} from "@/store/modules/user";
    import Vue from 'vue';
    import smfDataTable from '@/components/smf-data-table.vue';
    import {User} from '@/backend-api/user';

    const fields = [
        {
            key: 'username',
            label: 'Username',
            sortable: true
        },
        {
            key: 'lastAccess',
            label: 'LastAccess',
            sortable: true
        }
    ];

    export default mixins(webSocket, Vue).extend({
        name: 'smfConfigUser',
        mixins: [webSocket],
        components: {
            smfDataTable
        },
        mounted() {
            this.ws_open("/smf/api/user/v0.8");
            // mock code
            setTimeout(()=>{
                this.busyLevel = 100;
                this.users = [
                    {username: 'y', lastAccess: '2020-02-12T12:09:01'} as User
                ]
            }, 100)
        },
        beforeDestroy() {
            this.ws_close();
        },
        data() {
            return {
                users: [] as User[],
                busyLevel: 0,
                fields
            }
        },
        methods: {
            ws_on_open() {

            },
            usersSelected(users: any[]){
                console.log('users selected', users)
            }
        },

        async beforeRouteEnter(to: any, from: any, next: any) {
            const result = hasPrivilegesWaitForUser(store, MODULES.CONFIG_USER, PRIVILEGES.VIEW);
            next(result ? true : NO_ACCESS_ROUTE);
        }
    })

</script>
