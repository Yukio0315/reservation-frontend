<template>
  <v-sheet>
    <v-card-text>
      <ValidationProvider
        v-slot="{ errors, valid }"
        name="old password"
        :rules="{
          required: true,
          regex: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[!-\/:-@[-`{-~])[!-~]{5,30}$/i
        }"
      >
        <v-text-field
          id="oldPassword"
          :append-icon="showOld ? 'mdi-eye' : 'mdi-eye-off'"
          @keyup="setIsValidOldPassword(valid)"
          v-model="oldPassword"
          label="Old password"
          name="old password"
          :error-messages="errors"
          prepend-icon="mdi-lock"
          :type="showOld ? 'text' : 'password'"
          :counter="30"
          required
          outlined
          @click:append="showOld = !showOld"
        />
      </ValidationProvider>
      <ValidationProvider
        v-slot="{ errors, valid }"
        name="NewPassword"
        :rules="{
          required: true,
          regex: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[!-\/:-@[-`{-~])[!-~]{5,30}$/i
        }"
      >
        <v-text-field
          id="newPassword"
          :append-icon="showNew ? 'mdi-eye' : 'mdi-eye-off'"
          @keyup="setIsValidNewPassword(valid)"
          v-model="newPassword"
          label="New password"
          name="newPassword"
          :error-messages="errors"
          prepend-icon="mdi-lock"
          :type="showNew ? 'text' : 'password'"
          :counter="30"
          required
          outlined
          @click:append="showNew = !showNew"
        />
      </ValidationProvider>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="error" :disabled="disableConfirm" @click="changePassword"
        >Confirm</v-btn
      >
      <v-spacer />
    </v-card-actions>
  </v-sheet>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { ValidationProvider } from "vee-validate";

@Component({ components: { ValidationProvider } })
export default class ChangePassword extends Vue {
  oldPassword = "";
  newPassword = "";
  showOld = false;
  showNew = false;
  isValidOldPassword = false;
  isValidNewPassword = false;

  setIsValidOldPassword(valid: boolean) {
    this.isValidOldPassword = valid;
  }
  setIsValidNewPassword(valid: boolean) {
    this.isValidNewPassword = valid;
  }

  get disableConfirm(): boolean {
    return (
      !this.isValidOldPassword ||
      !this.isValidNewPassword ||
      this.oldPassword === this.newPassword
    );
  }

  changePassword() {
    this.$emit("changePassword", {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    });
  }
}
</script>
