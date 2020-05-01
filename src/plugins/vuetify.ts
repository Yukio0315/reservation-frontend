import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/lib/util/colors";
import "@mdi/font/css/materialdesignicons.css";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true
  },
  dark: {
    primary: colors.blue.lighten3
  },
  icons: {
    iconfont: "mdi",
    values: {
      calendar: "mdi-calendar",
      person: "mdi-account-box"
    }
  }
});
