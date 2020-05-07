<template>
  <v-sheet>
    <v-card-text>
      <v-alert border="right" colored-border type="error" elevation="2"
        >Once deleted, it will be gone forever. Please be certain</v-alert
      >
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
          outlined
        />
      </ValidationProvider>
    </v-card-text>
    <v-card-actions
      ><v-spacer /><v-btn
        color="error"
        :disabled="!(isValidEmail && isSameEmail)"
        outlined
        @click="deleteAccount"
        >Delete this account</v-btn
      ><v-spacer
    /></v-card-actions>
  </v-sheet>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { ValidationProvider } from "vee-validate";

@Component({ components: { ValidationProvider } })
export default class DeleteAccount extends Vue {
  email = "";
  isValidEmail = false;
  @Prop(String) validEmail!: string;

  setIsValidEmail(valid: boolean) {
    this.isValidEmail = valid;
  }

  get isSameEmail() {
    return this.email === this.validEmail;
  }

  deleteAccount() {
    this.$emit("deleteAccount", this.email);
  }
}
</script>
