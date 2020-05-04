<template>
  <v-toolbar color="indigo">
    <v-toolbar-title>Share office</v-toolbar-title>
    <v-spacer />
    <v-btn icon :disabled="isCalendar" @click="toggleCalendar"
      ><v-icon>$calendar</v-icon></v-btn
    >
    <v-btn icon :disabled="!isCalendar" @click="toggleCalendar"
      ><v-icon>$person</v-icon></v-btn
    >
    <v-btn icon @click="signOut"><v-icon>$signOut</v-icon></v-btn>
  </v-toolbar>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { authModule } from "@/store/modules/auth.module";

@Component
export default class Header extends Vue {
  @Prop(Boolean) readonly isCalendar?: boolean;

  @Emit("toggleCalendar")
  toggleCalendar() {
    return;
  }

  signOut() {
    authModule.signOut();
    this.$router.push("/auth");
  }
}
</script>
