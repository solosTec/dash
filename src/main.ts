import "@babel/polyfill";
import "mutationobserver-shim";
import Vue from "vue";
import "./plugins/bootstrap-vue";
import App from "./App.vue";
import router from "./router";
import vueHeadful from "vue-headful";
import Toasted from "vue-toasted";
import VueResource from "vue-resource";
import { i18n } from "@/plugins/i18n";
import store from "./store";
import smfRowCountSelector from "@/components/smf-row-count-selector.vue";
import "./shared/formatter/registerNames";
import Vuelidate from "vuelidate";
import { fmtPlaceholder } from "@/filter/fmtPlaceholder";
import VueMask from "v-mask";
import "@/assets/global.scss";

Vue.config.productionTip = false;
Vue.component("vue-headful", vueHeadful);
Vue.component("smf-row-count-selector", smfRowCountSelector);
Vue.use(Toasted);
Vue.use(VueResource);
Vue.use(Vuelidate);
Vue.use(VueMask);

Vue.filter("fmtPlaceholder", fmtPlaceholder);

// Let's Register a Global Error Notification Toast.
Vue.toasted.register("sml_attention_error", msg => msg, {
  type: "error",
  duration: 4000, //  milliseconds
  action: {
    text: "Cancel",
    onClick: (e, toastObject) => {
      toastObject.goAway(0);
    }
  },
  theme: "bubble",
  closeOnSwipe: true,
  position: "bottom-center"
});
Vue.toasted.register("sml_attention_ok", msg => msg, {
  type: "success",
  duration: 4000, //  milliseconds
  action: {
    text: "OK",
    onClick: (e, toastObject) => {
      toastObject.goAway(0);
    }
  },
  theme: "bubble",
  closeOnSwipe: true,
  position: "bottom-center"
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
