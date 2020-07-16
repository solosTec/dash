import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue from "bootstrap-vue";
import smfRowCountSelector from "@/components/smf-row-count-selector.vue";

import '../localStorageMock';

const localVue = createLocalVue();

localVue.use(BootstrapVue);

describe('smfRowCountSelector.vue', () => {

    let wrapper: any;

    function deferWrapperCreation() {
        return mount(smfRowCountSelector, {
            localVue,
            mocks: {
                // i18n
                $t: () => {}
            },
            propsData: {
                value: 15,
                storeKey: 'anyKey'
            }
        });
    }

    describe('no stored value', ()=> {

        beforeEach(()=> {
            wrapper = deferWrapperCreation();
            localStorage.clear();
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
            // ensure that the value of the firs element is emitted as last value.
            expect(wrapper.emitted().input.pop()).toEqual([5]);
            // the value must be stored in the store
            const storedValue = localStorage.getItem('smf-anyKey-rowCount');
            expect(storedValue).toEqual('5');
        });
    });

    describe('with stored value', () => {

        beforeEach(()=> {
            localStorage.setItem('smf-anyKey-rowCount', '25');
            wrapper = deferWrapperCreation();
        });

        it('should initialize the value with a stored value', async () => {
            expect(wrapper.find('select').element.value).toBe('25')
        });
    });

});
