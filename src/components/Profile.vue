<template>
  <v-card class="mx-auto">
    <v-card-title>User Profile</v-card-title>
    <v-card-text>
      <v-form>
        <ValidationProvider
          v-slot="{ errors, valid }"
          name="Name"
          rules="required|alpha_spaces|min:2|max:20"
        >
          <v-text-field
            v-model="name"
            @keyup="setIsValidName(valid)"
            label="Name"
            name="Name"
            :counter="10"
            :error-messages="errors"
            prepend-icon="mdi-account"
            :append-icon="editUserName ? 'mdi-check-circle' : 'mdi-pencil'"
            @click:append="editOrSaveUserName"
            :readonly="!editUserName"
            type="text"
            required
            outlined
          />
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors, valid }"
          name="Email"
          rules="required|email"
        >
          <v-text-field
            v-model="email"
            @keyup="setIsValidEmail(valid)"
            label="Email"
            name="Email"
            :error-messages="errors"
            prepend-icon="mdi-email"
            :append-icon="editEmail ? 'mdi-check-circle' : 'mdi-pencil'"
            @click:append="editOrSaveEmail"
            :readonly="!editEmail"
            type="text"
            required
            outlined
          />
        </ValidationProvider>
      </v-form>
      <v-list>
        <v-list-item-title>Reservations</v-list-item-title>
        <v-list-item v-if="isEmptyReservation">No reservations</v-list-item>
        <v-list-item
          v-for="(reservation, index) in profile.reservations"
          :key="reservation.id"
          ><v-list-item-content
            >{{ index + 1 }}. {{ reservationDate(reservation.start) }}
            {{ reservationStart(reservation.start) }} ~
            {{ reservationEnd(reservation.end) }}
          </v-list-item-content>
          <v-list-item-icon @click="cancelReservation(reservation)"
            ><v-icon color="error">mdi-close</v-icon></v-list-item-icon
          >
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-alert :type="messageState" v-if="message">{{ message }}</v-alert>
    <v-card-actions>
      <v-spacer />
      <v-btn
        :color="showChangePassword ? 'primary' : undefined"
        @click="toggleShowChangePassword"
        ><v-icon>mdi-lock</v-icon>Change password</v-btn
      >
      <v-btn
        v-if="profile.permission === 'user'"
        :color="showDeleteAccount ? 'primary' : undefined"
        @click="toggleShowDeleteAccount"
        ><v-icon>mdi-delete-sweep</v-icon>Delete this account</v-btn
      >
    </v-card-actions>
    <ChangePassword
      v-if="showChangePassword"
      @changePassword="changePassword"
    />
    <DeleteAccount
      v-if="showDeleteAccount"
      :validEmail="email"
      @deleteAccount="deleteAccount"
    />
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { UserProfile, Reservation } from "@/types/user";
import { ValidationProvider } from "vee-validate";
import moment from "moment";
import ChangePassword from "@/components/ChangePassword.vue";
import DeleteAccount from "@/components/DeleteAccount.vue";

@Component({
  components: { ValidationProvider, ChangePassword, DeleteAccount }
})
export default class Profile extends Vue {
  @Prop(Object) readonly profile!: UserProfile;
  @Prop(String) readonly messageState!: "success" | "error";
  @Prop(String) readonly message!: string;
  editUserName = false;
  editEmail = false;
  isValidName = true;
  isValidEmail = true;
  isEmptyReservation: boolean = this.profile.reservations === null;
  showChangePassword = false;
  showDeleteAccount = false;
  name = this.profile.userName;
  email = this.profile.email;

  reservationDate(start: string) {
    return moment(start).format("YYYY/MM/DD");
  }

  reservationStart(start: string) {
    return moment(start).format("HH:mm");
  }

  reservationEnd(end: string) {
    return moment(end).format("HH:mm");
  }

  setIsValidName(valid: boolean) {
    this.isValidName = valid;
  }

  setIsValidEmail(valid: boolean) {
    this.isValidEmail = valid;
  }

  editOrSaveUserName() {
    if (this.isValidName) {
      this.editUserName = !this.editUserName;
      if (this.name != this.profile.userName && !this.editUserName)
        this.$emit("change-user-name", this.name);
    }
  }
  editOrSaveEmail() {
    if (this.isValidEmail) {
      this.editEmail = !this.editEmail;
      if (this.email != this.profile.email && !this.editEmail)
        this.$emit("change-email", this.email);
    }
  }

  toggleShowChangePassword() {
    this.showChangePassword = !this.showChangePassword;
    this.showDeleteAccount = false;
  }

  toggleShowDeleteAccount() {
    this.showDeleteAccount = !this.showDeleteAccount;
    this.showChangePassword = false;
  }

  @Emit()
  cancelReservation(reservation: Reservation) {
    return { start: moment(reservation.start), end: moment(reservation.end) };
  }

  @Emit()
  changePassword(passwords: { newPassword: string; oldPassword: string }) {
    return passwords;
  }

  @Emit()
  deleteAccount(email: string) {
    return email;
  }
}
</script>
