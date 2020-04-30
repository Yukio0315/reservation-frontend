<template>
  <v-card class="elevation-12" raised>
    <v-toolbar color="primary elevation-24" flat>
      <v-toolbar-title>Password reset</v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <v-card-text>
      <v-form>
        <ValidationProvider
          v-slot="{ errors, valid }"
          name="Password"
          :rules="{
            required: true,
            regex: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[!-\/:-@[-`{-~])[!-~]{5,30}$/i
          }"
          vid="password"
        >
          <v-text-field
            @keyup="setIsValidPassword(valid)"
            v-model="password"
            label="Password"
            name="password"
            :error-messages="errors"
            prepend-icon="mdi-lock"
            type="password"
            :counter="30"
            required
          />
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          name="PasswordConfirm"
          rules="confirmed:password"
        >
          <v-text-field
            v-model="confirmation"
            label="Confirm
          password"
            name="password-confirm"
            :error-messages="errors"
            prepend-icon="mdi-lock"
            type="password"
            :counter="30"
            required
          />
        </ValidationProvider>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn :disabled="!showSubmitFlag" color="red" @click="reset"
        >Submit</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import { extend } from "vee-validate";
import { ValidationProvider } from "vee-validate";
import {
  required,
  // eslint-disable-next-line @typescript-eslint/camelcase
  regex,
  confirmed
} from "vee-validate/dist/rules";

extend("required", { ...required, message: "{_field_} can not be empty" });
extend("regex", {
  ...regex,
  message:
    "The {_field_} field must between 5 and 30 characters. It must contain at least one uppercase letter, one lowercase letter, one symbol and a number."
});
extend("confirmed", {
  ...confirmed,
  message: "The password field confirmation does not match"
});

@Component({ components: { ValidationProvider } })
export default class Auth extends Vue {
  password = "";
  confirmation = "";
  isValidPassword = false;
  isValidConfirmation = false;

  get showSubmitFlag(): boolean {
    if (this.isValidPassword && this.password === this.confirmation) {
      return true;
    }
    return false;
  }

  setIsValidPassword(valid: boolean) {
    this.isValidPassword = valid;
  }

  @Emit()
  reset() {
    return this.password;
  }
}
</script>
