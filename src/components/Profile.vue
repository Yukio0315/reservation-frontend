<template>
  <v-card class="mx-auto">
    <v-card-title>User Profile</v-card-title>
    <v-card-text>
      <v-form>
        <ValidationProvider
          v-slot="{ errors, valid }"
          name="Name"
          rules="required|alpha_spaces|min:2|max:20"
        >
          <v-text-field
            v-model="name"
            @keyup="setIsValidName(valid)"
            label="Name"
            name="Name"
            :counter="10"
            :error-messages="errors"
            prepend-icon="mdi-account"
            :append-icon="editUserName ? 'mdi-check-circle' : 'mdi-brush'"
            @click:append="editOrSaveUserName"
            :readonly="!editUserName"
            type="text"
            required
            outlined
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
            :append-icon="editEmail ? 'mdi-check-circle' : 'mdi-brush'"
            @click:append="editOrSaveEmail"
            :readonly="!editEmail"
            type="text"
            required
            outlined
          />
        </ValidationProvider>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { UserProfile } from "@/types/user";
import { ValidationProvider } from "vee-validate";

@Component({ components: { ValidationProvider } })
export default class Profile extends Vue {
  @Prop(Object) readonly profile!: UserProfile;
  editUserName = false;
  editEmail = false;
  isValidName = true;
  isValidEmail = true;
  name = this.profile.userName;
  email = this.profile.email;

  setIsValidName(valid: boolean) {
    this.isValidName = valid;
  }

  setIsValidEmail(valid: boolean) {
    this.isValidEmail = valid;
  }

  editOrSaveUserName() {
    if (this.isValidName) {
      this.editUserName = !this.editUserName;
      if (this.name != this.profile.userName && !this.editUserName) {
        console.log(this.name);

        this.$emit("change-user-name", this.name);
      }
    }
  }
  editOrSaveEmail() {
    if (this.isValidEmail) {
      this.editEmail = !this.editEmail;
      if (this.email != this.profile.email && !this.editEmail) {
        console.log(this.email);

        this.$emit("change-email", this.email);
      }
    }
  }
}
</script>
