import AuthService from "@/services/auth.service";
import { AccessToken, SignInUser, NewUser } from "@/types/user";
import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";
import store from "@/store/index";

export interface AuthState {
  signedInUser: AccessToken | {};
}

@Module({ dynamic: true, name: "auth", store, namespaced: true })
class Auth extends VuexModule implements AuthState {
  public signedInUser = JSON.parse(localStorage.getItem("user") || "{}");

  @Mutation
  private logout() {
    this.signedInUser = {};
  }
  @Action({ commit: "logout" })
  public signOut() {
    AuthService.signOut();
    return;
  }

  @Mutation
  private login(user: AccessToken) {
    this.signedInUser = user;
  }
  @Action({ commit: "login", rawError: true })
  public async signIn(user: SignInUser) {
    return await AuthService.signIn(user);
  }
  @Action({ commit: "login", rawError: true })
  public async register(user: NewUser) {
    const response = await AuthService.register(user);
    if (response.status == 201) {
      const signInUser = await AuthService.signIn({
        email: user.email,
        password: user.password
      });
      return signInUser
    }
    return {};
  }
}

export const authModule = getModule(Auth);
