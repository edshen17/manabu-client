<template>
  <long-card v-if="users.length > 0">
    <div>
      <h2 class="text-xl md:text-md font-semibold border-0 border-solid border-b-2 py-2 px-5">
        {{ title }}
      </h2>
      <div class="grid grid-cols-1 divide-y cursor-pointer">
        <div v-for="user in users" :key="user._id" class="flex hover:bg-gray-100 px-5 py-3">
          <img :src="user.profileImageUrl" class="rounded-full w-12" />
          <div class="px-3">
            <p>{{ user.name }}</p>
            <p class="uppercase text-sm text-gray-500 tracking-wide">
              {{ getUserType(user) }}
            </p>
          </div>
        </div>
        <div class="text-center py-2 uppercase text-gray-500 text-sm hover:bg-gray-100">
          {{ $t('dashboard.showMore') }}
        </div>
      </div>
    </div>
  </long-card>
</template>

<script lang="ts">
import Vue from 'vue';
import LongCard from '../Layouts/LongCard.vue';
import { makeAdminRepository } from '../../../repositories/admin';
import { JoinedUserDoc } from '../../../../../server/models/User';
import { TranslateResult } from 'vue-i18n';
const adminRepository = makeAdminRepository;

export default Vue.extend({
  name: 'UsersCard',
  components: { LongCard },
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      users: [] as JoinedUserDoc[],
      teachersToShow: 3,
    };
  },
  computed: {
    // prop: {
    //   get(): any {
    //     return;
    //   },
    // },
  },
  async mounted() {
    this.users = [
      {
        _id: '61e4d24f66a99174bd4e8dc9',
        name: 'Edwin Shen',
        email: 'greencopter4444@gmail.com',
        profileImageUrl:
          'https://lh3.googleusercontent.com/a-/AOh14GjQAkMXL_1lf8a8ymoxuR6PJZDhoVMNX8wUejGV=s96-c',
        profileBio: '',
        languages: [
          { code: 'ja', level: 'C2', _id: '61e4d38c66a99174bd4e8e1d' },
          { code: 'en', level: 'C2', _id: '61e4d38c66a99174bd4e8e1d' },
        ],
        region: '',
        timezone: '',
        role: 'user',
        settings: {
          currency: 'SGD',
          locale: 'en',
          emailAlerts: {
            packageTransactionCreation: true,
            appointmentCreation: true,
            appointmentUpdate: true,
            appointmentStartReminder: true,
            _id: '61e4d24f66a99174bd4e8dcb',
          },
          _id: '61e4d24f66a99174bd4e8dca',
        },
        memberships: [],
        contactMethods: [],
        isEmailVerified: false,
        createdDate: '2022-01-17T02:19:59.591Z',
        lastModifiedDate: '2022-01-17T02:22:01.427Z',
        lastOnlineDate: '2022-01-17T02:19:59.591Z',
        balance: {
          totalCurrent: 0,
          totalPending: 0,
          totalAvailable: 0,
          currency: 'SGD',
          _id: '61e4d24f66a99174bd4e8dcc',
        },
        __v: 0,
        teacherData: {
          teachingLanguages: [],
          alsoSpeaks: [],
          introductionVideoUrl: '',
          applicationStatus: 'pending',
          settings: {
            isHidden: false,
            payoutData: { email: '' },
            _id: '61e4d2c766a99174bd4e8df0',
          },
          type: 'unlicensed',
          licenseUrl: '',
          priceData: { hourlyRate: 30, currency: 'SGD', _id: '61e4d2c766a99174bd4e8df1' },
          tags: [],
          lessonCount: 0,
          studentCount: 0,
          packages: [
            {
              lessonAmount: 5,
              description: '',
              name: 'light plan',
              isOffering: true,
              type: 'default',
              lessonDurations: [30, 60],
              tags: [],
              createdDate: '2022-01-17T02:21:59.799Z',
              lastModifiedDate: '2022-01-17T02:21:59.799Z',
              _id: '61e4d2c766a99174bd4e8df2',
            },
            {
              lessonAmount: 12,
              description: '',
              name: 'moderate plan',
              isOffering: true,
              type: 'default',
              lessonDurations: [30, 60],
              tags: [],
              createdDate: '2022-01-17T02:21:59.799Z',
              lastModifiedDate: '2022-01-17T02:21:59.799Z',
              _id: '61e4d2c766a99174bd4e8df3',
            },
            {
              lessonAmount: 22,
              description: '',
              name: 'mainichi plan',
              isOffering: true,
              type: 'default',
              lessonDurations: [30, 60],
              tags: [],
              createdDate: '2022-01-17T02:21:59.801Z',
              lastModifiedDate: '2022-01-17T02:21:59.801Z',
              _id: '61e4d2c766a99174bd4e8df4',
            },
            {
              lessonAmount: 10,
              description: '',
              name: 'custom plan',
              isOffering: false,
              type: 'custom',
              lessonDurations: [30, 60],
              tags: [],
              createdDate: '2022-01-17T02:21:59.801Z',
              lastModifiedDate: '2022-01-17T02:21:59.801Z',
              _id: '61e4d2c766a99174bd4e8df5',
            },
          ],
          createdDate: '2022-01-17T02:21:59.798Z',
          lastModifiedDate: '2022-01-17T02:21:59.798Z',
          _id: '61e4d2c766a99174bd4e8def',
        },
      },
    ] as any;
  },
  methods: {
    async getTeachers(): Promise<JoinedUserDoc[]> {
      const { data } = await adminRepository.get({
        path: '/pendingTeachers',
        query: {
          page: 0,
          limit: 5,
        },
        isAbsolutePath: false,
      });
      const { users } = data;
      return users;
    },
    getUserType(user: JoinedUserDoc): TranslateResult {
      const isTeacher = 'teacherData' in user;
      const userType = isTeacher
        ? this.$t(`userProfile.teacher.${user.teacherData!.type}`)
        : this.$t('userProfile.student');
      return userType;
    },
  },
});
</script>
