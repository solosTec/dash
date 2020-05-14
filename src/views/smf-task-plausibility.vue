<template lang="html">

    <section class="smf-task-plausibility">

        <template>
            <div>
                <vue-headful title="smf :: task plausibility"
                             description="SMF dashboard"
                             keywords="SMF, solosTec" />
            </div>
        </template>

        <b-jumbotron fluid :header="$t('header-task-plausibility')" />

        <tblValid ref="tblValid"
             :items="items"
             :nav="nav"
             :selected="selected"
             class="p-3 shadow" />
    </section>

</template>

<script lang="js">
    import { hasPrivilegesWaitForUser } from "../mixins/privileges";
    import store from "../store";
    import { MODULES, NO_ACCESS_ROUTE, PRIVILEGES } from "../store/modules/user";
    import tblValid from '@/components/smf-table-valid.vue'

    export default {
        name: 'smfTaskPlausibility',
        props: [],
        components: {
            tblValid
        },
        mounted() {

        },
        data() {
            return {
                items: [{ pk: 'ecfeab82-7742-4cb1-b600-902de1cb25ac', meter: '01-e61e-57140621-36-03', from: '17 Apr 2020 16:40', to: '17 Apr 2020 19:00', type: 2, quantity: 12, edited: false }],
                selected: [],
                nav: {
                    currentPage: 1,
                    visibleRows: 0,
                    perPage: 5,
                    isBusy: false,
                    busyLevel: 0,
                    filter: null,
                }
            }
        },
        methods: {

        },
        computed: {

        },
        beforeRouteEnter(to, from, next) {
            hasPrivilegesWaitForUser(store, MODULES.TASK_PLAUSIBILITY, PRIVILEGES.VIEW).then((result) => {
                next(result ? true : NO_ACCESS_ROUTE);
            });
        }
    }
</script>

<style scoped lang="css">
</style>
