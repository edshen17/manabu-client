<template>
  <div class="ViewCalendar">
    <b-modal id="complete-modal" title="Success!" :no-close-on-backdrop="true">
      <p class="my-4" v-show="!reserveErr">
        Your reservation has been made and is pending confirmation. You can
        cancel or reschedule appointments up to 24 hours before they begin.
      </p>
      <p class="my-4" v-show="reserveErr">
        There was an error processing your request.
      </p>
      <template #modal-footer>
        <b-button
          @click="reserveErr = false; $bvModal.hide('complete-modal')"
          variant="primary"
        >
          OK
        </b-button>
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
        There was an error processing your request. Please make sure you did not
        click on reserved timeslots between two appointments.
      </p>
      <template #modal-footer>
        <b-button @click="$bvModal.hide('cancel-modal')" v-show="!deleteErr">
          <div>Hide</div>
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
        :class="{ 'enabled-button': slotsLeft < reservationSlotLimit && currentlySelected.length > 0 }"
        :disabled="slotsLeft == reservationSlotLimit && currentlySelected.length == 0"
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
          'booked-by-other': event_information.data.reservedBy != reservedBy && event_information.data.reservedBy != '' 
          || event_information.data.cancellationReason == 'schedule change',
          'pending': (event_information.data.status == 'pending' && event_information.data.reservedBy == reservedBy) 
                     || onEventClassBind(event_information.data.from, sessionPendingLessons),
          'cancelled': event_information.data.status == 'cancelled' 
            && (event_information.data.cancellationReason == 'student issue' || event_information.data.cancellationReason == 'student cancel') 
            && event_information.data.reservedBy == reservedBy,
          'on-hover': false,
          'on-select': onEventClassBind(event_information.data.from, currentlySelected)  }"
          @click="onClick(event_information.data)"
          @mouseover="onHover(event_information.data.from)"
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
              currentlyHovered: [],
              events: [],
              slotsLeft: this.reservationSlotLimit,
              currentDay: new Date().toISOString(),
              currentDayLoaded: false,
              cancelStartTime: '',
              deleteErr: false,
              reserveErr: false,
              appointments: [],
              sessionPendingLessons: [],
        }
    },
    methods: {
      onClick(eventData) { // on click, add items to currentlySelected
        const startTime = eventData.from;
        const endTime = moment(startTime).add(this.reservationLength, 'minutes').toISOString();
        const isPast = new Date() > new Date(startTime);
        let duplicate = this.currentlySelected.findIndex(selected => selected.from == startTime);
              if (duplicate != -1) { // unselecting
                this.slotsLeft += 1;
                this.currentlySelected = this.currentlySelected.filter((selected, i) => i !== duplicate);
                return;
              }

        if (!isPast) {
          let status; // used to keep track of first slot status
          let isValidMove = true;
          let isClickOnTopSlotReserved = this.appointments.filter((appointment) => { return appointment.from == startTime }).length != 0;
          let isClickTopSlotSelected = this.currentlySelected.filter((selected) => { return selected.from == startTime }).length != 0;
          for (let i = 0; i <= (this.reservationLength / 30) - 1; i++) {
            const currentTimeSlot = moment(startTime).add(i * 30, 'minutes').toISOString();
            const currentTimeSlotObj = this.events.find(event => event.data.from == currentTimeSlot);
            let validMoveCheck;
            if (currentTimeSlotObj) {
              if (i == 0) {
                status = currentTimeSlotObj.data.status;
              }
              const sessionPending = this.sessionPendingLessons.find(event => event.from == startTime);              
              const isReservedBySelf = (currentTimeSlotObj.data.status == 'pending' && currentTimeSlotObj.data.reservedBy == this.reservedBy)
                            || (currentTimeSlotObj.data.status == 'confirmed' && currentTimeSlotObj.data.reservedBy == this.reservedBy)
                            || sessionPending;
              const unreservedSlot = currentTimeSlotObj.data.status == '';
              const reserverableCancel = (currentTimeSlotObj.data.cancellationReason == 'student issue' || currentTimeSlotObj.data.cancellationReason == 'student cancel') &&
                                currentTimeSlotObj.data.reservedBy != this.reservedBy;
                                
              validMoveCheck = unreservedSlot
                            || isReservedBySelf
                            || reserverableCancel

              if ((currentTimeSlotObj.data.status == 'pending' && currentTimeSlotObj.data.reservedBy == this.reservedBy)
                            || (currentTimeSlotObj.data.status == 'confirmed' && currentTimeSlotObj.data.reservedBy == this.reservedBy)) {

                validMoveCheck = validMoveCheck && (isClickOnTopSlotReserved || isClickTopSlotSelected)
              }

            if ((!currentTimeSlotObj || !validMoveCheck)) { // bad move
              console.log('bad')
              isValidMove = false;
            }
            else if (isValidMove && i == (this.reservationLength / 30) - 1 && status == currentTimeSlotObj.data.status ) { // good move
              if (isReservedBySelf) {
                this.$bvModal.show('cancel-modal');
                this.cancelStartTime = startTime;
              } else if (unreservedSlot || reserverableCancel) { // add to currentlySelected
              const currSelectedArrCopy = [... this.currentlySelected];
              if (this.currentlySelected.length == 0) { // if no selected items, create selection
                  this.slotsLeft -= 1;
                  this.currentlySelected.push(this.appointmentFactory(this.hostedBy, this.reservedBy, '', startTime, endTime)); // TODO: replace '' with package id
              } else {
                let isInBetween = false;
                for (let i = 0; i < currSelectedArrCopy.length; i++) {
                  isInBetween = isInBetween
                  || moment(startTime).isBetween(moment(this.currentlySelected[i].from), moment(this.currentlySelected[i].to))
                  || moment(endTime).isBetween(moment(this.currentlySelected[i].from), moment(this.currentlySelected[i].to))
                  if (!isInBetween && i == this.currentlySelected.length - 1) {
                    this.currentlySelected.push(this.appointmentFactory(this.hostedBy, this.reservedBy, '', startTime, endTime)); // TODO: replace '' with package id
                    this.slotsLeft -= 1;
                  }
                }
              }
              }
            }
          }
        }
        }
      },
      onEventClassBind(startTime, eventArr) { // bind classes based on arrays like currentlySelected/sessionPendingLessons to color slots
        let isEventOccuring = false;
        for (let i = 0; i <= (this.reservationLength / 30) - 1; i++) {
          let timeSlot;
          if (i == 0) {
            timeSlot = moment(startTime).toISOString();
          } else {
            timeSlot = moment(startTime).subtract(i * 30, 'minutes').toISOString(); // previous timeslot
          }
          isEventOccuring = isEventOccuring
          || (eventArr.filter(eventStartTime => eventStartTime.from == startTime || eventStartTime.from == timeSlot).length != 0);
        }
          return isEventOccuring;          
      },
      onHoverClassBind(startTime) { // used in class binding when on hover
      let isHovering = false;
      for (let i = 0; i <= (this.reservationLength / 30) - 1; i++) {
        let prevTimeSlot = moment(startTime).subtract(i * 30, 'minutes').toISOString();
        isHovering = isHovering
        || (this.currentlyHovered.filter(hoveredStartTime => hoveredStartTime == startTime || hoveredStartTime == prevTimeSlot).length != 0);
      }
        return isHovering;
      },
      onHover(startTime) { // on hover
        const isPast = new Date() > new Date(startTime);
        if (!isPast) {
          this.currentlyHovered = [] // reset hovering
          this.currentlyHovered.push(startTime);
        }
      },
      cancelAppointment(startTime) {
        if (this.deleteErr) this.deleteErr = false; //reset deleteErr
        const selectedLessonId = this.appointments.find(appointment => appointment.from == startTime)._id;
        axios.put(`${this.host}/schedule/appointment/${selectedLessonId}`, { status: 'cancelled', cancellationReason: 'student cancel' }, { headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }}
        ).then((res) => {
          if (res.status == 200) {
            this.$bvModal.hide('cancel-modal');
            this.removeSlotClassSpecific(startTime, 'booked-by-self')
            this.removeSlotClassSpecific(startTime, 'pending')

            this.slotsLeft += 1;
            this.appointments = this.appointments.filter(appointment => appointment.from != startTime);
            this.sessionPendingLessons = this.sessionPendingLessons.filter(event => event.from != startTime);
          }
        }).catch((err) => {
          console.log(err)
          this.deleteErr = true;
        });
      },
      createAppointments() {
        if (this.slotsLeft != this.reservationSlotLimit) {
          for (let i = 0; i < this.currentlySelected.length; i++) {
            const currentlySelectedFrom = this.currentlySelected[i].from
            axios.post(`${this.host}/schedule/appointment`, this.currentlySelected[i], { headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }}).then(res => {
              this.$bvModal.show('complete-modal');
              this.appointments.push(res.data);
              this.applySlotClass(currentlySelectedFrom, 'pending');
              this.removeSlotClass('on-select');
            }).catch((err) => { 
              console.log(err)
              this.reserveErr = true; });

          }
          this.sessionPendingLessons.push(... this.currentlySelected);
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
                  this.intervals(combinedTimeSlots[i]);
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
        const isPast = new Date() > new Date(startTime);
        if (!isPast) {
        for (let i = 0; i <= (this.reservationLength / 30) - 1; i++) {
                  const timeSlot = moment(startTime).add(i * 30, 'minutes').toISOString();
                  const slotToColor = document.getElementById(timeSlot);
                  if (slotToColor) {
                    slotToColor.parentNode.classList.add(classToApply);
                    slotToColor.classList.add(classToApply);
                  }
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
      intervals(slot) { // split up any time into 30m intervals
        const start = moment(slot.from);
        const end = moment(slot.to);
        const reservedBy = slot.reservedBy ? slot.reservedBy : '';
        const status = slot.status ? slot.status : '';
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
                  cancellationReason: slot.cancellationReason || ''
                }
              }
              const duplicate = this.events.find(event => {event.from == formatedDate.from;});
              if (!duplicate) {
                this.events.push(formatedDate);
                this.events = [...new Map(this.events.map(event => [event['from'], event])).values()] // filter out duplicates if available times and lessons overlap
              }
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

<style lang="css"></style>
