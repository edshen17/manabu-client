<template>
  <div class="bg-gray-50 h-auto min-h-screen">
    <div class="w-11/12 md:w-8/12 mx-auto py-4 md:py-7">
      <router-link v-for="teacher in teachers" :key="teacher._id" :to="`/user/${teacher._id}`">
        <div class="flex rounded-lg shadow-md bg-white py-4 mb-5 h-44 hover:bg-gray-100">
          <img
            :src="teacher.profileImageUrl"
            class="rounded-full w-16 h-16 md:w-24 md:h-24 mx-4 md:mx-8"
          />
          <div class="w-56">
            <p class="text-xl">{{ teacher.name }}</p>
            <p class="text-sm md:text-base text-gray-400 uppercase tracking-wide my-1">
              {{ $t(`userProfile.teacher.${teacher.teacherData.type}`) }}
            </p>
            <div class="flex">
              <language-bars
                :language-level="teacher.languages[0].level"
                :language-code="teacher.languages[0].code"
              />
              <language-bars
                :language-level="teacher.languages[1].level"
                :language-code="teacher.languages[1].code"
                class="-ml-14"
              />
            </div>
            <div class="my-2">
              <p class="text-lg">
                {{ $t('userProfile.teacher.hourlyRate') }}:
                {{ teacher.teacherData.priceData.hourlyRate }} {{ currency }}
              </p>
            </div>
          </div>
        </div>
      </router-link>
      <infinite-loading @infinite="onPaginate">
        <div slot="spinner"></div>
        <div slot="no-more"></div>
        <div slot="no-results"></div>
      </infinite-loading>
    </div>
  </div>
</template>

<script lang="ts">
import LanguageBars from '@/components/UserProfile/LanguageBars.vue';
import InfiniteLoading from 'vue-infinite-loading';
import { makeExchangeRateMixin } from '@/mixins/exchangeRate';
import { makeTeacherRepository } from '@/repositories/teacher';
import { JoinedUserDoc } from '@server/models/User';
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { StringKeyObject } from '@server/types/custom';

const teacherRepository = makeTeacherRepository;

export default Vue.extend({
  name: 'FindTeacher',
  components: { LanguageBars, InfiniteLoading },
  mixins: [makeExchangeRateMixin],
  props: {},
  data() {
    return {
      teachers: [] as JoinedUserDoc[],
      query: {
        page: 0,
        limit: 20,
      },
    };
  },
  computed: {
    ...mapGetters({
      currency: 'user/currency',
    }),
  },
  async created() {
    const { data } = await teacherRepository.get({
      path: '/',
      query: {},
    });
    const { teachers } = data;
    this.teachers = teachers;
  },
  async mounted() {
    for (const teacher of this.teachers) {
      teacher.teacherData!.priceData = await this.getConvertedPriceData(teacher);
    }
  },
  methods: {
    async getConvertedPriceData(
      teacher: JoinedUserDoc
    ): Promise<{ hourlyRate: number; currency: string }> {
      const priceData = teacher.teacherData!.priceData;
      const { hourlyRate, currency } = priceData;
      const self = this as any;
      const targetCurrency = self.currency;
      const convertedHourlyRate = await self.convert({
        amount: hourlyRate,
        sourceCurrency: currency,
        targetCurrency,
        isRounding: true,
      });
      const convertedPriceData = {
        hourlyRate: convertedHourlyRate,
        currency: targetCurrency,
      };
      return convertedPriceData;
    },
    async onPaginate($state: StringKeyObject): Promise<void> {
      this.query.page++;
      const { data } = await teacherRepository.get({
        path: '/',
        query: this.query,
      });
      const { teachers } = data;
      if (teachers.length) {
        this.query.page++;
        this.teachers = this.teachers.concat(teachers);
        $state.loaded();
      } else {
        $state.complete();
      }
    },
  },
});
</script>
