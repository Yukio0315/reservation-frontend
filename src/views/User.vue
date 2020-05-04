<template>
  <v-container>
    <v-row>
      <v-skeleton-loader v-if="loading" type="card"></v-skeleton-loader>
      <v-col v-else>
        <router-view
          name="header"
          :isCalendar="isCalendar"
          @toggleCalendar="toggleCalendar"
        ></router-view>
        <Calendar
          v-if="isCalendar"
          :events="events"
          @add-reservation="handleAddReservation"
        />
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
import ReservationService from "@/services/reservation.service";
import { EventContent, Duration } from "@/types/event";
import { UserProfile } from "@/types/user";
import { timeout } from "@/utils/util";
import moment from "moment";

@Component({ components: { Calendar, Profile } })
export default class User extends Vue {
  loading = false;
  isCalendar = true;
  errorMessage = "";
  events: Array<EventContent> = [];
  profile: UserProfile = {
    createdAt: "",
    userName: "",
    email: "",
    permission: "",
    reservations: []
  };

  async beforeCreate() {
    this.loading = true;
    try {
      const eventResponse = await EventService.getAllEvents(
        Number(this.$route.params.id)
      );
      const events: Array<Duration> = eventResponse.data;
      this.events = events.map(event => {
        const start = moment(event.start).format("YYYY-MM-DD HH:mm");
        const end = moment(event.end).format("YYYY-MM-DD HH:mm");
        return { start, end, name: "Available", color: "primary" };
      });
    } catch (e) {
      this.$router.push(`/errors/${e}`);
    }

    try {
      const profileResponse = await UserService.getUserProfile(
        Number(this.$route.params.id)
      );
      this.profile = profileResponse.data;

      if (this.profile.reservations.length) {
        const reservations = this.profile.reservations.map(reservation => {
          const start = moment(reservation.start).format("YYYY-MM-DD HH:mm");
          const end = moment(reservation.end).format("YYYY-MM-DD HH:mm");
          return { start, end, name: "Reserved", color: "error" };
        });
        this.events.push(...reservations);
      }
    } catch (e) {
      this.$router.push(`/error/${e}`);
    }
  }

  mounted() {
    this.loading = false;
  }

  toggleCalendar() {
    this.isCalendar = !this.isCalendar;
  }

  async handleAddReservation({
    start,
    end
  }: {
    start: moment.Moment;
    end: moment.Moment;
  }) {
    try {
      await ReservationService.add(
        Number(this.$route.params.id),
        moment(start).format(),
        moment(end).format()
      );
      this.$router.go(0);
    } catch (e) {
      this.errorMessage = e;
      await timeout(1000);
      this.$router.go(0);
    }
  }
}
</script>
