import { shallowMount, createLocalVue } from '@vue/test-utils'
import SmfNoAccess from '@/views/smf-no-access.vue'
import BootstrapVue from "bootstrap-vue";

const localVue = createLocalVue();

localVue.use(BootstrapVue);


describe('SmfNoAccess.vue', () => {

    let wrapper;

    beforeEach( ()=>{
        wrapper = shallowMount(SmfNoAccess, {
            localVue
        });
    });

    it('should be a vue component instance', () => {
        expect(wrapper.isVueInstance())
    });

});
