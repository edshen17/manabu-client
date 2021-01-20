<template>
  <div class="ViewCalendar">
    <b-modal id="complete-modal" title="Success!" :no-close-on-backdrop="true">
      <p class="my-4" v-show="!reserveErr">
        Your reservation has been made and is pending confirmation. You can
        reschedule appointments up to 24 hours before they begin and can cancel
        them anytime before they start.
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

    <b-modal id="update-modal" :no-close-on-backdrop="true">
      <template #modal-title>
        {{ modalTitleText }}
      </template>
      <div class="profile-popup" v-if="selectedHostedBy">
        <img
          v-if="selectedHostedBy.profileImage == ''"
          class="rounded-circle center-image"
          alt="100x100"
          src="../../../src/assets/images/no-profile.webp"
        />
        <img
          v-else
          class="rounded-circle center-image"
          alt="100x100"
          :src="selectedHostedBy.profileImage"
        />
        <h5 class="text-center mb-2 mt-2">{{selectedHostedBy.name}}</h5>
        <div class="text-center">
          <div
            v-for="lang in selectedHostedBy.fluentLanguages.concat(selectedHostedBy.nonFluentLanguages)"
            :key="lang"
            class="mx-1"
            style="display: inline"
          >
            {{lang}}
            <span
              v-for="(n, i) in 5"
              :key="i"
              class="level"
              :class="languageLevelBars(lang, i)"
            ></span>
          </div>
          <p>
            Region: {{selectedHostedBy.region}} ({{ selectedHostedBy.timezone


            }})
          </p>
        </div>
        <p class="my-4" v-show="!updateErr">lesson information goes here</p>
      </div>
      <p class="my-4" v-show="updateErr">
        There was an error processing your request. Please try again.
      </p>
      <template #modal-footer>
        <b-button @click="resetOnCancel" v-show="!updateErr">
          <span v-show="!isCancelling"> Hide </span>
          <span v-show="isCancelling"> No </span>
        </b-button>
        <b-button
          variant="danger"
          v-show="!updateErr && !isCancelling"
          @click="isCancelling = true; cancelAppointment(cancelStartTime)"
        >
          Cancel
        </b-button>
        <b-button
          @click="isCancellingConfirmation = true; cancelAppointment(cancelStartTime)"
          variant="danger"
          v-show="!updateErr && isCancelling"
        >
          Yes
        </b-button>
        <b-button
          @click="updateErr = false; $bvModal.hide('update-modal')"
          variant="primary"
          v-show="updateErr"
        >
          OK
        </b-button>
        <b-button
          @click="prepareReschedule"
          variant="primary"
          v-show="!updateErr && !isCancelling"
        >
          Reschedule
        </b-button>
      </template>
    </b-modal>

    <b-modal
      id="reschedule-modal"
      title="Reschedule confirmation"
      :no-close-on-backdrop="true"
    >
      <p class="my-4" v-show="!rescheduleErr">
        Are you sure you want to reschedule to this timeslot? insert time here
      </p>
      <p class="my-4" v-show="rescheduleErr">
        There was an error processing your request.
      </p>
      <template #modal-footer>
        <b-button
          @click="$bvModal.hide('reschedule-modal')"
          v-show="!rescheduleErr"
        >
          <div>No</div>
        </b-button>
        <b-button
          @click="rescheduleErr = false; $bvModal.hide('reschedule-modal')"
          variant="primary"
          v-show="rescheduleErr"
        >
          <div>OK</div>
        </b-button>
        <b-button
          @click="rescheduleAppointment"
          variant="primary"
          v-show="!rescheduleErr"
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
          :class="{'booked-by-self': event_information.data.reservedBy == reservedBy && event_information.data.status == 'confirmed'
          && !onEventClassBind(event_information.data.from, sessionCancelledLessons),
          'booked-by-other': event_information.data.reservedBy != reservedBy && event_information.data.reservedBy != ''
                              && (event_information.data.cancellationReason != 'student issue' 
                              && event_information.data.cancellationReason != 'student cancel'),
          'pending': (event_information.data.status == 'pending' && event_information.data.reservedBy == reservedBy && !onEventClassBind(event_information.data.from, prevRescheduledLessons)) 
                     || (onEventClassBind(event_information.data.from, sessionPendingLessons)
                     && (!onEventClassBind(event_information.data.from, sessionCancelledLessons)))
                     || onEventClassBind(event_information.data.from, sessionRescheduledLessons),
          'cancelled': ((event_information.data.status == 'cancelled' 
            && event_information.data.reservedBy == reservedBy)) 
            || onEventClassBind(event_information.data.from, sessionCancelledLessons),
          'on-select': onEventClassBind(event_information.data.from, currentlySelected),
          
          }"
          @click="onClick(event_information.data)"
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
import languageLevelBars from '../../assets/scripts/languageLevelBars'


