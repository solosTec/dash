import { shallowMount, createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import store from "@/store/index";
import App from "../../src/App.vue";

const localVue = createLocalVue();

localVue.use(BootstrapVue);
localVue.use(VueRouter);
localVue.use(Vuex);

const router = new VueRouter();

describe("App.vue", () => {
  it("should be a vue component instance", () => {
    const wrapper = shallowMount(App, {
      localVue,
      router,
      store,
      mocks: {
        // i18n
        $t: () => {}
      }
    });

    expect(wrapper.isVueInstance());
  });
});
