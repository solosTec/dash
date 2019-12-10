import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue from "bootstrap-vue";
import smfRowCountSelector from "@/components/smf-row-count-selector";

const localVue = createLocalVue();

localVue.use(BootstrapVue);


describe('smfRowCountSelector.vue', () => {

    const wrapper = mount(smfRowCountSelector, {
        localVue,
        mocks: {
            // i18n
            $t: () => {}
        },
        propsData: {
            value: 15
        }
    });

    it('should be a vue component instance', () => {
        expect(wrapper.isVueInstance());
    });

    it('should have 7 options', async() => {
        await localVue.nextTick();
        expect(wrapper.findAll('option').length).toBe(7);
    });

    it('should display the provided number of row counts', async() => {
        expect(wrapper.find('select').element.value).toBe('15')
    });

    it('should emit the selected row count value - 5 for the first option', async () =>  {
        // simulate the selection of teh first option
        wrapper.findAll('option').at(0).element.selected = true;
        wrapper.find('select').trigger('change');
        // wait for vue to complete the change detection
        await localVue.nextTick();
        // ensure that the value of the firs element is emitted.
        expect(wrapper.emitted().input[0]).toEqual([5])
    });
});
