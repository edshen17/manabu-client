<template>
  <div class="ViewCalendar">
    <div v-if="isLoaded">
      <kalendar :configuration="calendar_settings" :events.sync="events">
      <div
        slot="created-card"
        slot-scope="{ event_information }"
        :id="event_information.data.from"
        class="details-card"
        @click="colorSlot(event_information.data.from, event_information.data.to, reservationLength)"
        @mouseover="hoverSlot(event_information.data.from, event_information.data.to, reservationLength)"
        @mouseleave="unhoverSlot()"
      > 
        <span class="time appointment-title" style="text-align: left"
          >{{parseISOString(event_information.start_time) }} -
          {{parseISOString(event_information.end_time)}}</span>
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
      unhoverSlot() {
          const hoveredElements = document.getElementsByClassName('on-hover');
          while(hoveredElements.length > 0){
              hoveredElements[0].classList.remove('on-hover');
          }
      },
      hoverSlot(startTime, endTime, reservationLength) {
        this.selected = startTime;
        let firstColorSlot = document.getElementById(startTime);
        let secondColorSlot = document.getElementById(endTime);
        let thirdTimeSlot = moment(endTime).add(30, 'minutes').toISOString();
        let thirdColorSlot = document.getElementById(thirdTimeSlot);
        const isFirstColorSlotHovered = firstColorSlot.parentNode.classList.value.split(' ').includes('on-hover')
        const firstColorSlotParentClasses = firstColorSlot.parentNode.classList;
        let isInvalidSelection = false;

        this.unhoverSlot()

        if (reservationLength == 30) { // hover only 1 slot
            firstColorSlot.parentNode.classList.add("on-hover");
        } else if (reservationLength == 60 && secondColorSlot) { // hover only 2 slots
            firstColorSlot.parentNode.classList.add("on-hover");
            secondColorSlot.parentNode.classList.add("on-hover");
        } else if (reservationLength == 90 && secondColorSlot && thirdColorSlot) { // hover only 3 slots
            firstColorSlot.parentNode.classList.add("on-hover");
            secondColorSlot.parentNode.classList.add("on-hover");
            thirdColorSlot.parentNode.classList.add("on-hover");
        }
      },
      colorSlot(startTime, endTime, reservationLength) {
        this.selected = startTime;
        let firstColorSlot = document.getElementById(startTime);
        let secondColorSlot = document.getElementById(endTime);
        let thirdTimeSlot = moment(endTime).add(30, 'minutes').toISOString();
        let thirdColorSlot = document.getElementById(thirdTimeSlot);
        const isFirstColorSlotSelected = firstColorSlot.parentNode.classList.value.split(' ').includes('on-select')
        const firstColorSlotParentClasses = firstColorSlot.parentNode.classList;
        let isInvalidSelection = false;

        if (reservationLength == 30) { // reserve only 1 slot
            if (!isFirstColorSlotSelected) {
              firstColorSlot.parentNode.classList.add("on-select");
            } else {
              firstColorSlot.parentNode.classList.remove("on-select");
            }
            
        } else if (reservationLength == 60 && secondColorSlot) { // reserve only 2 slots
            const isSecondColorSlotSelected = secondColorSlot.parentNode.classList.value.split(' ').includes('on-select')
            const secondColorSlotParentClasses = secondColorSlot.parentNode.classList;
            const selectedElements = document.getElementsByClassName("on-select")

            for (let i = 0; i < selectedElements.length; i++) { // check if selected box is an "invalid" action (eg. undoing select on middle slots that weren't selected originally)
              if (selectedElements[i] == firstColorSlot.parentNode && i % 2 == 1) {
                isInvalidSelection = true;
              }
            }
              if (!isFirstColorSlotSelected && !isSecondColorSlotSelected) { // if not selected, apply selection class
              firstColorSlotParentClasses.add("on-select");
              secondColorSlotParentClasses.add("on-select");
            } else if (isFirstColorSlotSelected && isSecondColorSlotSelected && !isInvalidSelection) { // otherwise, check if valid move before removing class
              firstColorSlotParentClasses.remove("on-select");
              secondColorSlotParentClasses.remove("on-select");
            }
        } else if (reservationLength == 90 && secondColorSlot && thirdColorSlot) { // reserve only 3 slots
              const isSecondColorSlotSelected = secondColorSlot.parentNode.classList.value.split(' ').includes('on-select')
              const secondColorSlotParentClasses = secondColorSlot.parentNode.classList;
              const isThirdColorSlotSelected = thirdColorSlot.parentNode.classList.value.split(' ').includes('on-select')
              const thirdColorSlotParentClasses = thirdColorSlot.parentNode.classList;
              const selectedElements = document.getElementsByClassName("on-select")

              for (let i = 0; i < selectedElements.length; i++) { // check if selected box is an "invalid" action (eg. undoing select on middle slots that weren't selected originally)
              if (selectedElements[i] == firstColorSlot.parentNode && i % 3 == 1) {
                isInvalidSelection = true;
              }
            }
              if (!isFirstColorSlotSelected && !isSecondColorSlotSelected && !isThirdColorSlotSelected) { // if not selected, apply selection class
                firstColorSlotParentClasses.add("on-select");
                secondColorSlotParentClasses.add("on-select");
                thirdColorSlotParentClasses.add("on-select");
            } else if (isFirstColorSlotSelected && isSecondColorSlotSelected && isThirdColorSlotSelected && !isInvalidSelection) { // otherwise, check if valid move before removing class
                firstColorSlotParentClasses.remove("on-select");
                secondColorSlotParentClasses.remove("on-select");
                thirdColorSlotParentClasses.remove("on-select");
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
                data: { // make a data object to be used later, as Kalendar converts from and to to another date string format...
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
          return parts[1].substring(0,5)
      },
    },
  }
</script>

<style lang="css">

.kalendar-cell .on-hover {
  filter: brightness(90%);
}

.time {
  position: relative !important;
  bottom: 0;
  right: 0 !important;
  margin: 4px 6px !important;
}

.created-event {
  display: flex;
  padding: 0 !important;
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
  background-color: #00bfbd !important;
}

.is-past {
  user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
}

</style>
