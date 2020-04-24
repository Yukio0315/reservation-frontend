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
            v-model="signIn"
            @change="toggleAuth"
            :label="switchMessage"
            color="orange"
            flat
            light
          />
        </template>
        <span v-if="signIn">Please register before sign in.</span>
        <span v-else>Please sign in if you have already registered.</span>
      </v-tooltip>
    </v-toolbar>
    <v-card-text>
      <v-form>
        <ValidationProvider
          v-slot="{ errors }"
          name="Name"
          rules="required|between:2,10|alpha_spaces"
        >
          <v-text-field
            v-if="!signIn"
            v-model="name"
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
          v-slot="{ errors }"
          name="Email"
          rules="required|email"
        >
          <v-text-field
            v-model="email"
            label="Email"
            name="Email"
            required
            :error-messages="errors"
            prepend-icon="mdi-email"
            type="text"
          />
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          name="Password"
          :rules="{
            regex: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[!-\/:-@[-`{-~])[!-~]+$/i
          }"
          v-if="!forgotPassword"
        >
          <v-text-field
            id="password"
            v-model="password"
            label="Password"
            name="password"
            :error-messages="errors"
            prepend-icon="mdi-lock"
            type="password"
            required
            :counter="30"
          />
        </ValidationProvider>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn v-if="signIn && !forgotPassword" @click="toggleForgotPassword"
        >forgot password?</v-btn
      >
      <v-btn v-if="forgotPassword" @click="toggleForgotPassword"
        >Back to Login</v-btn
      >
      <v-spacer />
      <v-btn color="red" v-if="forgotPassword">Submit</v-btn>
      <v-btn color="primary" v-else>{{ content }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { extend } from "vee-validate";
import { ValidationProvider } from "vee-validate";
import {
  required,
  email,
  between,
  // eslint-disable-next-line @typescript-eslint/camelcase
  alpha_spaces,
  regex
} from "vee-validate/dist/rules";

extend("email", { ...email, message: "Email must be valid" });
extend("required", { ...required, message: "{_field_} can not be empty" });
extend("between", {
  ...between,
  message: "The {_field_} field must be between {min} and {max} characters"
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
    "Password must contain at least one uppercase letter, one lowercase letter, a number and a symbol."
});

@Component({ components: { ValidationProvider } })
export default class Auth extends Vue {
  signIn = true;
  forgotPassword = false;
  content = "Sign in";
  switchMessage = "Register";
  name = "";
  email = "";
  password = "";

  toggleAuth() {
    const tmp = this.content;
    this.content = this.switchMessage;
    this.switchMessage = tmp;
  }

  toggleForgotPassword() {
    this.forgotPassword = !this.forgotPassword;
  }
}
</script>
