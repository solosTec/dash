
export async function hasPrivilegesWaitForUser(store, module, privilege) {
    return new Promise((resolve) => {
        // if there are no privileges right now, we need to wait for the
        // user to be loaded. After that we can check the privileges
        if (Object.keys(store.state.user.privileges).length === 0) {
            store.subscribe((mutation) => {
                if (mutation.type === 'user/loaded') {
                    resolve(hasPrivileges(store, module, privilege));
                }
            });
        } else {
            resolve(hasPrivileges(store, module, privilege));
        }
    });
}

export function hasPrivileges(store, module, privilege) {

    console.log('hasPrivileges', module, privilege);

    const privs = store.state.user.privileges;
    if (!privs[module]){
        return false;
    }
    return privs[module].includes(privilege);
}

export const privileges = {
    methods: {
        hasPrivs(module, privilege ){
            return hasPrivileges(this.$store, module, privilege)
        }
    }
};
