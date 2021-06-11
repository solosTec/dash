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

    <b-jumbotron
      fluid
      :header="$t('header-user')"
      :lead="$t('lead-user', { count: this.users.length })"
    />

    <b-container fluid>
      <b-row>
        <b-col md="9">
          <smf-data-table
            :busyLevel="busyLevel"
            tableName="users"
            :items="users"
            :fields="fields"
            @itemSelected="usersSelected"
          >
          </smf-data-table>
        </b-col>
        <b-col md="3">
          <smf-crud-form
            identityPropertyName="username"
            :formBackedValue="form"
            :items="selectedUsers"
            @updateItem="updateItem"
            @deleteItem="deleteItem"
            @insertItem="insertItem"
          >
            <b-form-group label="Username" label-for="smf-form-username">
              <b-form-input
                id="smf-form-username"
                type="text"
                v-model="form.username"
                required
                placeholder="Username"
              />
            </b-form-group>

            <b-form-group label="Role" label-for="smf-form-role">
              <b-form-select
                id="smf-form-role"
                v-model="form.role"
                :options="roleOptions"
                required
              ></b-form-select>
            </b-form-group>
          </smf-crud-form>
        </b-col>
      </b-row>
    </b-container>

    <b-modal
      ref="dlgDeleteUser"
      title="Delete User"
      @ok="deleteConfirmed"
      header-bg-variant="danger"
      centered
    >
      <p>{{ deleteMessage }}</p>
    </b-modal>
  </section>
</template>

<script lang="ts">
import { webSocket } from "@/mixins/web-socket";
import mixins from "vue-typed-mixins";
import { hasPrivilegesWaitForUser } from "@/mixins/privileges";
import store from "../store";
import { MODULES, NO_ACCESS_ROUTE, PRIVILEGES } from "@/store/modules/user";
import Vue from "vue";
import smfDataTable from "@/components/smf-data-table.vue";
import smfCrudForm from "@/components/smf-crud-form.vue";
import { ROLES, User, UserRole } from "@/api/user";
import { BModal } from "bootstrap-vue";

const MOCK_USERS: User[] = [
  {
    username: "Hugo",
    role: UserRole.SystemAdmin,
    lastAccess: "2019-12-11 08:57:14.00000000",
    passwort: ""
  },
  {
    username: "Alvin",
    role: UserRole.DeviceManager,
    lastAccess: "2019-12-11 08:57:14.00000000",
    passwort: ""
  }
];

const fields = [
  {
    key: "username",
    label: "Username",
    sortable: true
  },
  {
    key: "role",
    label: "Role",
    sortable: true
  },
  {
    key: "lastAccess",
    label: "LastAccess",
    sortable: true
  }
];

const FormInit = {
  username: "",
  role: "",
  passwort: ""
};

export default mixins(webSocket, Vue).extend({
  name: "smfConfigUser",
  mixins: [webSocket],
  components: {
    smfDataTable,
    smfCrudForm
  },
  mounted() {
    // init the form with default props and values
    this.form = Object.assign({}, FormInit) as User;
    this.ws_open("/smf/api/user/v0.9");
    // mock code
    setTimeout(() => {
      this.busyLevel = 100;
      this.users = MOCK_USERS;
    }, 100);
  },
  beforeDestroy() {
    this.ws_close();
  },
  data() {
    return {
      users: [] as User[],
      busyLevel: 0,
      fields,
      selectedUsers: [] as User[],
      form: {} as User,
      roleOptions: ROLES.map(r => ({ value: r, text: r }))
    };
  },
  methods: {
    ws_on_open() {},
    usersSelected(users: User[]): void {
      this.selectedUsers = users || [];
      if (this.selectedUsers.length === 1) {
        this.form = Object.assign({}, this.selectedUsers[0]);
      } else {
        this.form = Object.assign({}, FormInit) as User;
      }
    },
    updateItem() {
      console.log(
        "update",
        JSON.stringify(this.form),
        JSON.stringify(this.selectedUsers)
      );
    },
    deleteItem() {
      console.log("delete", this.form);
      (this.$refs.dlgDeleteUser as BModal).show();
    },
    insertItem() {
      console.log("insert", this.form);
    },
    deleteConfirmed() {
      console.log("delete confirmed", this.form);
    }
  },

  computed: {
    deleteMessage(): string {
      if (this.selectedUsers.length > 1) {
        return `Do you really want to delete the ${this.selectedUsers.length} selected users?`;
      } else if (this.selectedUsers.length === 1) {
        return `Do you really want to delete user ${this.selectedUsers[0].username}?`;
      }
      return "";
    }
  },

  async beforeRouteEnter(to: any, from: any, next: any) {
    const result = hasPrivilegesWaitForUser(
      store,
      MODULES.CONFIG_USER,
      PRIVILEGES.VIEW
    );
    next(result ? true : NO_ACCESS_ROUTE);
  }
});
</script>
