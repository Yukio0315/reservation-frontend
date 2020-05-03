<template>
  <div>
    <v-sheet height="64">
      <v-toolbar flat color="white">
        <v-btn fab text small color="grey darken-2" @click="prev">
          <v-icon small>mdi-chevron-left</v-icon>
        </v-btn>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-btn fab text small color="grey darken-2" @click="next">
          <v-icon small>mdi-chevron-right</v-icon>
        </v-btn>
      </v-toolbar>
    </v-sheet>
    <v-sheet height="1000">
      <v-calendar
        ref="calendar"
        :events="events"
        @click:event="showEvent"
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
  title = "title";
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

  // monthFormatter() {
  //   return this.calendarInstance.getFormatter({
  //     timeZone: "JST",
  //     month: "long"
  //   });
  // }

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
      this.start = moment(event.start).format("HH:mm");
      this.end = moment(event.end).format("HH:mm");
      this.minStart = moment(event.start).format("HH:mm");
      this.maxStart = moment(event.end)
        .add(-1, "hour")
        .format("HH:mm");
      this.minEnd = moment(event.start)
        .add(1, "hour")
        .format("HH:mm");
      this.maxEnd = moment(event.end).format("HH:mm");
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

  prev() {
    this.calendarInstance.prev();
  }

  next() {
    this.calendarInstance.next();
  }

  allowedStep(m: number): boolean {
    return m === 0;
  }

  async addReservation() {
    console.log(this.start, this.end);
  }
}
</script>
