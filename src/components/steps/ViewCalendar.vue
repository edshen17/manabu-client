<template>
  <div class="ViewCalendar">
    <div v-if="isLoaded">
      <kalendar :configuration="calendar_settings" :events.sync="events">
      <div
        slot="created-card"
        slot-scope="{ event_information }"
        :id="event_information.data.from"
        :class="{ 'details-card': selected != event_information.data.from}"
        @click="colorSlot(event_information.data.from, event_information.data.to, reservationLength)"
      > 
        <span class="time appointment-title" style="text-align: left"
          >{{parseISOString(event_information.start_time) }} -
          {{parseISOString(event_information.end_time)}}</span>

          <div class="popup-wrapper">
            <div class="popup-event">
              <div>
                <div class="row">
                  <input type="submit" id="btnSearch" value="Save" class="app-button">
                  <input type="submit" id="btnClearSearch" value="Cancel" class="app-button">
                </div>
              </div>
            </div>
          </div>
      </div>
      
      <div
        slot="popup-form"
        slot-scope="{ popup_information }"
      >
        <div class="row">
          <input type="submit" class="app-button" id="btnSearch" value="Save" @click="addEvent(popup_information)">
          <input type="submit" class="app-button" id="btnClearSearch" value="Cancel" @click="$kalendar.closePopups()">
        </div>
      </div>
    </kalendar>
    </div>
    <div v-else class="d-flex justify-content-center my-4">
        <b-spinner label="Loading..."></b-spinner>
      </div>
  </div>
</template>
<script>
import { Kalendar } from 'kalendar-vue';
import moment from 'moment'
import axios from 'axios'

export default {
    name: 'ViewCalendar',
    components: {
        Kalendar
    },
    props: {
      userId: String,
      reservationLength: Number,
    },
    mounted() {
      axios.get(`${this.host}/schedule/${this.userId}/availableTime`).then((res) => {
        if (res.status == 200) {
          for (let i = 0; i < res.data.length; i++) {
            this.intervals(res.data[i].from, res.data[i].to)
          }
          this.isLoaded = true;
        }
      })
    },
    data() {
        return {
            host: 'http://localhost:5000/api',
            calendar_settings: {
                    style: 'material_design',
                    view_type: 'week',
                    cell_height: 10,
                    scrollToNow: false,
                    start_day: new Date().toISOString(),
                    read_only: true,
                    day_starts_at: 0,
                    day_ends_at: 24,
                },
              isLoaded: false,
              selected: null,
              events: []
        }
    },
    methods: {
      colorSlot(startTime, endTime, reservationLength) {
        this.selected = startTime;
        // remove any classes from the elements (if user clicks on another slot)
        const selected = document.getElementsByClassName('on-select');
        while(selected.length > 0){
          selected[0].classList.remove('on-select');
        }

        // get all the slots relative to each other, given the kalendar event slot
        let firstColorSlot = document.getElementById(startTime);
        let secondColorSlot = document.getElementById(endTime);
        let thirdTimeSlot = moment(endTime).add(30, 'minutes').toISOString();
        let thirdColorSlot = document.getElementById(thirdTimeSlot);

        if (firstColorSlot) {
          if (reservationLength == 30) { // reserve only 1 slot and show the popup by adding the details-card class (which was removed)
            firstColorSlot.parentNode.classList.add("on-select", "details-card");
            return;
          } else if (reservationLength == 60 && secondColorSlot) { // reserve only 2 slots
              firstColorSlot.parentNode.classList.add("on-select", "details-card");
              secondColorSlot.parentNode.classList.add("on-select");
              return;
          } else if (reservationLength == 90 && secondColorSlot 
                    && thirdColorSlot) { // reserve only 3 slots
              firstColorSlot.parentNode.classList.add("on-select", "details-card");
              secondColorSlot.parentNode.classList.add("on-select");
              thirdColorSlot.parentNode.classList.add("on-select");
              return;
          }
        }
      },
      intervals(startString, endString) { // split up any time into 30m intervals
        const start = moment(startString);
        const end = moment(endString);
        start.minutes(Math.ceil(start.minutes() / 30) * 30);

        const result = [];

        const current = moment(start);

        while (current <= end) {
            result.push(current.toISOString());
            current.add(30, 'minutes');
        }

        for (let i = 0; i < result.length; i++) {
            if (i != result.length - 1) {
              const formatedDate = {
                from: result[i],
                to: result[i+1],
                data: { // make a data object to be used later, as Kalendar converts from and to to another format...
                  from: result[i],
                  to: result[i+1],
                }
              }
              this.events.push(formatedDate);
            }
          }
      },
      parseISOString(dateStr) {
          const parts = dateStr.split('T');
          const test = parts[1];
          return parts[1].substring(0,5)
      },
    },
  }
</script>

<style lang="css">
.time {
  position: relative !important;
  bottom: 0;
  right: 0 !important;
  margin: 4px 6px !important;
}

.created-event {
  display: flex;
  padding: 0;
}

.created .details-card {
  flex: 1;
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

.app-button{
    width: 150px;
    margin:0 20px;
    display:inline-block;
    line-height: 30px;
}
.row {
  text-align:center;
  margin-left:-20px;
  margin-right:-20px;
}

.kalendar-wrapper.gstyle .created-event {
  width: 100% !important;
}

.on-select {
  background-color: #90ee90 !important;
}

.is-past {
  user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
}

</style>
