<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <Auth />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Auth from "@/components/Auth.vue";

export default {
  components: {
    Auth
  }
};
</script>
