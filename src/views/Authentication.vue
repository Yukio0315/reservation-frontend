<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-skeleton-loader v-if="loading" type="article"></v-skeleton-loader>
        <Auth
          v-if="!loading"
          @register="handleRegister"
          @sign-in="handleSignIn"
          @reset-password="handleResetPassword"
          :resetMessage="message"
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
import authService from "../services/auth.service";

@Component({ components: { Auth } })
export default class Authentication extends Vue {
  loading = false;
  message = "";

  beforeCreate() {
    this.loading = true;
  }
  created() {
    if (localStorage.getItem("user")) {
      this.$router.push(`/users/${authModule.signedInUser.id}`);
    }
  }
  mounted() {
    this.loading = false;
  }

  async handleRegister(user: NewUser) {
    this.loading = true;
    await authModule.register(user);
    this.loading = false;
    if (localStorage.getItem("user")) {
      this.$router.push(`/users/${authModule.signedInUser.id}`);
    }
  }

  async handleResetPassword(email: string) {
    try {
      await authService.reservePassword(email);
    } catch (e) {
      authModule.setError("An error occured. Please retry the request.");
    }
    this.message = "We sent a email. Please check and reset password.";
  }

  async handleSignIn(user: SignInUser) {
    this.loading = true;
    await authModule.signIn(user);
    this.loading = false;
    if (localStorage.getItem("user")) {
      this.$router.push(`/users/${authModule.signedInUser.id}`);
    }
  }
}
</script>
