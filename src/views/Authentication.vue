<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <Auth
          @register="handleRegister"
          @sign-in="handleSignIn"
          @reset-password="handleResetPassword"
          :error="error"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Auth from "@/components/Auth.vue";
import { NewUser, SignInUser } from "@/types/user";
import { authModule } from "@/store/modules/auth.module";

@Component({ components: { Auth } })
export default class Home extends Vue {
  error = "";

  mounted() {
    if (localStorage.getItem("user")) {
      this.$router.push(`/users/${authModule.signedInUser.id}`);
    }
  }

  async handleRegister(user: NewUser) {
    await authModule.register(user);

    if (localStorage.getItem("user")) {
      this.$router.push(`/users/${authModule.signedInUser.id}`);
    }
    this.error = "Invalid email or password.";
  }
  async handleResetPassword(email: string) {
    console.log("reset password ", email);
  }

  async handleSignIn(user: SignInUser) {
    await authModule.signIn(user);
    if (localStorage.getItem("user")) {
      this.$router.push(`/users/${authModule.signedInUser.id}`);
    }
    this.error = "Invalid username, email or password";
  }
}
</script>
