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
  public errorMessage = "";

  @Mutation
  error(message: string) {
    [(this.errorMessage = message)];
  }

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
    this.error("");
    return await AuthService.signIn(user).catch(() => {
      this.error("Sign in failed. Invalid email or password");
    });
  }
  @Action({ commit: "login", rawError: true })
  public async register(user: NewUser) {
    await AuthService.register(user).catch(() => {
      this.error("This email has already registered. Please signin.");
    });

    const signInUser = await AuthService.signIn({
      email: user.email,
      password: user.password
    }).catch(() => {
      this.error("This email address has already registered. Please signin.");
    });
    this.error("");
    return signInUser;
  }
}

export const authModule = getModule(Auth);
