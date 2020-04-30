<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-skeleton-loader v-if="loading" type="article"></v-skeleton-loader>
        <Password @reset="handleReset" v-else-if="!loading && !success" />
        <router-link v-else to="/"
          ><v-btn>Success! Back to login page</v-btn></router-link
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import AuthService from "@/services/auth.service";
import Password from "@/components/Password.vue";
import PasswordResetSuccess from "@/components/PasswordResetSuccess.vue";
import authService from "@/services/auth.service";

@Component({ components: { Password, PasswordResetSuccess } })
export default class ResetPassword extends Vue {
  loading = false;
  success = false;
  async beforeCreate() {
    await AuthService.checkValidURL(this.$route.params.uuid).catch(e => {
      this.$router.push(`/error/${e}`);
    });
  }

  async handleReset(password: string) {
    try {
      this.loading = true;
      await authService.resetPassword(this.$route.params.uuid, password);
    } catch (e) {
      this.$router.push(`/error/${e}`);
    }
    this.success = true;
    this.loading = false;
  }
}
</script>
