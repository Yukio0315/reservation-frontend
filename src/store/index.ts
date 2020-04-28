import Vue from "vue";
import Vuex from "vuex";
import { AuthState } from "./modules/auth.module";

Vue.use(Vuex);

export interface State {
  counter: AuthState;
}

export default new Vuex.Store<State>({});
