<template>
  <div class="bg-gray-50 h-full w-full">
    <vue-topprogress ref="topProgress"></vue-topprogress>
    <appointment-calendar
      class="py-5 md:py-10 lg:py-20 bg-white"
      main-class="flex justify-center items-center h-auto lg:h-screen"
      :hosted-by-id="$route.params.userId"
      :duration="duration"
      :appointment-amount="appointmentAmount"
      :pkg="packageData"
      @submit-timeslots="createAppointments"
    />
  </div>
</template>

<script lang="ts">
import AppointmentCalendar from '@/components/Calendar/AppointmentCalendar.vue';
import { makeAppointmentRepository } from '@/repositories/appointment';
import { makePackageTransactionRepository } from '@/repositories/packageTransaction';
import { PackageDoc } from '@server/models/Package';
import { PackageTransactionDoc } from '@server/models/PackageTransaction';
import { StringKeyObject } from '@server/types/custom';
import { vueTopprogress } from 'vue-top-progress';
import Vue from 'vue';
const packageTransactionRepository = makePackageTransactionRepository;
const appointmentRepository = makeAppointmentRepository;

export default Vue.extend({
  name: 'ExtendedAppointmentCalendar',
  components: { AppointmentCalendar, vueTopprogress },
  props: {
    packageTransaction: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    pkg: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  data() {
    return {
      duration: 0,
      appointmentAmount: 0,
      packageData: {} as PackageDoc,
      isLoading: false,
    };
  },
  computed: {},
  async created() {
    if (this.packageTransaction._id) {
      this.setAppointmentCalendarData(this.packageTransaction);
    } else {
      const packageTransactionId = this.$route.params.packageTransactionId;
      const { data } = await packageTransactionRepository.getById({
        _id: packageTransactionId,
        query: {},
      });
      const { packageTransaction } = data;
      this.setAppointmentCalendarData(packageTransaction);
    }
  },
  methods: {
    setAppointmentCalendarData(packageTransaction: PackageTransactionDoc): void {
      const { lessonDuration, remainingAppointments, packageData } = packageTransaction;
      this.duration = lessonDuration;
      this.appointmentAmount = remainingAppointments;
      this.packageData = packageData;
    },
    async createAppointments(timeslots: StringKeyObject[]): Promise<void> {
      if (!this.isLoading) {
        this.isLoading = true;
        const self = this as any;
        self.$refs.topProgress.start();
        const appointments = timeslots.map((ts) => {
          return {
            ...ts,
            hostedById: this.$route.params.userId,
            packageTransactionId: this.$route.params.packageTransactionId,
          };
        });
        try {
          const { data } = await appointmentRepository.create({
            payload: {
              appointments,
            },
            query: {},
          });
          const { packageTransaction } = data;
          this.$store.dispatch('packageTransaction/setPackageTransaction', packageTransaction);
          this.$store.dispatch('appointment/resetEntityState');
          await this.$store.dispatch('appointment/getEntityStateData');
        } catch (err) {
          self.$refs.topProgress.done();
          this.isLoading = false;
          throw err;
        }
        this.$router.push('/dashboard');
        self.$refs.topProgress.done();
      }
    },
  },
});
</script>
