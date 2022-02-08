<template>
  <div data-app>
    <v-menu
      v-model="showMenu"
      :offset-y="isMobile"
      :close-on-content-click="false"
      :close-on-click="true"
      :min-width="menuWidth"
      :left="showMenuOnLeft"
      offset-x
    >
      <template v-slot:activator="{ on, attrs }">
        <slot name="activator" :on="on" :attrs="attrs" />
      </template>
      <v-card color="grey lighten-4" flat>
        <v-card-text>
          <div class="flex">
            <p
              v-if="selectedEvent.attributes"
              class="text-black text-lg tracking-wide inline cursor-pointer underline text-blue-400"
            >
              <router-link
                target="_blank"
                :to="{
                  name: 'AppointmentCard',
                  params: {
                    appointmentId: selectedEvent.attributes._id,
                    appointment: selectedEvent.attributes.originalEvent.event,
                  },
                }"
                >{{ getEventTitle(selectedEvent) }}</router-link
              >
            </p>
          </div>
          <div class="flex flex-wrap content-start text-gray-500 inline py-2">
            <p>
              {{ formatDate({ date: selectedEvent.start, dateFormat: DATE_FORMAT.ABRIDGED_DATE }) }}
            </p>
            <p class="mx-1 text-lg -my-1 font-bold">⋅</p>
            <p>{{ formatDate({ date: selectedEvent.start, dateFormat: DATE_FORMAT.HOUR }) }}</p>
            <p class="mx-1 -my-1 text-lg font-thin">-</p>
            <p>{{ formatDate({ date: selectedEvent.end, dateFormat: DATE_FORMAT.HOUR }) }}</p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            v-show="showConfirmButton"
            text
            class="m-0 animate-pulse"
            @click="onButtonClick('event:confirm')"
          >
            <p class="text-green-600">{{ $t('button.common.confirm') }}</p>
          </v-btn>
          <v-btn v-show="showCancelButton" text @click="onButtonClick('event:cancel')">
            <p class="text-red-600">{{ $t('button.common.cancel') }}</p>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { makeCalendarMixin } from '../../mixins/calendar';
import { mapGetters } from 'vuex';
import { AppointmentDoc } from '@server/models/Appointment';

export default Vue.extend({
  name: 'AppointmentEditor',
  components: {},
  mixins: [makeCalendarMixin],
  props: {
    selectedEventCoord: {
      type: Object,
      default: () => ({ x: 0, y: 0 }),
      required: true,
    },
    selectedEvent: {
      type: Object,
      default: () => ({}),
      required: true,
    },
  },
  data() {
    return {
      showMenu: false,
    };
  },
  computed: {
    ...mapGetters({
      locale: 'user/locale',
      userData: 'user/entityStateData',
    }),
    menuWidth: {
      get(): string {
        const menuWidth = '340px';
        return menuWidth;
      },
    },
    showMenuOnLeft: {
      get(): boolean {
        const windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const showMenuOnLeft = this.selectedEventCoord.x > windowWidth / 2;
        return showMenuOnLeft;
      },
    },
    showConfirmButton: {
      get(): boolean | undefined {
        if (this.selectedEvent.attributes && this.selectedEvent.attributes.originalEvent.event) {
          const appointment = this.selectedEvent.attributes.originalEvent.event as AppointmentDoc;
          const showConfirmButton =
            appointment.status == 'pending' && appointment.hostedById == this.userData._id;
          return showConfirmButton;
        } else {
          return false;
        }
      },
    },
    showCancelButton: {
      get(): boolean | undefined {
        if (this.selectedEvent.attributes && this.selectedEvent.attributes.originalEvent.event) {
          const appointment = this.selectedEvent.attributes.originalEvent.event as AppointmentDoc;
          const showCancelButton =
            appointment.status != 'cancelled' &&
            appointment.status != 'completed' &&
            appointment.hostedById == this.userData._id;
          return showCancelButton;
        } else {
          return false;
        }
      },
    },
    // showCancelButton: {
    //   get(): boolean {
    //     const appointment = this.selectedEvent.attributes.originalEvent.event as AppointmentDoc;
    //     const showCancelButton =
    //       appointment.status != 'cancelled' && appointment.status != 'completed';
    //     return showCancelButton;
    //   },
    // },
  },
  mounted() {
    return;
  },
  methods: {
    onButtonClick(eventName: string) {
      this.$emit(eventName, this.selectedEvent);
      this.showMenu = false;
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../assets/scss/calendar.scss';
</style>
