<template>
  <div class="ViewCalendar">
    <b-modal id="complete-modal" title="Success!" :no-close-on-backdrop="true">
      <p class="my-4" v-show="!reserveErr">
        Your reservation has been made and is pending confirmation. You can
        reschedule appointments before they begin and can cancel them anytime
        before they start.
      </p>
      <p class="my-4" v-show="reserveErr">
        There was an error processing your request. Please try again.
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
          class="rounded-circle center-image"
          alt="100x100"
          :src="imageSourceEdit(selectedHostedBy.profileImage)"
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
            Region: {{ selectedHostedBy.region }} [{{ selectedHostedBy.timezone

            }}]
          </p>
        </div>
        <h6 class="my-4 text-center" v-show="!updateErr">
          lesson information goes here {{getAppointmentTime()}}
        </h6>
      </div>
      <p class="my-4" v-show="updateErr">
        There was an error processing your request. If you are rescheduling,
        make sure you do it before the lesson starts.
      </p>
      <template #modal-footer>
        <b-button @click="resetOnCancel('update-modal')" v-show="!updateErr">
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
          v-show="!updateErr && !isCancelling && rescheduleSlotLimit > 0"
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
        Are you sure you want to reschedule the appointment to
        {{ getRescheduleTime() }}?
      </p>
      <p class="my-4" v-show="rescheduleErr">
        There was an error processing your request. If you are rescheduling,
        make sure you do it before the lesson starts.
      </p>
      <template #modal-footer>
        <b-button
          @click="resetOnCancel('reschedule-modal')"
          v-show="!rescheduleErr"
        >
          Exit
        </b-button>
        <b-button
          v-show="!rescheduleErr"
          variant="info"
          @click="$bvModal.hide('reschedule-modal')"
        >
          No
        </b-button>
        <b-button
          @click="rescheduleErr = false; $bvModal.hide('reschedule-modal')"
          variant="primary"
          v-show="rescheduleErr"
        >
          OK
        </b-button>
        <b-button
          @click="rescheduleAppointment"
          variant="primary"
          v-show="!rescheduleErr"
        >
          Yes
        </b-button>
      </template>
    </b-modal>
    <div v-if="isLoaded">
      <div v-if="!isRescheduling">
        <h4 class="text-center slots-left">
          Remaining timeslots: {{ reservationSlotLimit }}. Remaining
          reschedules: {{ rescheduleSlotLimit }}
        </h4>
      </div>
      <div v-else>
        <h4 class="text-center slots-left">Click a slot to reschedule</h4>
      </div>
      <button
        @click="createAppointments()"
        class="add-manual"
        :class="{ 'enabled-button': reservationSlotLimit <= reservationSlotLimit && currentlySelected.length > 0 }"
        :disabled="reservationSlotLimit == reservationSlotLimit && currentlySelected.length == 0"
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
          :class="{'booked-by-self': (event_information.data.status == 'confirmed' && event_information.data.reservedBy == reservedBy && !onEventClassBind(event_information.data.from, prevRescheduledLessons)) 
                     && (!onEventClassBind(event_information.data.from, sessionCancelledLessons)),
          'booked-by-other': event_information.data.reservedBy != reservedBy && event_information.data.reservedBy != ''
                              && (event_information.data.cancellationReason != 'student issue' 
                              && event_information.data.cancellationReason != 'student cancel'),
          'pending': (event_information.data.status == 'pending' && event_information.data.reservedBy == reservedBy && !onEventClassBind(event_information.data.from, prevRescheduledLessons)) 
                     || (onEventClassBind(event_information.data.from, sessionPendingLessons)
                     && (!onEventClassBind(event_information.data.from, sessionCancelledLessons)))
                     || onEventClassBind(event_information.data.from, sessionRescheduledLessons),
          'on-select': onEventClassBind(event_information.data.from, currentlySelected),
          'cancelled': ((event_information.data.status == 'cancelled' 
            && event_information.data.reservedBy == reservedBy)) 
            || onEventClassBind(event_information.data.from, sessionCancelledLessons),
          'restricted': (new Date() > new Date(event_information.data.from) 
            || isOnSameDay(new Date(), new Date(event_information.data.from)))
            && reservedBy != event_information.data.reservedBy,
          }"
          @click="onClick(event_information.data)"
        >
          <span class="time appointment-title" style="text-align: left"
            >{{ parseISOString(event_information.start_time) }} -
            {{ parseISOString(event_information.end_time)}}
          </span>
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
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import axios from 'axios'
import LayoutDefault from '../layouts/LayoutDefault';
import languageLevelBars from '../../assets/scripts/languageLevelBars'
import fetchUserData from '../../assets/scripts/fetchUserData'
import imageSourceEdit from '../../assets/scripts/imageSourceEdit'
dayjs.extend(isBetween);

