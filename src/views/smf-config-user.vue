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

        <b-jumbotron fluid :header="$t('header-user')" :lead="$t('lead-user', {count: this.count})"/>

        <b-container fluid>
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

    export default mixins(webSocket, Vue).extend({
        name: 'smfConfigUser',
        props: [],
        mixins: [webSocket],

        mounted() {
            this.ws_open("/smf/api/user/v0.8");
        },

        beforeDestroy() {
            this.ws_close();
        },

        data() {
            return {
                count: 0
            }
        },

        methods: {
            ws_on_open() {

            }
        },

        async beforeRouteEnter(to: any, from: any, next: any) {
            const result = hasPrivilegesWaitForUser(store, MODULES.CONFIG_USER, PRIVILEGES.VIEW)
            next(result ? true : NO_ACCESS_ROUTE);
        }
    })

</script>
