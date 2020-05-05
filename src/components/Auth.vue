<template>
  <v-card class="elevation-12" raised>
    <v-toolbar color="primary elevation-24" flat>
      <v-toolbar-title v-if="forgotPassword">Reissue Password</v-toolbar-title>
      <v-toolbar-title v-else>{{ content }}</v-toolbar-title>
      <v-spacer />
      <v-tooltip top v-if="!forgotPassword">
        <template v-slot:activator="{ on }">
          <v-switch
            v-on="on"
            v-model="signInFlag"
            @change="toggleAuth"
            :label="switchMessage"
            color="orange"
            flat
            light
          />
        </template>
        <span v-if="signInFlag">Please register before sign in.</span>
        <span v-else>Please sign in if you have already registered.</span>
      </v-tooltip>
    </v-toolbar>
    <v-alert type="error" :dismissible="true" v-if="errorMessage">{{
      errorMessage
    }}</v-alert>
    <v-alert type="success" :dismissible="true" v-if="resetMessage">{{
      resetMessage
    }}</v-alert>
    <v-card-text>
      <v-form>
        <ValidationProvider
          v-slot="{ errors, valid }"
          name="Name"
          rules="required|alpha_spaces|min:2|max:20"
        >
          <v-text-field
            v-if="!signInFlag"
            v-model="name"
            @keyup="setIsValidName(valid)"
            label="Name"
            name="Name"
            :counter="10"
            :error-messages="errors"
            prepend-icon="mdi-account"
            type="text"
            required
          />
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors, valid }"
          name="Email"
          rules="required|email"
        >
          <v-text-field
            v-model="email"
            @keyup="setIsValidEmail(valid)"
            label="Email"
            name="Email"
            :error-messages="errors"
            prepend-icon="mdi-email"
            type="text"
            required
          />
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors, valid }"
          name="Password"
          :rules="{
            required: true,
            regex: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[!-\/:-@[-`{-~])[!-~]{5,30}$/i
          }"
          v-if="!forgotPassword"
        >
          <v-text-field
            id="password"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            @keyup="setIsValidPassword(valid)"
            v-model="password"
            label="Password"
            name="password"
            :error-messages="errors"
            prepend-icon="mdi-lock"
            :type="show ? 'text' : 'password'"
            :counter="30"
            required
            @click:append="show = !show"
          />
        </ValidationProvider>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn v-if="signInFlag && !forgotPassword" @click="toggleForgotPassword"
        >forgot password?</v-btn
      >
      <v-btn v-if="forgotPassword" @click="toggleForgotPassword"
        >Back to Login</v-btn
      >
      <v-spacer />
      <v-btn
        v-if="forgotPassword"
        :disabled="!showSubmitFlag"
        color="red"
        @click="submit"
        >Submit</v-btn
      >
      <v-btn
        v-else
        :disabled="!showContentFlag"
        color="primary"
        @click="submit"
        >{{ content }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Emit, Prop } from "vue-property-decorator";
import { authModule } from "@/store/modules/auth.module";
import { extend } from "vee-validate";
import { ValidationProvider } from "vee-validate";
import {
  required,
  email,
  min,
  max,
  // eslint-disable-next-line @typescript-eslint/camelcase
  alpha_spaces,
  regex
} from "vee-validate/dist/rules";

extend("email", { ...email, message: "Email must be valid" });
extend("required", { ...required, message: "{_field_} can not be empty" });
extend("min", {
  ...min,
  message: "The {_field_} field must be at least {length} characters"
});
extend("max", {
  ...max,
  message: "The {_field_} field may not be greater than {length} characters"
});
extend("alpha_spaces", {
  // eslint-disable-next-line @typescript-eslint/camelcase
  ...alpha_spaces,
  message:
    "{_field_} field may only contain alphabetic characters as well as spaces"
});
extend("regex", {
  ...regex,
  message:
    "The {_field_} field must between 5 and 30 characters. It must contain at least one uppercase letter, one lowercase letter, one symbol and a number."
});

@Component({ components: { ValidationProvider } })
export default class Auth extends Vue {
  signInFlag = true;
  forgotPassword = false;
  content = "Sign in";
  switchMessage = "Register";
  name = "";
  email = "";
  password = "";
  show = false;
  isValidEmail = false;
  isValidPassword = false;
  isValidName = false;
  @Prop(String) readonly resetMessage!: string;

  get showContentFlag(): boolean {
    if (
      this.signInFlag &&
      !this.forgotPassword &&
      this.isValidEmail &&
      this.isValidPassword
    ) {
      return true;
    }
    if (
      !this.signInFlag &&
      !this.forgotPassword &&
      this.isValidName &&
      this.isValidEmail &&
      this.isValidPassword
    ) {
      return true;
    }
    return false;
  }

  get showSubmitFlag(): boolean {
    if (this.signInFlag && this.forgotPassword && this.isValidEmail) {
      return true;
    }
    return false;
  }

  get errorMessage(): string {
    return authModule.errorMessage;
  }

  toggleAuth() {
    const tmp = this.content;
    this.content = this.switchMessage;
    this.switchMessage = tmp;
  }

  toggleForgotPassword() {
    this.forgotPassword = !this.forgotPassword;
  }

  setIsValidName(valid: boolean) {
    this.isValidName = valid;
  }
  setIsValidEmail(valid: boolean) {
    this.isValidEmail = valid;
  }
  setIsValidPassword(valid: boolean) {
    this.isValidPassword = valid;
  }

  submit() {
    if (this.signInFlag && !this.forgotPassword) this.signIn();
    if (!this.signInFlag && !this.forgotPassword) this.register();
    if (this.forgotPassword) return this.resetPassword();
  }

  @Emit()
  signIn() {
    return { email: this.email, password: this.password };
  }

  @Emit()
  register() {
    return { userName: this.name, email: this.email, password: this.password };
  }

  @Emit()
  resetPassword() {
    this.forgotPassword = false;
    return this.email;
  }
}
</script>
