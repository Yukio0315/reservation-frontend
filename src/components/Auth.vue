<template>
  <v-card class="elevation-12" raised>
    <v-toolbar color="primary elevation-24" flat>
      <v-toolbar-title>{{ content }}</v-toolbar-title>
      <v-spacer />
      <v-tooltip top>
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
          rules="required|max:10"
        >
          <v-text-field
            v-if="!signIn"
            v-model="name"
            label="Name"
            name="Name"
            :error-messages="errors"
            prepend-icon="mdi-account"
            type="text"
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
            :error-messages="errors"
            prepend-icon="mdi-email"
            type="text"
          />
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          name="Password"
          rules="required|min:5|max:30"
        >
          <v-text-field
            id="password"
            v-model="password"
            label="Password"
            name="password"
            :error-messages="errors"
            prepend-icon="mdi-lock"
            type="password"
          />
        </ValidationProvider>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary">{{ content }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { extend } from "vee-validate";
import { ValidationProvider } from "vee-validate";
import { required, email, max, min } from "vee-validate/dist/rules";

extend("email", email);
extend("required", required);
extend("max", max);
extend("min", min);

@Component({ components: { ValidationProvider } })
export default class Auth extends Vue {
  signIn = true;
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
}
</script>
