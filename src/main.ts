import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store/index";
import vuetify from "./plugins/vuetify";
import { extend } from "vee-validate";
import {
  customEmail,
  customRequired,
  customMin,
  customMax,
  customAlphaSpaces,
  customRegex
} from "./utils/validation";

extend("email", customEmail);
extend("required", customRequired);
extend("min", customMin);
extend("max", customMax);
extend("alpha_spaces", customAlphaSpaces);
extend("regex", customRegex);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
