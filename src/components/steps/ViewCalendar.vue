<template>
  <div class="ViewCalendar">
    <b-modal
      id="complete-modal"
      title="Success!"
      :no-close-on-backdrop="true"
      ok-only
    >
      <p class="my-4">
        Your reservation has been made and is pending confirmation. You can
        cancel or reschedule the appointment up to 24 hours before the meeting
        begins. We will contact you soon.
      </p>
      <template v-slot:modal-ok>
        OK
      </template>
    </b-modal>
    <b-modal
      id="cancel-modal"
      title="Cancel this appointment?"
      :no-close-on-backdrop="true"
    >
      <p class="my-4" v-show="!deleteErr">
        Are you sure you want to cancel this appointment?
      </p>
      <p class="my-4" v-show="deleteErr">
        There was an error processing your request. Please make sure you did not click on reserved timeslots between two appointments.
      </p>
      <template #modal-footer>
        <b-button @click="$bvModal.hide('cancel-modal')" v-show="!deleteErr">
          <div>Cancel</div>
      </b-button>
      <b-button @click="deleteErr = false; $bvModal.hide('cancel-modal')" variant="primary" v-show="deleteErr">
        <div>OK</div>
      </b-button>
      <b-button @click="cancelAppointment(cancelStartTime)" variant="primary" v-show="!deleteErr">
        <div>Yes</div>
      </b-button>
    </template>
    </b-modal>
    <div v-if="isLoaded">
      <h4 class="text-center slots-left" v-if="slotsLeft == 1">
        {{ slotsLeft }} time slot left to reserve
      </h4>
      <h4 class="text-center slots-left" v-else>
        {{ slotsLeft }} time slots left to reserve
      </h4>
      <button
        @click="createAppointments()"
        class="add-manual"
        :class="{ 'enabled-button': slotsLeft != reservationSlotLimit }"
        :disabled="slotsLeft == reservationSlotLimit"
      >
        <i class="fas fa-arrow-right"></i>
      </button>
      <kalendar
        :configuration="calendar_settings"
        :events.sync="events"
        ref="kalendar"
      >
        <div
          slot="created-card"
          slot-scope="{ event_information }"
          :id="event_information.data.from"
          class="details-card"
          :class="{'booked-by-self': event_information.data.reservedBy == reservedBy, 
          'booked-by-other': event_information.data.reservedBy != reservedBy && event_information.data.reservedBy != '',
          'reserved': event_information.data.reservedBy }"
          @click="colorSlot(event_information.data.from)"
          @mouseover="applySlotClass(event_information.data.from, reservationLength, 'on-hover')"
          @mouseleave="removeSlotClass('on-hover')"
        >
          <span class="time appointment-title" style="text-align: left"
            >{{ parseISOString(event_information.start_time) }} -
            {{ parseISOString(event_information.end_time)}}</span
          >
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
      reservedBy: String,
      createdBy: String,
      reservationLength: Number,
      reservationSlotLimit: Number,
    },
      watch: {
        'currentDayLoaded' () { // when DOM is loaded, add the below events on the arrows to get updates in date
          document.getElementsByClassName('week-navigator-button')[0].addEventListener('click', () => {
            this.onChangeWeek();
          })
          document.getElementsByClassName('week-navigator-button')[1].addEventListener('click', () => {
            this.onChangeWeek();
          })
        },
      },
    mounted() {
      const lastWeeks = moment().subtract(2, 'week');
      const nextWeeks = moment().add(2, 'week');
      axios.get(`${this.host}/schedule/${this.createdBy}/availableTime/${lastWeeks.toISOString()}/${nextWeeks.toISOString()}`).then((resAvailableTimes) => {
        if (resAvailableTimes.status == 200) {
          axios.get(`${this.host}/schedule/${this.createdBy}/appointment/${lastWeeks.toISOString()}/${nextWeeks.toISOString()}`).then((resAppointments) => {
            if (resAppointments.status == 200) {
              const combinedTimeSlots = resAvailableTimes.data.concat(resAppointments.data);
              for (let i = 0; i < combinedTimeSlots.length; i++) {
                const reservedBy = combinedTimeSlots[i].reservedBy ? combinedTimeSlots[i].reservedBy : '';
                this.intervals(combinedTimeSlots[i].from, combinedTimeSlots[i].to, reservedBy);
              }
              this.isLoaded = true;
            }
          });
        }
      });

      setTimeout(() => {
        this.currentDayLoaded = true;
        this.currentDay = this.$refs.kalendar._data.current_day;
       }, 200);
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
              currentlySelected: [],
              events: [],
              slotsLeft: this.reservationSlotLimit,
              currentDay: '',
              currentDayLoaded: false,
              madeReservation: false,
              cancelStartTime: '',
              deleteErr: false,
        }
    },
    methods: {
      cancelAppointment(startTime) {
        if (this.deleteErr) this.deleteErr = false;
        const deleteObj = {
            createdBy: this.createdBy,
            from: startTime,
            reservedBy: this.reservedBy,
          }
          
        axios.delete(`${this.host}/schedule/appointment`, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          },
          data: {
            deleteObj
          }
        }
        ).then(() => {
           this.$bvModal.hide('cancel-modal');
           this.removeSlotClassSpecific(startTime, this.reservationLength, 'reserved')
           this.removeSlotClassSpecific(startTime, this.reservationLength, 'booked-by-self')
        }).catch((err) => {
          this.deleteErr = true;
        });
      },
      createAppointments() {
        if (this.slotsLeft != this.reservationSlotLimit) {
          this.$bvModal.show('complete-modal');
          for (let i = 0; i < this.currentlySelected.length; i++) {
            axios.post(`${this.host}/schedule/appointment`, this.currentlySelected[i], { headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
            }).catch((err) => { console.log(err) });
            this.removeSlotClass('on-select');
            this.applySlotClass(this.currentlySelected[i].from, this.reservationLength, 'booked-by-self')
            this.applySlotClass(this.currentlySelected[i].from, this.reservationLength, 'reserved')
          }
        }
      },
      onChangeWeek() { // used when user changes week
        this.currentDay = this.$refs.kalendar._data.current_day;
        this.getWeekData(this.currentDay);
          setTimeout(() => { // set time out to give enough time for page refresh
            for (let i = 0; i < this.currentlySelected.length; i++) {
              let selectedSlot = document.getElementById(this.currentlySelected[i].from);
              if (selectedSlot) {
                this.applySlotClass(this.currentlySelected[i].from, this.reservationLength, 'on-select')
              }
            }
          }, 200);
        },
      getWeekData(startDay) { // get 2 week information (used during page refresh)
        const lastWeeks = moment(startDay).subtract(2, 'week');
        const nextWeeks = moment(startDay).add(2, 'week');
        axios.get(`${this.host}/schedule/${this.createdBy}/availableTime/${lastWeeks.toISOString()}/${nextWeeks.toISOString()}`).then((resAvailableTimes) => {
          if (resAvailableTimes.status == 200) {
            axios.get(`${this.host}/schedule/${this.createdBy}/appointment/${lastWeeks.toISOString()}/${nextWeeks.toISOString()}`).then((resAppointments) => {
              if (resAppointments.status == 200) {
                const combinedTimeSlots = resAvailableTimes.data.concat(resAppointments.data);
                for (let i = 0; i < combinedTimeSlots.length; i++) {
                  const reservedBy = combinedTimeSlots[i].reservedBy ? combinedTimeSlots[i].reservedBy : '';
                  this.intervals(combinedTimeSlots[i].from, combinedTimeSlots[i].to, reservedBy);
                }
                this.$refs.kalendar.kalendar_events = this.events;
              }
            });
          }
        });
      },
      removeSlotClass(className) {
          const classElements = document.getElementsByClassName(className);
          while(classElements.length > 0){
              classElements[0].classList.remove(className);
          }
      },
      removeSlotClassSpecific(startTime, reservationLength, classToRemove) {
        let firstColorSlot = document.getElementById(startTime);
        let secondColorSlot = document.getElementById(moment(startTime).add(30, 'minutes').toISOString());
        let thirdTimeSlot = moment(startTime).add(1, 'hour').toISOString();
        let thirdColorSlot = document.getElementById(thirdTimeSlot);
        let isInvalidSelection = false;
        this.removeSlotClass('on-hover') // remove any applied hover classes

        if (reservationLength == 30) { // color only 1 slot
            firstColorSlot.parentNode.classList.remove(classToRemove);
        } else if (reservationLength == 60 && secondColorSlot) { // color only 2 slots
            firstColorSlot.parentNode.classList.remove(classToRemove);
            secondColorSlot.parentNode.classList.remove(classToRemove);
        } else if (reservationLength == 90 && secondColorSlot && thirdColorSlot) { // color only 3 slots
            firstColorSlot.parentNode.classList.remove(classToRemove);
            secondColorSlot.parentNode.classList.remove(classToRemove);
            thirdColorSlot.parentNode.classList.remove(classToRemove);
        }
      },
      applySlotClass(startTime, reservationLength, classToApply) { // hover + rendering selected classes (if user changes weeks). no click logic
        for (let i = 0; i <= (this.reservationLength / 30) - 1; i++) {
          const timeSlot = moment(startTime).add(i * 30, 'minutes').toISOString();
          const slotToColor = document.getElementById(timeSlot);
          if (slotToColor) slotToColor.parentNode.classList.add(classToApply);
        } 
      },
      appointmentFactory(createdBy, reservedBy, packageId, from, to) { // creates appointment object to send to server
        const appointment = {
          createdBy,
          reservedBy,
          from,
          to,
        }

        if (packageId) {
          appointment.packageId = packageId
        }

        return appointment;
      },
      removeSelection(startTime) { // remove selected item from currentlySelected array
        this.currentlySelected = this.currentlySelected.filter((selected) => {
          return selected.from != startTime;
        })
      },
      colorSlot(startTime) { // on click logic + coloring
        const endTime = moment(startTime).add(this.reservationLength, 'minutes').toISOString();
        let isApplyingSelect = false;
        let isRemovingSelect = false;
        let isClickOnTopSlot = this.currentlySelected.filter((selected) => {return selected.from == startTime }).length == 1;
        let isValidMove = true;

        for (let i = 0; i <= (this.reservationLength / 30) - 1; i++) { 
          const timeSlot = moment(startTime).add(i * 30, 'minutes').toISOString();
          const slotToColor = document.getElementById(timeSlot);
          const adjacentSlot = document.getElementById(moment(startTime).add(this.reservationLength - 30, 'minutes').toISOString());

          if (slotToColor && adjacentSlot) {
            const slotToColorParent = slotToColor.parentNode.classList;
            const isSelected = slotToColor.classList.value.split(' ').includes('on-select');
            const isAdjSelected = adjacentSlot.classList.value.split(' ').includes('on-select');
            const isSlotReserved = slotToColor.classList.value.split(' ').includes('reserved') 
            || slotToColorParent.value.split(' ').includes('reserved');
            const isPast = slotToColor.parentNode.parentNode.classList.value.split(' ').includes('is-past');

            if (!isSelected && this.slotsLeft - 1 >= 0  && !isPast && !isSlotReserved && isValidMove && !isAdjSelected) {
              this.removeSelection(startTime) // avoid adding duplicates
              this.currentlySelected.push(this.appointmentFactory(this.createdBy, this.reservedBy, '', startTime, endTime)); // TODO: replace '' with package id
              slotToColor.classList.add("on-select"); 
              isApplyingSelect = true;
            } else if (isSelected && this.slotsLeft <= this.reservationSlotLimit - 1 && isClickOnTopSlot) {
              slotToColor.classList.remove("on-select");
              this.removeSelection(startTime)
              isRemovingSelect = true;
            } 
            else { // prevent user from selecting edge slots/reserved slots
              if (isSlotReserved) {
                this.$bvModal.show('cancel-modal');
                this.cancelStartTime = startTime;
              }
              isValidMove = false;
            }
          }
        } 
 
        if (isApplyingSelect) {
          this.slotsLeft -= 1;
        } else if (isRemovingSelect) { // on unselect
          this.slotsLeft += 1;
        }
        
        // const firstColorSlot = document.getElementById(startTime);
        // const secondColorSlot = document.getElementById(moment(startTime).add(30, 'minutes').toISOString());
        // const thirdTimeSlot = moment(startTime).add(1, 'hour').toISOString();
        // const thirdColorSlot = document.getElementById(thirdTimeSlot);
        // const firstColorSlotParentClasses = firstColorSlot.parentNode.classList;
        // const isFirstColorSlotSelected = firstColorSlotParentClasses.value.split(' ').includes('on-select')
        // let isInvalidSelection = false;
        // const isPast = firstColorSlot.parentNode.parentNode.classList.value.split(' ').includes('is-past');
        // const isFirstColorSlotReserved = firstColorSlot.classList.value.split(' ').includes('reserved') || firstColorSlot.parentNode.classList.value.split(' ').includes('reserved')
        // let isSecondColorSlotSelected;
        // let secondColorSlotParentClasses;
        // const selectedElements = document.getElementsByClassName("on-select");
        // let isSecondColorSlotReserved;

        // if ((reservationLength == 60 || reservationLength == 90) && secondColorSlot) {
        //     isSecondColorSlotSelected = secondColorSlot.parentNode.classList.value.split(' ').includes('on-select');
        //     secondColorSlotParentClasses = secondColorSlot.parentNode.classList;
        //     isSecondColorSlotReserved = secondColorSlot.classList.value.split(' ').includes('reserved') || secondColorSlot.parentNode.classList.value.split(' ').includes('reserved');
        // }

        // if (reservationLength == 30) { // reserve only 1 slot
        //     if (!isFirstColorSlotSelected && this.slotsLeft - 1 >= 0  && !isPast && !isFirstColorSlotReserved) {
        //       firstColorSlotParentClasses.add("on-select"); // TODO: replace '' with package id
        //       this.currentlySelected.push(this.appointmentFactory(this.createdBy, this.reservedBy, '', startTime, endTime));
        //       this.slotsLeft -= 1;
        //     } else if (isFirstColorSlotSelected && this.slotsLeft <= this.reservationSlotLimit - 1) {
        //       firstColorSlotParentClasses.remove("on-select");
        //       this.slotsLeft += 1;
        //     }
        // } else if (reservationLength == 60 && secondColorSlot) { // reserve only 2 slots
        //     for (let i = 0; i < selectedElements.length; i++) { // check if selected box is an "invalid" action (eg. undoing select on middle slots that weren't selected originally)
        //       if (selectedElements[i] == firstColorSlot.parentNode && i % 2 != 0) {
        //         isInvalidSelection = true;
        //       }
        //     }
        //       if (!isFirstColorSlotSelected && !isSecondColorSlotSelected && this.slotsLeft - 1 >= 0 && !isPast && !isFirstColorSlotReserved && !isSecondColorSlotReserved) { // if not selected, apply selection class
        //       firstColorSlotParentClasses.add("on-select");
        //       secondColorSlotParentClasses.add("on-select");
        //       this.currentlySelected.push(this.appointmentFactory(this.createdBy, this.reservedBy, '', startTime, thirdTimeSlot));
        //       this.slotsLeft -= 1;
        //     } else if (isFirstColorSlotSelected && isSecondColorSlotSelected && !isInvalidSelection) { // otherwise, check if valid move before removing class
        //       firstColorSlotParentClasses.remove("on-select");
        //       secondColorSlotParentClasses.remove("on-select");
        //       this.removeSelection(startTime);
        //       this.slotsLeft += 1;
        //     }
        //     else if (isFirstColorSlotReserved && isSecondColorSlotReserved) {
        //       this.$bvModal.show('cancel-modal');
        //       this.cancelStartTime = startTime;
        //     }
        // } else if (reservationLength == 90 && secondColorSlot && thirdColorSlot) { // reserve only 3 slots
        //       const isThirdColorSlotSelected = thirdColorSlot.parentNode.classList.value.split(' ').includes('on-select')
        //       const isThirdColorSlotReserved = thirdColorSlot.classList.value.split(' ').includes('reserved') || thirdColorSlot.parentNode.classList.value.split(' ').includes('reserved');
        //       const thirdColorSlotParentClasses = thirdColorSlot.parentNode.classList;

        //       for (let i = 0; i < selectedElements.length; i++) { // check if selected box is an "invalid" action (eg. undoing select on middle slots that weren't selected originally)
        //       if (selectedElements[i] == firstColorSlot.parentNode && i % 3 != 0) {
        //         isInvalidSelection = true;
        //       }
        //     }

        //       if (!isFirstColorSlotSelected && !isSecondColorSlotSelected && !isThirdColorSlotSelected && this.slotsLeft - 1 >= 0  && !isPast && !isFirstColorSlotReserved && !isSecondColorSlotReserved && !isThirdColorSlotReserved) { // if not selected, apply selection class
        //         firstColorSlotParentClasses.add("on-select");
        //         secondColorSlotParentClasses.add("on-select");
        //         thirdColorSlotParentClasses.add("on-select");
        //         this.currentlySelected.push(this.appointmentFactory(this.createdBy, this.reservedBy, '', startTime, thirdTimeSlot));
        //         this.slotsLeft -= 1;
        //     } else if (isFirstColorSlotSelected && isSecondColorSlotSelected && isThirdColorSlotSelected && !isInvalidSelection) { // otherwise, check if valid move before removing class
        //         firstColorSlotParentClasses.remove("on-select");
        //         secondColorSlotParentClasses.remove("on-select");
        //         thirdColorSlotParentClasses.remove("on-select");
        //         this.removeSelection(startTime);
        //         this.slotsLeft += 1;
        //     }
        // }
      },
      intervals(startString, endString, reservedBy) { // split up any time into 30m intervals
        const start = moment(startString);
        const end = moment(endString);
        start.minutes(Math.ceil(start.minutes() / 30) * 30);

        let intervalArr = [];

        const current = moment(start);

        while (current <= end) {
            intervalArr.push(current.toISOString());
            current.add(30, 'minutes');
        }

        for (let i = 0; i < intervalArr.length; i++) {
            if (i != intervalArr.length - 1) {
              const formatedDate = {
                from: intervalArr[i],
                to: intervalArr[i+1],
                data: { // make a data object to be used later
                  from: intervalArr[i],
                  to: intervalArr[i+1],
                  reservedBy,
                }
              }
              this.events.push(formatedDate);
              this.events = [...new Map(this.events.map(event => [event['from'], event])).values()] // filter out duplicates if available times and lessons overlap
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
.booked-by-other {
  background-color: gray !important;
  pointer-events: none;
}

.booked-by-self {
  background-color: #6cf039 !important;
}

.modal-open {
  padding-right: 0px !important;
  overflow-y: scroll !important;
}

.enabled-button {
  background-color: #ff554b !important;
}

.slots-left {
  margin-top: 2%;
}

.kalendar-cell .on-hover {
  filter: brightness(85%);
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

.app-button {
  width: 150px;
  margin: 0 20px;
  display: inline-block;
  line-height: 30px;
}
.row {
  text-align: center;
  margin-left: -20px;
  margin-right: -20px;
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

.kalendar-wrapper.gstyle .created-event,
.kalendar-wrapper.gstyle .creating-event {
  border-radius: 0px !important;
}

.kalendar-wrapper.gstyle .created-event, .kalendar-wrapper.gstyle .creating-event {
  border-bottom: none !important;
}

.add-manual {
  border: none;
  background-color: #6c757d;
  color: #fff;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  padding: 0;
  width: 60px;
  height: 60px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  border-radius: 50%;
  z-index: 100;
}
</style>
