<template>
  <div v-if="user">
    <two-card-layout v-if="isTeacher" right-card-class="max-h-44">
      <template #left-cards>
        <div>
          <profile-bio-card :user="user" :is-teacher="isTeacher" />
          <teacher-packages-card
            v-if="isTeacher"
            ref="teacherPackagesCard"
            :teacher="user"
            class="mt-5 h-auto pb-2"
          />
        </div>
      </template>
      <template #right-cards>
        <div class="flex flex-col m-5 space-y-5 text-lg">
          <div class="flex">
            <p class="flex-1">{{ $t('userProfile.teacher.lessonTypes.trial.title') }}</p>
            <p class="text-lg text-gray-500">{{ hourlyRate / 2 }} {{ currency }}</p>
          </div>
          <div class="flex">
            <p class="flex-1">{{ $t('userProfile.teacher.hourlyRate') }}</p>
            <p class="text-lg text-gray-500">{{ hourlyRate }} {{ currency }}</p>
          </div>
          <button
            class="rounded-lg text-white py-2 text-center bg-indigo-500 text-base"
            @click="showDialog"
          >
            {{ $t('button.common.bookNow') }}
          </button>
        </div>
      </template>
    </two-card-layout>
    <div v-else class="bg-gray-50 h-auto lg:min-h-screen">
      <div
        class="flex flex-wrap lg:flex-nowrap w-full lg:w-9/12 mx-auto lg:py-7 justify-center items-center flex mx-auto"
      >
        <div class="w-full lg:w-8/12 lg:mx-2">
          <profile-bio-card :user="user" :is-teacher="isTeacher" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { JoinedUserDoc } from '../../../server/models/User';
import TeacherPackagesCard from '../components/UserProfile/TeacherPackagesCard.vue';
import ProfileBioCard from '../components/UserProfile/ProfileBioCard.vue';
import { makeUserRepository } from '../repositories/user';
import TwoCardLayout from '@/components/UserProfile/Layouts/TwoCardLayout.vue';
import { makeExchangeRateMixin } from '@/mixins/exchangeRate';
import { mapGetters } from 'vuex';
import { mixpanel } from '@/plugins/mixpanel';
const userRepository = makeUserRepository;

export default Vue.extend({
  name: 'UserProfile',
  components: { ProfileBioCard, TeacherPackagesCard, TwoCardLayout },
  mixins: [makeExchangeRateMixin],
  props: {},
  computed: {
    ...mapGetters({
      currency: 'user/currency',
    }),
    isTeacher: {
      get(): boolean {
        const self = this as any;
        const isTeacher = self.user && 'teacherData' in self.user && self.user.role != 'admin';
        return isTeacher;
      },
    },
    userId: {
      get(): string {
        const userId = this.$route.params.userId;
        return userId;
      },
    },
  },
  asyncComputed: {
    user: {
      async get(): Promise<JoinedUserDoc | undefined> {
        if (this.userId) {
          const { data } = await userRepository.getById({ _id: this.userId, query: {} });
          const { user } = data;
          mixpanel.track('View Teacher', { teacherId: this.userId });
          return user;
        }
      },
    },
    hourlyRate: {
      async get(): Promise<number | undefined> {
        if (this.isTeacher) {
          const self = this as any;
          const priceData = self.user.teacherData.priceData;
          const { hourlyRate, currency } = priceData;
          const convertedHourlyRate = await self.convert({
            amount: hourlyRate,
            sourceCurrency: currency,
            targetCurrency: this.currency,
            isRounding: true,
          });
          return convertedHourlyRate;
        }
      },
    },
  },
  methods: {
    showDialog(): void {
      (this as any).$refs.teacherPackagesCard.showDialog = true;
      mixpanel.track('Checkout', { teacherId: this.userId });
    },
  },
});
</script>
