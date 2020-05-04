<template>
  <div>
    <v-sheet height="64">
      <v-toolbar flat>
        <v-btn
          fab
          small
          :disabled="isThisMonth"
          @click="$refs.calendar.prev()"
          color="primary"
        >
          <v-icon small>mdi-chevron-left</v-icon>
        </v-btn>
        <v-spacer />
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer />
        <v-btn
          fab
          small
          :disabled="isNextMonth"
          @click="$refs.calendar.next()"
          color="primary"
        >
          <v-icon small>mdi-chevron-right</v-icon>
        </v-btn>
      </v-toolbar>
    </v-sheet>
    <v-sheet height="1000">
      <v-calendar
        ref="calendar"
        v-model="focus"
        :events="events"
        @click:event="showEvent"
        @click:date="selectableDate"
      ></v-calendar>
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
        ><v-card
          ><v-toolbar
            ><v-btn icon><v-icon>mdi-event-seat</v-icon></v-btn>
            <v-toolbar-title>Reservation</v-toolbar-title>
            <v-card-subtitle
              >Please reserve following time slots</v-card-subtitle
            >
          </v-toolbar>
          <v-card-text>
            <v-row justify="space-around" align="center">
              <v-col style="width: 290px; flex: 0 1 auto;">
                <h2>Start:</h2>
                <v-time-picker
                  v-model="start"
                  format="24hr"
                  :min="minStart"
                  :max="maxStart"
                  :allowed-minutes="allowedStep"
                  @click:hour="onChangeStart"
                ></v-time-picker>
              </v-col>
              <v-col style="width: 290px; flex: 0 1 auto;">
                <h2>End:</h2>
                <v-time-picker
                  v-model="end"
                  :allowed-minutes="allowedStep"
                  :min="minEnd"
                  :max="maxEnd"
                  format="24hr"
                  @click:hour="onChangeEnd"
                ></v-time-picker>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              text
              color="ibory"
              :disabled="!start || !end"
              @click="addReservation"
            >
              Reserve
            </v-btn>
            <v-spacer />
          </v-card-actions> </v-card
      ></v-menu>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import moment from "moment";
import { timeout } from "@/utils/util";
import { EventContent } from "@/types/event";

@Component
export default class Calendar extends Vue {
  title = "";
  focus = "";
  selectedEvent = {};
  selectedElement: EventTarget | null = null;
  selectedOpen = false;
  minStart = "";
  maxStart = "";
  minEnd = "";
  maxEnd = "";
  start = "";
  end = "";
  @Prop(Array) readonly events?: Array<Event>;

  mounted() {
    this.title = ` ${moment().format("YYYY/MM/DD")}~${this.maxDate().format(
      "MM/DD"
    )} Reservation `;
    this.focus = this.findToday();
  }

  get calendarInstance(): Vue & {
    prev: () => void;
    next: () => void;
    getFormatter: (format: unknown) => unknown;
  } {
    return this.$refs.calendar as Vue & {
      prev: () => void;
      next: () => void;
      getFormatter: (format: unknown) => unknown;
    };
  }

  get isThisMonth(): boolean {
    return moment().isSame(this.focus, "month");
  }

  get isNextMonth(): boolean {
    return this.maxDate().isSame(this.focus, "month");
  }

  findToday(): string {
    return moment().format("YYYY-MM-DD");
  }

  maxDate(): moment.Moment {
    return moment().add(30, "days");
  }

  selectableDate() {
    if (moment(this.focus, "YYYY-MM-DD").diff(moment()) < 0) {
      this.focus = this.findToday();
    }
    if (moment(this.focus, "YYYY-MM-DD").diff(this.maxDate()) > 0) {
      this.focus = this.maxDate().format("YYYY-MM-DD");
    }
  }

  async showEvent({
    nativeEvent,
    event
  }: {
    nativeEvent: Event;
    event: EventContent;
  }) {
    const open = async () => {
      this.selectedEvent = event;
      this.selectedElement = nativeEvent.target;

      const start = moment(event.start);
      const end = moment(event.end);
      this.start = start.format("HH:mm");
      this.end = end.format("HH:mm");
      this.minStart = start.format("HH:mm");
      this.maxEnd = end.format("HH:mm");
      this.maxStart = end.add(-1, "hour").format("HH:mm");
      this.minEnd = start.add(1, "hour").format("HH:mm");
      await timeout(10);
      this.selectedOpen = true;
      console.log(this.selectedOpen);
    };

    if (this.selectedOpen) {
      this.selectedOpen = false;
      await timeout(10);
    } else {
      await open();
    }
  }

  onChangeStart() {
    this.minEnd = moment(this.start, "HH:mm")
      .add(1, "hour")
      .format("HH:mm");
  }

  onChangeEnd() {
    this.maxStart = moment(this.end, "HH:mm")
      .add(-1, "hour")
      .format("HH:mm");
  }

  allowedStep(m: number): boolean {
    return m === 0;
  }

  async addReservation() {
    console.log(this.start, this.end);
  }
}
</script>
