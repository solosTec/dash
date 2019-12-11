<template lang="html">

    <section class="smf-task-plausibility">

        <template>
            <div>
                <vue-headful
                    title="smf :: task plausibility"
                    description="SMF dashboard"
                    keywords="SMF, solosTec"
                />
            </div>
        </template>

        <!-- <b-jumbotron fluid header="Test plausibility" lead="ToDo" /> -->
        <b-jumbotron fluid :header="$t('header-task-plausibility')"/>
    </section>

</template>

<script lang="js">
  import {hasPrivilegesWaitForUser} from "../mixins/privileges";
  import store from "../store";
  import {MODULES, NO_ACCESS_ROUTE, PRIVILEGES} from "../store/modules/user";

  export default  {
    name: 'smfTaskPlausibility',
    props: [],
    mounted() {

    },
    data() {
      return {

      }
    },
    methods: {

    },
    computed: {

    },
      beforeRouteEnter(to, from, next) {
          hasPrivilegesWaitForUser(store, MODULES.TASK_PLAUSIBILITY, PRIVILEGES.VIEW).then((result) => {
              next( result ? true: NO_ACCESS_ROUTE);
          });
      }
}
</script>

<style scoped lang="css">
</style>
