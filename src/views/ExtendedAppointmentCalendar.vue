<template>
  <div>
    <appointment-calendar
      :hosted-by-data="hostedByData"
      :duration="duration"
      :pkg="packageTransaction.packageData"
      :package-transaction="packageTransaction"
    />
  </div>
</template>

<script lang="ts">
import AppointmentCalendar from '@/components/Calendar/AppointmentCalendar.vue';
import Vue from 'vue';

export default Vue.extend({
  name: 'ExtendedAppointmentCalendar',
  components: { AppointmentCalendar },
  props: {
    hostedByData: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    duration: {
      type: Number,
      required: false,
      default: 60,
    },
    packageTransaction: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  data() {
    return {};
  },
  computed: {
    // prop: {
    //   get(): any {
    //     return;
    //   },
    // },
  },
  // watch: {
  //   prop: function () {},
  // },
  mounted() {
    return;
  },
  methods: {},
});
</script>
