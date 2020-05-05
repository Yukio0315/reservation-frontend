<template>
  <v-card-text> </v-card-text>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class ChangePassword extends Vue {
  oldPassword = "";
  newPassword = "";
}
</script>
