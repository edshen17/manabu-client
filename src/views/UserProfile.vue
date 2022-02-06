<template>
  <two-card-layout right-card-class="max-h-44">
    <template v-slot:left-cards>
      <div v-if="user">
        <profile-bio-card :user="user" :is-teacher="isTeacher" />
        <teacher-packages-card v-if="isTeacher" :teacher="user" class="mt-5 h-auto pb-2" />
      </div>
    </template>
    <template v-slot:right-cards>
      <div class="flex flex-col m-5 space-y-5 text-lg">
        <div class="flex">
          <p class="flex-1">Trial Lesson</p>
          <p class="text-lg text-gray-500">5.00 USD</p>
        </div>
        <div class="flex">
          <p class="flex-1">Lessons</p>
          <p class="text-lg text-gray-500">30 SGD/hour</p>
        </div>
        <button class="rounded-lg text-white py-2 text-center bg-indigo-500 text-base">
          Book Now
        </button>
      </div>
    </template>
  </two-card-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import { JoinedUserDoc } from '../../../server/models/User';
import TeacherPackagesCard from '../components/UserProfile/TeacherPackagesCard.vue';
import ProfileBioCard from '../components/UserProfile/ProfileBioCard.vue';
import { makeUserRepository } from '../repositories/user';
import TwoCardLayout from '@/components/UserProfile/Layouts/TwoCardLayout.vue';
const userRepository = makeUserRepository;

export default Vue.extend({
  name: 'UserProfile',
  components: { ProfileBioCard, TeacherPackagesCard, TwoCardLayout },
  props: {},
  computed: {
    isTeacher: {
      get(): boolean {
        const self = this as any;
        const isTeacher = self.user && 'teacherData' in self.user;
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
          return user;
        }
      },
    },
  },
  methods: {},
});
</script>
