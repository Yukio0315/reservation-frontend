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
          @cancel-reservation="handleCancelReservation"
        />
        <Profile
          v-if="!isCalendar"
          :profile="profile"
          :message="message"
          :messageState="messageState"
          @change-password="handleChangePassword"
          @change-email="handleChangeEmail"
          @change-user-name="handleChangeUserName"
          @cancel-reservation="handleCancelReservation"
        />
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
import moment from "moment";
import { timeout } from "../utils/util";

@Component({ components: { Calendar, Profile } })
export default class User extends Vue {
  loading = false;
  isCalendar = true;
  message = "";
  events: EventContent[] = [];
  profile: UserProfile = {
    createdAt: "",
    userName: "",
    email: "",
    permission: "",
    reservations: []
  };
  messageState: "success" | "error" = "success";

  async beforeCreate() {
    this.loading = true;
    const id = Number(this.$route.params.id);
    try {
      const eventResponse = await EventService.getAllEvents(id);
      const events: Duration[] = eventResponse.data;

      if (events)
        this.events = events.map(event => {
          const start = moment(event.start).format("YYYY-MM-DD HH:mm");
          const end = moment(event.end).format("YYYY-MM-DD HH:mm");
          return { start, end, name: "Available", color: "primary" };
        });
      if (!events) this.events = [];
    } catch (e) {
      this.$router.push(`/error/${e}`);
    }

    try {
      const profileResponse = await UserService.getUserProfile(id);
      this.profile = await profileResponse.data;
      if (this.profile.reservations) {
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
      this.$router.push(`/error/${e}`);
    }
  }

  async handleCancelReservation({
    start,
    end
  }: {
    start: moment.Moment;
    end: moment.Moment;
  }) {
    const reservation = this.profile.reservations.find(reservation => {
      return (
        moment(start).format() === reservation.start &&
        moment(end).format() === reservation.end
      );
    });

    const reservationId = (): number => {
      if (reservation) return reservation.id;
      return 0;
    };
    try {
      await ReservationService.cancel(
        Number(this.$route.params.id),
        reservationId()
      );
      this.$router.go(0);
    } catch (e) {
      this.$router.push(`/error/${e}`);
    }
  }

  async handleChangePassword({
    oldPassword,
    newPassword
  }: {
    oldPassword: string;
    newPassword: string;
  }) {
    try {
      await UserService.changePassword(
        Number(this.$route.params.id),
        oldPassword,
        newPassword
      );
      this.message = "You have changed email address successfully";
      this.messageState = "success";
      await timeout(2000);
      this.message = "";
    } catch (e) {
      this.message = "Invalid old password";
      this.messageState = "error";
      await timeout(2000);
      this.message = "";
    }
  }

  async handleChangeUserName(userName: string) {
    await UserService.changeUserName(
      Number(this.$route.params.id),
      userName
    ).catch(e => this.$router.push(`/error/${e}`));
  }

  async handleChangeEmail(email: string) {
    await UserService.changeEmail(
      Number(this.$route.params.id),
      email
    ).catch(e => this.$router.push(`/error/${e}`));
  }
}
</script>