export default {
    name: 'ViewCalendar',
    components: {
        Kalendar
    },
    created() {
        this.$emit('update:layout', LayoutDefault);
    },
    mounted() {
      axios.get(`${this.host}/transaction/packageTransaction/${this.$route.params.packageTransactionId}`).then((res) => {
        if (res.status == 200) {
          this.hostedBy = res.data.hostedBy;
          this.reservedBy = res.data.reservedBy;
          this.reservationSlotLimit = res.data.remainingAppointments;
          this.rescheduleSlotLimit = res.data.remainingReschedules;
          this.reservationLength = res.data.reservationLength;
          this.getScheduleData();
        }
      }).catch((err) => {
        console.log(err);
      })

    },
    data() {
        return {
            host: 'http://localhost:5000/api',
            reservedBy: '',
            hostedBy: '',
            reservationLength: null,
            rescheduleSlotLimit: null,
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
              reservationSlotLimit: null,
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
      imageSourceEdit,
      fetchUserData,
      deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
      },
      formatAMPM(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0'+ minutes : minutes;
        const strTime = hours + ':' + minutes + ampm;
        return strTime;
      },
      getRescheduleTime() {
        if (this.selectedEventData != null) {
          const endTime = dayjs(this.selectedEventData.from).add(this.reservationLength, 'minutes').toISOString();
          return `${this.formatAMPM(new Date(this.selectedEventData.from))} - ${this.formatAMPM(new Date(endTime))}`;
        }
      },
      getAppointmentTime() {
        if (this.selectedEventData != null) {
          const appointment = this.appointments.find(appointment => appointment.from == this.selectedEventData.from);
          if (appointment != undefined) {
            return `${this.formatAMPM(new Date(appointment.from))} - ${this.formatAMPM(new Date(appointment.to))}`
          }
        }
      },
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
            this.rescheduleSlotLimit--;
            axios.put(`${this.host}/transaction/packageTransaction/${this.$route.params.packageTransactionId}`, {remainingReschedules: this.rescheduleSlotLimit }, { headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }}).catch((err) => {
              console.log(err);
            })
            this.$bvModal.hide('reschedule-modal');
            this.prevRescheduledLessons.push(this.deepCopy(this.originalReschedulingLesson));
            this.sessionRescheduledLessons.push(this.deepCopy(this.updatedReschedulingLesson));
            const updateIndex = this.appointments.findIndex(appointment => appointment.from == this.originalReschedulingLesson.from)
            this.appointments[updateIndex] = this.deepCopy(this.updatedReschedulingLesson);
            this.sessionPendingLessons = this.sessionPendingLessons.filter(event => event.from != this.originalReschedulingLesson.from);

            // first reset rescheduled items to ''
            for (let i = 0; i <= (this.reservationLength / 30) - 1; i++) {
                  const eventToUpdate = this.events.find(event => event.from != undefined && event.data.from == dayjs(this.originalReschedulingLesson.from).add(30 * i, 'minutes').toISOString());
                  if (eventToUpdate) {
                    eventToUpdate.data.reservedBy = '';
                    eventToUpdate.data.status = '';
              }
            }

            // then go through and update status
            for (let i = 0; i <= (this.reservationLength / 30) - 1; i++) {
                const eventToUpdate = this.events.find(event => event.from != undefined && event.data.from == dayjs(this.updatedReschedulingLesson.from).add(30 * i, 'minutes').toISOString());
                if (eventToUpdate) {
                  eventToUpdate.data.reservedBy = res.data.reservedBy;
                  eventToUpdate.data.status = res.data.status;
              }
            }
          }
          this.resetOnCancel('update-modal');
        }).catch((err) => {
          console.log(err);
        });
      },
      isOnSameDay(firstDate, secondDate) {
        return firstDate.getFullYear() === secondDate.getFullYear() &&
        firstDate.getMonth() === secondDate.getMonth() &&
        firstDate.getDate() === secondDate.getDate();
      },
      prepareReschedule() { // used in update modal (when user presses reschedule)
        const slotToReschedule = this.appointments.find(appointment => appointment.from == this.selectedEventData.from);
        const appointmentDate = new Date(slotToReschedule.from);
        const currentDate = new Date();

        if (!this.isOnSameDay(appointmentDate, currentDate)) {
          this.originalReschedulingLesson = this.deepCopy(slotToReschedule);
          this.isRescheduling = true;
          this.$bvModal.hide('update-modal');
        } else {
          this.updateErr = true;
        }
      },
      resetOnCancel(modalName) {
        this.isRescheduling = false;
        this.isCancelling = false;
        this.isCancellingConfirmation = false;
        this.originalReschedulingLesson = {};
        this.updatedReschedulingLesson = {};
        this.modalTitleText = 'Appointment details';
        this.$bvModal.hide(modalName);
      },
      languageLevelBars,
      onClick(eventData) { // on click, add items to currentlySelected
        const startTime = eventData.from;
        const endTime = dayjs(startTime).add(this.reservationLength, 'minutes').toISOString();
        const isPast = new Date() > new Date(startTime);
        const isOnSameDay =  this.isOnSameDay(new Date(startTime), new Date());
        let duplicateIndex = this.currentlySelected.findIndex(selected => selected.from == startTime);
        this.selectedEventData = this.deepCopy(eventData);
        let lastElementIndex = (this.reservationLength / 30) - 1;
        const lastSlotData = this.events.find(event => event.data.from == dayjs(startTime).add(30 * lastElementIndex, 'minutes').toISOString());

        if (duplicateIndex != -1) { // unselecting
          this.reservationSlotLimit += 1;
          this.currentlySelected = this.currentlySelected.filter((selected, i) => i !== duplicateIndex);
          return;
        }

        if (!isPast && lastSlotData != undefined) {
          let isValidSelect = true;
          let isClickOnTopSlotReserved = this.appointments.filter((appointment) => { return appointment.from == startTime && appointment.reservedBy == this.reservedBy }).length != 0;

          for (let i = 0; i <= lastElementIndex; i++) {
              const currentTimeSlot = dayjs(startTime).add(i * 30, 'minutes').toISOString();
              const currentTimeSlotObj = this.events.find(event => event.from == currentTimeSlot);
              let validMoveCheck;

              if (currentTimeSlotObj != undefined) {
                const isCancelledBySelf = currentTimeSlotObj.data.status == 'cancelled' && currentTimeSlotObj.data.reservedBy == this.reservedBy;
                const isReservedBySelf = (currentTimeSlotObj.data.status == 'pending' || currentTimeSlotObj.data.status == 'confirmed') && currentTimeSlotObj.data.reservedBy == this.reservedBy;
                let reserverableSlot = currentTimeSlotObj.data.status == ''
                  || (currentTimeSlotObj.data.status
                  == 'cancelled' && currentTimeSlotObj.data.cancellationReason != 'schedule change'
                  && currentTimeSlotObj.data.reservedBy != this.reservedBy)
                  && !isCancelledBySelf;
                validMoveCheck = reserverableSlot || isReservedBySelf;

                if (!this.isRescheduling) { // not reschedule
                  isValidSelect = isValidSelect && !isReservedBySelf && reserverableSlot && validMoveCheck;
                   if (isReservedBySelf && isClickOnTopSlotReserved) { // in session update
                    this.$bvModal.show('update-modal');
                    this.cancelStartTime = startTime;
                  }
                } else { // on reschedule, change rules to be more lax
                  isValidSelect = currentTimeSlotObj.data.status == ''
                  || (currentTimeSlotObj.data.status
                  == 'cancelled' && currentTimeSlotObj.data.cancellationReason != 'schedule change'
                  && currentTimeSlotObj.data.reservedBy != this.reservedBy)
                  || (isReservedBySelf);
                }
              }
          }

          if (isValidSelect && !this.isRescheduling && this.reservationSlotLimit != 0 && !isOnSameDay) {
             const currSelectedArrCopy = [... this.currentlySelected];
                if (this.currentlySelected.length == 0) { // if no selected items, create selection
                    this.reservationSlotLimit -= 1;
                    this.currentlySelected.push(this.appointmentFactory(this.hostedBy, this.reservedBy, this.$route.params.packageTransactionId, startTime, endTime)); // TODO: replace '' with package id
                } else { // if not first selected item, check that selected item times do not overlap
                  let isInBetween = false;
                  for (let i = 0; i < currSelectedArrCopy.length; i++) {
                    isInBetween = isInBetween
                    || dayjs(startTime).isBetween(dayjs(this.currentlySelected[i].from), dayjs(this.currentlySelected[i].to))
                    || dayjs(endTime).isBetween(dayjs(this.currentlySelected[i].from), dayjs(this.currentlySelected[i].to))
                    if (!isInBetween && i == this.currentlySelected.length - 1) {
                      this.currentlySelected.push(this.appointmentFactory(this.hostedBy, this.reservedBy, this.$route.params.packageTransactionId, startTime, endTime)); // TODO: replace '' with package id
                      this.reservationSlotLimit -= 1;
                    }
                  }
                }
          } else if (isValidSelect && this.isRescheduling) {
              let isInBetweenCurrent = dayjs(startTime).isBetween(dayjs(this.originalReschedulingLesson.from), dayjs(this.originalReschedulingLesson.to))
                || dayjs(endTime).isBetween(dayjs(this.originalReschedulingLesson.from), dayjs(this.originalReschedulingLesson.to))
              let isInBetweenOther;

              for (let i = 0; i < this.appointments.length; i++) { // make sure users can reschedule on a current slot but not another reserved slot
                    isInBetweenOther = isInBetweenOther
                    || dayjs(startTime).isBetween(dayjs(this.appointments[i].from), dayjs(this.appointments[i].to))
                    || dayjs(endTime).isBetween(dayjs(this.appointments[i].from), dayjs(this.appointments[i].to))
                  }

              if ((!isInBetweenOther || isInBetweenCurrent) && this.appointments.findIndex(appointment => appointment.from == startTime) == -1) {
                this.$bvModal.show('reschedule-modal');
                this.updatedReschedulingLesson = this.deepCopy(this.originalReschedulingLesson);
                this.updatedReschedulingLesson.from = startTime;
                this.updatedReschedulingLesson.to = endTime;
              }
          }
        }
      },
      onEventClassBind(startTime, eventArr) { // bind classes based on arrays like currentlySelected/sessionPendingLessons to color slots
        let isEventOccuring = false;
        for (let i = 0; i <= (this.reservationLength / 30) - 1; i++) {
          let timeSlot;
          if (i == 0) {
            timeSlot = dayjs(startTime).toISOString();
          } else {
            timeSlot = dayjs(startTime).subtract(i * 30, 'minutes').toISOString(); // previous timeslot
          }
          isEventOccuring = isEventOccuring
          || (eventArr.filter(eventStartTime => eventStartTime.from == startTime || eventStartTime.from == timeSlot).length != 0);
        }
          return isEventOccuring;
      },
      cancelAppointment(startTime) { // not using id because some slots have _ids of avail times
        this.modalTitleText = 'Are you sure you want to cancel the appointment?'
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
                  const eventToUpdate = this.events.find(event => event.from != undefined && event.data.from == dayjs(startTime).add(30 * i, 'minutes').toISOString());
                  if (eventToUpdate) {
                    eventToUpdate.data.cancellationReason = res.data.cancellationReason;
                    eventToUpdate.data.status = res.data.status;
              }
            }
          }
        }).catch((err) => {
          console.log(err);
        });
        }
      },
      createAppointments() {
        for (let i = 0; i < this.currentlySelected.length; i++) {
            const currentlySelectedFrom = this.currentlySelected[i].from;
            const toUpdateTime = this.events.find(event => event.from != undefined && event.data.from == currentlySelectedFrom).data.from;

            axios.post(`${this.host}/schedule/appointment`, this.currentlySelected[i], { headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }}).then(res => {
              if (res.status == 200) {
                this.$bvModal.show('complete-modal');
                    this.appointments.push(res.data);
                    if (toUpdateTime) {
                      for (let i = 0; i <= (this.reservationLength / 30) - 1; i++) {
                        const eventToUpdate = this.events.find(event => event.from != undefined && event.data.from == dayjs(toUpdateTime).add(30 * i, 'minutes').toISOString());
                        if (eventToUpdate) {
                          eventToUpdate.data.reservedBy = res.data.reservedBy;
                          eventToUpdate.data.status = res.data.status;
                        }
                      }
                    }
                axios.put(`${this.host}/transaction/packageTransaction/${this.$route.params.packageTransactionId}`, {remainingAppointments: this.reservationSlotLimit }, { headers: {
                  'X-Requested-With': 'XMLHttpRequest'
                }}).then((res) => {
                  if (res.status == 200) {
                    this.sessionPendingLessons.push(...this.currentlySelected);
                    this.currentlySelected = [];
                  }
                }).catch((err) => {
                  console.log(err);
                })
              }
            }).catch((err) => {
              this.reserveErr = true;
              return;
            });
          }

      },
      getScheduleData() {
        const from = dayjs().subtract(1, 'month');
        const to = dayjs().add(3, 'month');;
        axios.get(`${this.host}/schedule/${this.hostedBy}/availableTime/${from.toISOString()}/${to.toISOString()}`).then((resAvailableTimes) => {
          if (resAvailableTimes.status == 200) {
            axios.get(`${this.host}/schedule/${this.hostedBy}/appointment/${from.toISOString()}/${to.toISOString()}`).then(async (resAppointments) => {
              if (resAppointments.status == 200) {
                const combinedTimeSlots = resAvailableTimes.data.concat(resAppointments.data);
                const hostedByData = await fetchUserData(this.hostedBy);
                this.selectedHostedBy = hostedByData;
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
      appointmentFactory(hostedBy, reservedBy, packageTransactionId, from, to) { // creates appointment object to send to server
        const appointment = {
          hostedBy,
          reservedBy,
          from,
          to,
          packageTransactionId
        }
        return appointment;
      },
      removeSelection(startTime) { // remove selected item from currentlySelected array
        this.currentlySelected = this.currentlySelected.filter((selected) => {
          return selected.from != startTime;
        })
      },
      intervals(slot) { // split up any time into 30m intervals
      const test = dayjs(slot.from);
        const start = dayjs(slot.from).minute(Math.ceil(test.minute() / 30) * 30);
        const end = dayjs(slot.to);
        const reservedBy = slot.reservedBy ? slot.reservedBy : '';
        const hostedBy = slot.hostedBy ? slot.hostedBy : '';
        const status = slot.status ? slot.status : '';
        let intervalArr = [];
        let current = dayjs(start);

        while (current <= end) {
            intervalArr.push(current.toISOString());
            current = current.add(30, 'minutes');
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
              const duplicateIndex = this.events.findIndex(event => {event.data.from == formatedDate.from;});
              if (duplicateIndex == -1) {
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

<style lang="css">
@import "../../../src/assets/css/kalendar.css";
@import "../../../src/assets/css/styles.css";
</style>
