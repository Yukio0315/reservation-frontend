<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <Auth
          @register="handleRegister"
          @sign-in="handleSignIn"
          @reset-password="handleResetPassword"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Auth from "@/components/Auth.vue";
import axios from "@/plugins/axios";

interface ServerData {
  code: string;
  expire: Date;
  token: string;
}

type NewUser = {
  email: string;
  userName: string;
  password: string;
};

type SignInUser = {
  email: string;
  password: string;
};

@Component({ components: { Auth } })
export default class Home extends Vue {
  error = null;

  async handleRegister(user: NewUser) {
    const response = await axios.post<ServerData>("/users", user);
    console.log(response);

    // return user;
  }
  async handleResetPassword(email: string) {
    console.log("reset password ", email);
  }

  async handleSignIn(signInUser: SignInUser) {
    console.log("sign in", signInUser);
  }
}
</script>
