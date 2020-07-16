import { shallowMount, createLocalVue } from '@vue/test-utils'
import SmfNavigation from '@/components/smf-navigation.vue'
import BootstrapVue from "bootstrap-vue";
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import store from '@/store/index';

const localVue = createLocalVue();

localVue.use(BootstrapVue);
localVue.use(VueRouter);
localVue.use(Vuex);

const router = new VueRouter();

describe('SmfNavigation.vue', () => {

  let wrapper: any;

  beforeEach( ()=>{
    wrapper = shallowMount(SmfNavigation, {
      localVue,
      router,
      store,
      mocks: { // i18n
        $t: () => {}
      }
    });
  });

  it('should be a vue component instance', () => {
    expect(wrapper.isVueInstance())
  });

});
