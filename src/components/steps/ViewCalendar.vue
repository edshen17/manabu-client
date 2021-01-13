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
        cancel or reschedule appointments up to 24 hours before they
        begin.
      </p>
      <template v-slot:modal-ok> OK </template>
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
        There was an error processing your request. Please make sure you did not
        click on reserved timeslots between two appointments.
      </p>
      <template #modal-footer>
        <b-button @click="$bvModal.hide('cancel-modal')" v-show="!deleteErr">
          <div>Cancel</div>
        </b-button>
        <b-button
          @click="deleteErr = false; $bvModal.hide('cancel-modal')"
          variant="primary"
          v-show="deleteErr"
        >
          <div>OK</div>
        </b-button>
        <b-button
          @click="cancelAppointment(cancelStartTime)"
          variant="primary"
          v-show="!deleteErr"
        >
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
        :class="{ 'enabled-button': slotsLeft < reservationSlotLimit }"
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
          :class="{'booked-by-self': event_information.data.reservedBy == reservedBy && event_information.data.status == 'confirmed', 
          'booked-by-other': event_information.data.reservedBy != reservedBy && event_information.data.reservedBy != '',
          'pending': event_information.data.status == 'pending' }"
          @click="colorSlot(event_information.data.from)"
          @mouseover="applySlotClass(event_information.data.from, 'on-hover')"
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
      hostedBy: String,
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
      this.getWeekData(this.currentDay); // current date
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
              currentDay: new Date().toISOString(),
              currentDayLoaded: false,
              cancelStartTime: '',
              deleteErr: false,
              appointments: [],
        }
    },
    methods: {
      cancelAppointment(startTime) {
        if (this.deleteErr) this.deleteErr = false; //reset deleteErr
        const deleteObj = {
            hostedBy: this.hostedBy,
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
           this.removeSlotClassSpecific(startTime, 'booked-by-self')
           this.removeSlotClassSpecific(startTime, 'pending')
           this.slotsLeft += 1;

           this.appointments = this.appointments.filter(appointment => appointment.from != startTime)
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
            }}).then((res)=> {
              this.appointments.push(res.data);
            }).catch((err) => { console.log(err) });
              this.removeSlotClass('on-select');
              this.applySlotClass(this.currentlySelected[i].from, 'pending');
          }
          this.currentlySelected = [];
        }
      },
      onChangeWeek() { // used when user changes week
        this.currentDay = this.$refs.kalendar._data.current_day;
        this.getWeekData(this.currentDay);
          setTimeout(() => { // set time out to give enough time for page refresh
            for (let i = 0; i < this.currentlySelected.length; i++) {
              let selectedSlot = document.getElementById(this.currentlySelected[i].from);
              if (selectedSlot) {
                this.applySlotClass(this.currentlySelected[i].from, 'on-select')
              }
            }

            for (let i = 0; i < this.appointments.length; i++) {
              let reservedSlot = document.getElementById(this.appointments[i].from);
              if (reservedSlot) {
                this.applySlotClass(this.appointments[i].from, 'pending')
              }
            }
          }, 200);
        },
      getWeekData(startDay) { // get 2 week information (used during page refresh)
        const lastWeeks = moment(startDay).subtract(2, 'week');
        const nextWeeks = moment(startDay).add(2, 'week');
        axios.get(`${this.host}/schedule/${this.hostedBy}/availableTime/${lastWeeks.toISOString()}/${nextWeeks.toISOString()}`).then((resAvailableTimes) => {
          if (resAvailableTimes.status == 200) {
            axios.get(`${this.host}/schedule/${this.hostedBy}/appointment/${lastWeeks.toISOString()}/${nextWeeks.toISOString()}`).then((resAppointments) => {
              if (resAppointments.status == 200) {
                const combinedTimeSlots = resAvailableTimes.data.concat(resAppointments.data);
                for (let i = 0; i < combinedTimeSlots.length; i++) {
                  const reservedBy = combinedTimeSlots[i].reservedBy ? combinedTimeSlots[i].reservedBy : '';
                  const status = combinedTimeSlots[i].status ? combinedTimeSlots[i].status : '';
                  this.intervals(combinedTimeSlots[i].from, combinedTimeSlots[i].to, reservedBy, status);
                }
                this.appointments = resAppointments.data;
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
      removeSlotClass(className) { // remove class from all elements with that class
          const classElements = document.getElementsByClassName(className);
          while(classElements.length > 0) {
              classElements[0].classList.remove(className);
          }
      },
      removeSlotClassSpecific(startTime, classToRemove) { // remove class from specific slots
        for (let i = 0; i <= (this.reservationLength / 30) - 1; i++) {
          const timeSlot = moment(startTime).add(i * 30, 'minutes').toISOString();
          const slotToColor = document.getElementById(timeSlot);
          if (slotToColor) {
            slotToColor.parentNode.classList.remove(classToRemove);
            slotToColor.classList.remove(classToRemove);
          }
        }
      },
      applySlotClass(startTime, classToApply) { // hover + rendering selected classes (if user changes weeks). no click logic
        for (let i = 0; i <= (this.reservationLength / 30) - 1; i++) {
          const timeSlot = moment(startTime).add(i * 30, 'minutes').toISOString();
          const slotToColor = document.getElementById(timeSlot);
          if (slotToColor) {
            slotToColor.parentNode.classList.add(classToApply);
            slotToColor.classList.add(classToApply);
          }
        }
      },
      appointmentFactory(hostedBy, reservedBy, packageId, from, to) { // creates appointment object to send to server
        const appointment = {
          hostedBy,
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
        let isValidMove = true;
        const isClickOnTopSlot = this.currentlySelected.filter((selected) => {return selected.from == startTime }).length == 1;
        const isClickTopReserved = this.appointments.filter((appointment) => {return appointment.from == startTime }).length == 1;

        for (let i = 0; i <= (this.reservationLength / 30) - 1; i++) {
          const timeSlot = moment(startTime).add(i * 30, 'minutes').toISOString();
          const slotToColor = document.getElementById(timeSlot);
          const adjacentSlot = document.getElementById(moment(startTime).add(this.reservationLength - 30, 'minutes').toISOString());
          if (slotToColor && adjacentSlot) {
            const slotToColorParent = slotToColor.parentNode.classList;
            const adjacentSlotParent = adjacentSlot.parentNode.classList;
            const isSelected = slotToColor.classList.value.split(' ').includes('on-select') || slotToColorParent.value.split(' ').includes('on-select');
            const isAdjSelected = adjacentSlot.classList.value.split(' ').includes('on-select');
            const isSlotReserved = slotToColor.classList.value.split(' ').includes('booked-by-self')
            || slotToColorParent.value.split(' ').includes('booked-by-self')
            || slotToColor.classList.value.split(' ').includes('pending')
            || slotToColorParent.value.split(' ').includes('pending')
            || slotToColor.classList.value.split(' ').includes('booked-by-other')
            || slotToColorParent.value.split(' ').includes('booked-by-other')
            const isAdjReserved = adjacentSlot.classList.value.split(' ').includes('booked-by-self')
            || adjacentSlotParent.value.split(' ').includes('booked-by-self')
            || adjacentSlot.classList.value.split(' ').includes('pending')
            || adjacentSlotParent.value.split(' ').includes('pending')
            || adjacentSlot.classList.value.split(' ').includes('booked-by-other')
            || adjacentSlotParent.value.split(' ').includes('booked-by-other')            
            const isPast = slotToColor.parentNode.parentNode.classList.value.split(' ').includes('is-past');
            if (!isSelected && this.slotsLeft - 1 >= 0  && !isPast && !isSlotReserved && isValidMove && !isAdjSelected && !isAdjReserved) {
              this.removeSelection(startTime) // avoid adding duplicates
              this.currentlySelected.push(this.appointmentFactory(this.hostedBy, this.reservedBy, '', startTime, endTime)); // TODO: replace '' with package id
              slotToColor.classList.add("on-select");
              slotToColor.parentNode.classList.add("on-select");
              isApplyingSelect = true;
            } else if (isSelected && this.slotsLeft <= this.reservationSlotLimit - 1 && isClickOnTopSlot) {
              slotToColor.classList.remove("on-select");
              slotToColor.parentNode.classList.remove("on-select");
              this.removeSelection(startTime)
              isRemovingSelect = true;
            }
            else { // prevent user from selecting edge slots/reserved slots
              if (isSlotReserved && isClickTopReserved) {
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
      },
      intervals(startString, endString, reservedBy, status) { // split up any time into 30m intervals
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
                  status,
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

</style>