<template>
  <v-container>
    <v-row>
      <v-col>
        <router-view
          name="header"
          :isCalendar="isCalendar"
          @toggleCalendar="toggleCalendar"
        ></router-view>
        <Calendar v-if="isCalendar" :events="events" />
        <Profile v-if="!isCalendar" :profile="profile" />
        <router-view name="footer"></router-view>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Calendar from "@/components/Calendar.vue";
import Profile from "@/components/Profile.vue";
import UserService from "@/services/user.service";
import EventService from "@/services/event.service";
import { Event, Duration } from "@/types/event";
import { UserProfile } from "@/types/user";
import moment from "moment";

@Component({ components: { Calendar, Profile } })
export default class User extends Vue {
  isCalendar = true;
  events: Array<Event> = [];
  profile: UserProfile = {
    createdAt: "",
    userName: "",
    email: "",
    permission: "",
    reservations: []
  };

  toggleCalendar() {
    this.isCalendar = !this.isCalendar;
  }

  async beforeCreate() {
    const eventResponse = await EventService.getEvent(
      Number(this.$route.params.id)
    );
    const events: Array<Duration> = eventResponse.data;
    this.events = events.map(event => {
      console.log(moment(event.start).format("YYYY-MM-DD HH:mm"));

      const start = moment(event.start).format("YYYY-MM-DD HH:mm");
      const end = moment(event.end).format("YYYY-MM-DD HH:mm");
      return { start, end, name: "Reservable", color: "indigo" };
    });

    const profileResponse = await UserService.getUserProfile(
      Number(this.$route.params.id)
    );
    this.profile = profileResponse.data;
    if (this.profile.reservations) {
      const reservations = this.profile.reservations.map(reservation => {
        const start = moment(reservation.start).format("YYYY-MM-DD HH:mm");
        const end = moment(reservation.end).format("YYYY-MM-DD HH:mm");
        return { start, end, name: "Reserved", color: "red" };
      });
      this.events.concat(reservations);
    }
    console.log(this.events);
  }
}
</script>
