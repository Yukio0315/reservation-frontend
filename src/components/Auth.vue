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
        <v-text-field
          v-if="!signIn"
          label="Name"
          name="Name"
          prepend-icon="mdi-account"
          type="text"
        />
        <v-text-field
          label="Email"
          name="Email"
          prepend-icon="mdi-email"
          type="text"
        />
        <v-text-field
          id="password"
          label="Password"
          name="password"
          prepend-icon="mdi-lock"
          type="password"
        />
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

@Component
export default class Auth extends Vue {
  signIn = true;
  content = "Sign in";
  switchMessage = "Register";

  toggleAuth() {
    const tmp = this.content;
    this.content = this.switchMessage;
    this.switchMessage = tmp;
  }
}
</script>
