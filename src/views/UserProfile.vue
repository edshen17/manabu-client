<template>
  <div class="bg-gray-50 h-auto min-h-screen">
    <div class="flex flex-wrap md:flex-nowrap w-full md:w-9/12 mx-auto md:py-7">
      <div class="w-full md:w-8/12 md:mx-2">
        <profile-bio-card :user="user" :is-teacher="isTeacher" />
        <div class="rounded-lg shadow-md mt-5 h-auto pb-2 bg-white">
          <p class="justify-center p-6 mx-auto text-2xl">Lessons</p>
          <div class="px-6 mx-auto">
            <div class="border-solid border-2 rounded-md mb-5">
              <div class="p-3">
                <p class="text-lg text-blue-500">Light plan</p>
                <p class="mt-2 text-gray-500">
                  This is for students who want a balanced but intensive learning schedule. With
                  this plan, you will receive 12 personalized lessons every month or about 3 lessons
                  every week.
                </p>
              </div>
            </div>
          </div>
          <div class="px-5 mx-auto">
            <div class="border-solid border-2 rounded-md mb-5">
              <div class="p-3">
                <p class="text-lg text-pink-500">Moderate plan</p>
                <p class="mt-2 text-gray-500">
                  This is for students who want a balanced but intensive learning schedule. With
                  this plan, you will receive 12 personalized lessons every month or about 3 lessons
                  every week.
                </p>
              </div>
            </div>
          </div>
          <div class="px-5 mx-auto">
            <div class="border-solid border-2 rounded-md mb-5">
              <div class="p-3">
                <p class="text-lg text-green-500">Mainichi plan</p>
                <p class="mt-2 text-gray-500">
                  This is for students who want a balanced but intensive learning schedule. With
                  this plan, you will receive 12 personalized lessons every month or about 3 lessons
                  every week.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full md:w-4/12 md:mx-3 max-h-96">
        <div class="rounded-lg shadow-md max-h-96 h-96"></div>
        <div class="rounded-lg shadow-md max-h-96 mt-5">price data</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { JoinedUserDoc } from '../../../server/models/User';
import ProfileBioCard from '../components/UserProfile/ProfileBioCard.vue';
import { makeUserRepository } from '../repositories/user';
const userRepository = makeUserRepository;

export default Vue.extend({
  name: 'UserProfile',
  components: { ProfileBioCard },
  props: {
    // prop: {
    //   type: String,
    //   default: '',
    //   required: true,
    // },
  },
  data() {
    return { user: {} as unknown as JoinedUserDoc };
  },
  computed: {
    isTeacher: {
      get(): boolean {
        const isTeacher = 'teacherData' in this.user;
        return isTeacher;
      },
    },
  },
  async mounted() {
    await this.getUser();
  },
  methods: {
    async getUser(): Promise<void> {
      const { data } = await userRepository.getById({ _id: this.$route.params.userId, query: {} });
      const { user } = data;
      this.user = user;
    },
  },
});
</script>
