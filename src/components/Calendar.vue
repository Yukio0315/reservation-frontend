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
        :event-color="getEventColor"
        @click:event="showEvent"
        @click:date="selectableDate"
      ></v-calendar>
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        open-delay="10"
        close-delay="10"
        offset-x
      >
        <v-card v-if="isAvailable"
          ><v-toolbar
            ><v-btn icon><v-icon>mdi-check-circle</v-icon></v-btn>
            <v-toolbar-title>Reservation</v-toolbar-title>
          </v-toolbar>
          <v-card-subtitle class="subtitle-1"
            >Please reserve following time slots</v-card-subtitle
          >
          <v-card-text>
            <v-row justify="space-around" align="center" style="width: 580px;">
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
              color="primary"
              :disabled="!start || !end"
              @click.stop="confirm = true"
            >
              Reserve
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
        <v-card v-else>
          <v-toolbar
            ><v-btn icon><v-icon>mdi-alarm</v-icon></v-btn>
            <v-toolbar-title>Reserved</v-toolbar-title>
          </v-toolbar>
          <v-card-subtitle class="subtitle-1"
            >You reserved the date below.</v-card-subtitle
          >
          <v-card-text>
            {{ selectedDate }}<br />
            {{ start }} ~ {{ end }}
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="error" @click="cancelReservation">Cancel</v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-sheet>
    <v-row justify="center">
      <v-dialog v-model="confirm" max-width="440">
        <v-card>
          <v-card-title
            >Would you like to reserve the date bellow?</v-card-title
          >
          <v-card-subtitle class="display-1">
            {{ selectedDate }}<br />
            {{ start }} ~ {{ end }}
          </v-card-subtitle>
          <v-card-actions>
            <v-spacer />
            <v-btn color="red" @click="addReservation">Confirm</v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import moment from "moment";
import { EventContent } from "@/types/event";

@Component
export default class Calendar extends Vue {
  title = "";
  focus = "";
  selectedEvent: EventContent = { name: "", start: "", end: "", color: "" };
  selectedElement: EventTarget | null = null;
  selectedOpen = false;
  selectedDate = "";
  minStart = "";
  maxStart = "";
  minEnd = "";
  maxEnd = "";
  start = "";
  end = "";
  confirm = false;
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

  get isAvailable(): boolean {
    return this.selectedEvent.name === "Available";
  }

  findToday(): string {
    return moment().format("YYYY-MM-DD");
  }

  maxDate(): moment.Moment {
    return moment().add(30, "days");
  }

  getEventColor(event: EventContent): string {
    return event.color;
  }

  selectableDate() {
    if (moment(this.focus, "YYYY-MM-DD").diff(moment()) < 0) {
      this.focus = this.findToday();
    }
    if (moment(this.focus, "YYYY-MM-DD").diff(this.maxDate()) > 0) {
      this.focus = this.maxDate().format("YYYY-MM-DD");
    }
  }

  showEvent({
    nativeEvent,
    event
  }: {
    nativeEvent: Event;
    event: EventContent;
  }) {
    const open = () => {
      this.selectedEvent = event;
      this.selectedElement = nativeEvent.target;
      const start = moment(event.start);
      const end = moment(event.end);
      this.selectedDate = start.format("YYYY/MM/DD");
      this.start = this.minStart = start.format("HH:mm");
      this.end = this.maxEnd = end.format("HH:mm");
      this.maxStart = end.add(-1, "hour").format("HH:mm");
      this.minEnd = start.add(1, "hour").format("HH:mm");
      this.selectedOpen = true;
    };

    if (this.selectedOpen) {
      this.selectedOpen = false;
    } else {
      open();
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

  @Emit()
  addReservation() {
    const start = moment(
      `${this.selectedDate} ${this.start}`,
      "YYYY/MM/DD HH:mm"
    );
    const end = moment(`${this.selectedDate} ${this.end}`, "YYYY/MM/DD HH:mm");
    return { start, end };
  }

  @Emit()
  cancelReservation() {
    const start = moment(
      `${this.selectedDate} ${this.start}`,
      "YYYY/MM/DD HH:mm"
    );
    const end = moment(`${this.selectedDate} ${this.end}`, "YYYY/MM/DD HH:mm");
    return { start, end };
  }
}
</script>
