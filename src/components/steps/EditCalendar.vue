<template>
  <div class="EditCalendar">
    <div></div>
    <kalendar :configuration="calendar_settings" :events.sync="events">
      <div slot="creating-card" slot-scope="{ event_information }">
        <h4 class="appointment-title" style="text-align: left">
          Available Time
        </h4>
        <span class="time">
          {{parseISOString(event_information.start_time)}}
          -
          {{parseISOString(event_information.end_time)}}
        </span>
      </div>
      <div
        slot="created-card"
        slot-scope="{ event_information }"
        class="details-card"
      >
        <h4 class="appointment-title" style="text-align: left">
          Available Time
        </h4>
        <span class="time" style="text-align: left"
          >{{parseISOString(event_information.start_time) }} -
          {{parseISOString(event_information.end_time)}}</span
        >
        <button @click="removeEvent(event_information)" class="remove">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            data-reactid="1326"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </button>
      </div>
      <!-- POPUP CARD SLOT -->
      <div
        slot="popup-form"
        slot-scope="{ popup_information }"
        style="display: flex; flex-direction: column"
      >
        <div class="buttons">
          <button class="cancel" @click="$kalendar.closePopups();">
            Cancel
          </button>
          <button @click="addEvent(popup_information)">Save</button>
        </div>
      </div>
    </kalendar>
  </div>
</template>
<script>
import { Kalendar } from 'kalendar-vue';

export default {
    name: 'EditCalendar',
    components: {
        Kalendar
    },
    // created() {
    //     Vue.filter('formatToHours', (value, how) => {

    //     });
    // },
    data() {
        return {
            calendar_settings: {
                    style: 'material_design',
                    view_type: 'week',
                    cell_height: 10,
                    scrollToNow: false,
                    start_day: new Date().toISOString(),
                    read_only: false,
                    day_starts_at: 0,
                    day_ends_at: 24,
                    overlap: false,
                    past_event_creation: false
                },
                events: [
                {
                    from: '2021-01-01T18:00:00Z',
                    to: '2021-01-01T19:00:00Z',
                    data: 'Event 1',
                },
                {
                    from: '2021-01-01T19:00:00Z',
                    to: '2021-01-01T21:00:00Z',
                    data: 'Olive & Friends',
                },
            ],
        }
    },
    methods: {
    parseISOString(dateStr) {
        const parts = dateStr.split('T');
        const test = parts[1];
        return parts[1].substring(0,5)
    },
        removeEvent(kalendarEvent) {
            let day = kalendarEvent.start_time.slice(0, 10);
            this.$kalendar.removeEvent({
                day,
                key: kalendarEvent.key,
                id: kalendarEvent.kalendar_id,
        })
        },
        addEvent(popup_data, form_data) {
        let payload = {
            from: popup_data.start_time,
            to: popup_data.end_time,
        };

        this.$kalendar.addNewEvent(
            payload,
        );
        this.$kalendar.closePopups();
},
    },
}
</script>

<style lang="css">
.time {
  position: relative !important;
  bottom: 0;
  right: 0 !important;
  font-size: 1.1em !important;
}

.details-card button {
  margin: 0;
  border: none;
  color: #4c4b4b;
  position: absolute;
  padding-right: 0;
  top: 0px;
  right: 5px;
  cursor: pointer;
  background: transparent;
}

.details-card button svg {
  width: 18px;
  height: 18px;
  fill: #fff;
}
</style>