export default {
    name: 'ViewCalendar',
    components: {
        Kalendar
    },
    props: {
      reservedBy: String,
      hostedBy: String,
      rescheduleSlotLimit: Number,
      reservationLength: Number,
      reservationSlotLimit: Number,
    },
    mounted() {
      this.getScheduleData(this.currentDay); // current date
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
              rescheduleErr: false,
              reserveErr: false,
              updateErr: false,
              appointments: [],
              sessionPendingLessons: [],
              sessionCancelledLessons: [],
              sessionRescheduledLessons: [],
              prevRescheduledLessons: [],
              originalReschedulingLesson: {},
              updatedReschedulingLesson: {},
              isCancelling: false,
              isCancellingConfirmation: false,
              isRescheduling: false,
              modalTitleText: 'Appointment details',
              selectedHostedBy: null,
              selectedEventData: null,
        }
    },
    methods: {
      rescheduleAppointment() { // used in reschedule modal (when user confirms they want to reschedule the new time)
       const selectedLessonId = this.originalReschedulingLesson._id;
       axios.put(`${this.host}/schedule/appointment/${selectedLessonId}`, { status: 'pending',
          from: this.updatedReschedulingLesson.from,
          to: this.updatedReschedulingLesson.to, },
          { headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }}
        ).then((res) => {
          if (res.status == 200) {
            this.$bvModal.hide('reschedule-modal');
            this.prevRescheduledLessons.push(this.originalReschedulingLesson);
            this.sessionRescheduledLessons.push(this.updatedReschedulingLesson);
            const updateIndex = this.appointments.find(appointment => appointment.from == this.originalReschedulingLesson.from)
            this.appointments[updateIndex] = res.data;
            this.sessionPendingLessons = this.sessionPendingLessons.filter(event => event.from != this.originalReschedulingLesson.from);
            this.resetOnCancel();
            for (let i = 0; i <= (this.reservationLength / 30) - 1; i++) {
                  const eventToUpdate = this.events.find(event => event.from != undefined && event.data.from == moment(this.updatedReschedulingLesson.from).add(30 * i, 'minutes').toISOString());
                  if (eventToUpdate) {
                    eventToUpdate.data.reservedBy = res.data.reservedBy;
                    eventToUpdate.data.status = res.data.status;
              }
            }

            for (let i = 0; i <= (this.reservationLength / 30) - 1; i++) {
                  const eventToUpdate = this.events.find(event => event.from != undefined && event.data.from == moment(this.originalReschedulingLesson.from).add(30 * i, 'minutes').toISOString());
                  if (eventToUpdate) {
                    eventToUpdate.data.reservedBy = '';
                    eventToUpdate.data.status = '';
              }
            }
          }
        }).catch((err) => {
        });
      },
      prepareReschedule() { // used in update modal (when user presses reschedule)
        const slotToReschedule = this.appointments.find(appointment => appointment.from == this.selectedEventData.from);
        this.originalReschedulingLesson = JSON.parse(JSON.stringify(slotToReschedule));
        this.isRescheduling = true;
        this.$bvModal.hide('update-modal');
      },
      resetOnCancel() {
        this.isRescheduling = false;
        this.isCancelling = false;
        this.isCancellingConfirmation = false;
        this.modalTitleText = 'Appointment details'
        this.$bvModal.hide('update-modal');
      },
      languageLevelBars,
      onClick(eventData) { // on click, add items to currentlySelected
        const startTime = eventData.from;
        const endTime = moment(startTime).add(this.reservationLength, 'minutes').toISOString();
        const isPast = new Date() > new Date(startTime);
        let duplicateIndex = this.currentlySelected.findIndex(selected => selected.from == startTime);
        if (duplicateIndex != -1) { // unselecting
          this.slotsLeft += 1;
          this.currentlySelected = this.currentlySelected.filter((selected, i) => i !== duplicateIndex);
          return;
        }
        if (!isPast) {
          let status; // used to keep track of first slot status
          let isValidMove = true;
          let isClickOnTopSlotReserved = this.appointments.filter((appointment) => { return appointment.from == startTime && appointment.reservedBy == this.reservedBy }).length != 0;
          let isClickTopSlotSelected = this.currentlySelected.filter((selected) => { return selected.from == startTime && appointment.reservedBy == this.reservedBy }).length != 0;

          for (let i = 0; i <= (this.reservationLength / 30) - 1; i++) {
            const currentTimeSlot = moment(startTime).add(i * 30, 'minutes').toISOString();
            const currentTimeSlotObj = this.events.find(event => event.from == currentTimeSlot);
            let validMoveCheck;
            if (currentTimeSlotObj) { // get slot information (used to prevent error when clicking last slot)
            console.log(currentTimeSlotObj)
              if (i == 0) {
                status = currentTimeSlotObj.data.status;
              }
              const isSessionCancel = this.onEventClassBind(startTime, this.sessionCancelledLessons);
              const sessionPending = this.onEventClassBind(startTime, this.sessionPendingLessons);
              const isReservedBySelf = (currentTimeSlotObj.data.reservedBy == this.reservedBy
                            && (currentTimeSlotObj.data.status == 'pending' || currentTimeSlotObj.data.status == 'confirmed')
                            || sessionPending);
              const unreservedSlot = currentTimeSlotObj.data.status == '';

              const cancelledBySelf = currentTimeSlotObj.data.status == 'cancelled'
                && currentTimeSlotObj.data.reservedBy == this.reservedBy;

              const cancelledByOtherReservable = currentTimeSlotObj.data.status
                == 'cancelled' && currentTimeSlotObj.data.cancellationReason != 'schedule change'
                && currentTimeSlotObj.data.reservedBy != this.reservedBy;

              const reserverableCancel = !cancelledBySelf && cancelledByOtherReservable;

              validMoveCheck = unreservedSlot
                        || isReservedBySelf
                        || reserverableCancel

              if (isReservedBySelf) {
                this.selectedEventData = eventData;

                if (sessionPending && this.appointments
                    .find(event => event.from == startTime && event.reservedBy == this.reservedBy)
                    && status == currentTimeSlotObj.data.status) { // in session update
                  this.$bvModal.show('update-modal');
                  this.cancelStartTime = startTime;
                }
                validMoveCheck = validMoveCheck && (isClickOnTopSlotReserved || isClickTopSlotSelected)
              }

            if ((!currentTimeSlotObj || !validMoveCheck || isSessionCancel)) { // usually bad move (when not rescheduling)
              isValidMove = false;
              if (this.isRescheduling && isReservedBySelf) { // if rescheduling, make an exception
                isValidMove = true;
              }
            }

            if (isValidMove && ((i == (this.reservationLength / 30) - 1))
                && (status == currentTimeSlotObj.data.status // even if status is not the same, make sure they're reservable eg 1 slot "" and 1 slot student cancelled
                || status == ''
                || currentTimeSlotObj.data.status == ''
                || status == 'student cancel'
                || currentTimeSlotObj.data.status == 'student cancel')) { // good move
              if (isReservedBySelf && isClickOnTopSlotReserved) { // update non-session slots
                this.$bvModal.show('update-modal');
                this.cancelStartTime = startTime;
              } else if (this.isRescheduling) { // on reschedule
                this.$bvModal.show('reschedule-modal');
                this.updatedReschedulingLesson = JSON.parse(JSON.stringify(this.originalReschedulingLesson));
                this.updatedReschedulingLesson.from = startTime;
                this.updatedReschedulingLesson.to = endTime;
              }
              else if ((unreservedSlot || reserverableCancel) && this.slotsLeft != 0 && !this.isRescheduling) { // add to currentlySelected
                  const currSelectedArrCopy = [... this.currentlySelected];
              if (this.currentlySelected.length == 0) { // if no selected items, create selection
                  this.slotsLeft -= 1;
                  this.currentlySelected.push(this.appointmentFactory(this.hostedBy, this.reservedBy, '', '', startTime, endTime)); // TODO: replace '' with package id
              } else { // if not first selected item, check that selected item times do not overlap
                let isInBetween = false;
                for (let i = 0; i < currSelectedArrCopy.length; i++) {
                  isInBetween = isInBetween
                  || moment(startTime).isBetween(moment(this.currentlySelected[i].from), moment(this.currentlySelected[i].to))
                  || moment(endTime).isBetween(moment(this.currentlySelected[i].from), moment(this.currentlySelected[i].to))
                  if (!isInBetween && i == this.currentlySelected.length - 1) {
                    this.currentlySelected.push(this.appointmentFactory(this.hostedBy, this.reservedBy, '', '', startTime, endTime)); // TODO: replace '' with package id
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
      cancelAppointment(startTime) { // not using id because some slots have _ids of avail times
        this.modalTitleText = 'Are you sure you want to reject the appointment?'
        const selectedLessonId = this.appointments.find(appointment => appointment.from == startTime)._id;
        if (this.isCancelling && this.isCancellingConfirmation) {
          axios.put(`${this.host}/schedule/appointment/${selectedLessonId}`, { status: 'cancelled', cancellationReason: 'student cancel' }, { headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }}
        ).then((res) => {
          if (res.status == 200) {
            this.$bvModal.hide('update-modal');
            this.appointments = this.appointments.filter(appointment => appointment.from != startTime);
            this.sessionPendingLessons = this.sessionPendingLessons.filter(event => event.from != startTime);
            this.sessionCancelledLessons.push(res.data);
            this.resetOnCancel();
            for (let i = 0; i <= (this.reservationLength / 30) - 1; i++) {
                  const eventToUpdate = this.events.find(event => event.from != undefined && event.data.from == moment(startTime).add(30 * i, 'minutes').toISOString());
                  if (eventToUpdate) {
                    eventToUpdate.data.cancellationReason = res.data.cancellationReason;
                    eventToUpdate.data.status = res.data.status;
              }
            }
          }
        }).catch((err) => {
        });
        }
      },
      createAppointments() {
        if (this.slotsLeft != this.reservationSlotLimit) {
          for (let i = 0; i < this.currentlySelected.length; i++) {
            const currentlySelectedFrom = this.currentlySelected[i].from;
            const toUpdateIndex = this.events.findIndex(event => event.from != undefined && event.data.from == currentlySelectedFrom);
            const toUpdateTime = this.events.find(event => event.from != undefined && event.data.from == currentlySelectedFrom).data.from;

            axios.post(`${this.host}/schedule/appointment`, this.currentlySelected[i], { headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }}).then(res => {
              if (res.status == 200) {
                this.$bvModal.show('complete-modal');
                this.appointments.push(res.data);
                if (toUpdateTime) {
                  for (let i = 0; i <= (this.reservationLength / 30) - 1; i++) {
                    const eventToUpdate = this.events.find(event => event.from != undefined && event.data.from == moment(toUpdateTime).add(30 * i, 'minutes').toISOString());
                    if (eventToUpdate) {
                      eventToUpdate.data.reservedBy = res.data.reservedBy;
                      eventToUpdate.data.status = res.data.status;
                    }
                  }
                }
              }
            }).catch((err) => {
              console.log(err)
              this.reserveErr = true; });
          }
          this.sessionPendingLessons.push(...this.currentlySelected);
          this.currentlySelected = [];
          const combinedTimeSlots = this.events.concat(this.appointments);
        }
      },
      getScheduleData(startDay) {
        const from = moment().subtract(1, 'month');
        const to = moment().add(6, 'month');;
        axios.get(`${this.host}/schedule/${this.hostedBy}/availableTime/${from.toISOString()}/${to.toISOString()}`).then((resAvailableTimes) => {
          if (resAvailableTimes.status == 200) {
            axios.get(`${this.host}/schedule/${this.hostedBy}/appointment/${from.toISOString()}/${to.toISOString()}`).then(async (resAppointments) => {
              if (resAppointments.status == 200) {
                const combinedTimeSlots = resAvailableTimes.data.concat(resAppointments.data);
                const hostedByData = await this.fetchUserData(this.hostedBy);
                this.selectedHostedBy = hostedByData.data;
                for (let i = 0; i < combinedTimeSlots.length; i++) {
                  this.intervals(combinedTimeSlots[i]);
                }
                this.appointments = resAppointments.data;
                this.isLoaded = true;
              }
            });
          }
        });
      },
      appointmentFactory(hostedBy, reservedBy, aId, packageId, from, to) { // creates appointment object to send to server
        const appointment = {
          hostedBy,
          reservedBy,
          from,
          to,
        }

        if (packageId) {
          appointment.packageId = packageId
        }

        if (aId) {
          appointment._id = aId;
        }

        return appointment;
      },
      removeSelection(startTime) { // remove selected item from currentlySelected array
        this.currentlySelected = this.currentlySelected.filter((selected) => {
          return selected.from != startTime;
        })
      },
      fetchUserData(uId) {
        if (uId) {
          return axios.get(`${this.host}/user/${uId}`).catch((err) => {})
        }
      },
      intervals(slot) { // split up any time into 30m intervals
        const start = moment(slot.from);
        const end = moment(slot.to);
        const reservedBy = slot.reservedBy ? slot.reservedBy : '';
        const hostedBy = slot.hostedBy ? slot.hostedBy : '';
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
                  _id: slot._id,
                  from: intervalArr[i],
                  to: intervalArr[i+1],
                  reservedBy,
                  hostedBy,
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
