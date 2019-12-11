import userModule from '@/store/modules/user';

const { loaded } = userModule.mutations;

describe('websocket store', () => {

    let state;

    beforeEach(() => {
        state = {
            username: null,
            roles: []
        };
    });

    it('should set the loaded user', () => {
        expect(state.username).toBeNull();
        loaded(state, {username: 'testname'});
        expect(state.username).toEqual('testname');
    });



 });
