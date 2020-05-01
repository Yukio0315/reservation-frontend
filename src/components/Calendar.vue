<template>
  <v-sheet>
    <v-calendar :events="events"></v-calendar>
  </v-sheet>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Event } from "@/types/event";

@Component
export default class Calendar extends Vue {
  @Prop(Array) readonly events?: Array<Event>;
}
</script>
