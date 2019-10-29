import { shallowMount, createLocalVue } from '@vue/test-utils'
import SmfNavigation from '@/components/smf-navigation.vue'
import BootstrapVue from "bootstrap-vue";
import VueRouter from 'vue-router';

const localVue = createLocalVue();

localVue.use(BootstrapVue);
localVue.use(VueRouter);

const router = new VueRouter();

describe('SmfNavigation.vue', () => {
  it('should be a vue component instance', () => {
    const wrapper = shallowMount(SmfNavigation, {
      localVue,
      router,
      mocks: { // i18n
        $t: () => {}
      }
    });
    expect(wrapper.isVueInstance())
  })
});
