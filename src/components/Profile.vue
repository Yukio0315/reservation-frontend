<template>
  <v-layout align-center justify-center>
    <v-flex text-xs-center>Profile Page</v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { UserProfile } from "@/types/user";

@Component
export default class Profile extends Vue {
  @Prop(Object) readonly profile!: UserProfile;
}
</script>
