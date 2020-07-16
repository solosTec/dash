import user from '@/store/modules/user'

const { loaded } = user.mutations;

describe('websocket store', () => {

    let state: any;

    beforeEach(() => {
        state = {
            username: null,
            privileges: {}
        };
    });

    it('should set the loaded user', () => {
        expect(state.username).toBeNull();
        loaded(state, {
            lastAccess: "2019-12-11 08:57:14.00000000",
            name: "Alfred",
            privs: {devices: ["view","edit"], meters:[]}});
        expect(state.username).toEqual('Alfred');
        expect(state.privileges.configDevice.includes('view')).toBeTruthy();
        expect(state.privileges.configMeter.length).toBe(1);
    });

});
