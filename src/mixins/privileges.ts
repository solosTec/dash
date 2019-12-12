import {MutationPayload, Store} from 'vuex';
import Vue from 'vue';
import {AppState} from '@/store';

export async function hasPrivilegesWaitForUser(store: Store<AppState>, module: string, privilege: string) {
    return new Promise<boolean>((resolve) => {
        // if there are no privileges right now, we need to wait for the
        // user to be loaded. After that we can check the privileges
        if (Object.keys(store.state.user.privileges).length === 0) {
            store.subscribe((mutation: MutationPayload) => {
                if (mutation.type === 'user/loaded') {
                    resolve(hasPrivileges(store, module, privilege));
                }
            });
        } else {
            resolve(hasPrivileges(store, module, privilege));
        }
    });
}

export function hasPrivileges(store: Store<any>, module: string, privilege: string) {

    console.log('hasPrivileges', module, privilege);

    const privs = store.state.user.privileges;
    if (!privs[module]){
        return false;
    }
    return privs[module].includes(privilege);
}

export const privileges = Vue.extend( {
    methods: {
        hasPrivs(module: string, privilege: string ): boolean{
            return hasPrivileges(this.$store, module, privilege)
        }
    }
});
