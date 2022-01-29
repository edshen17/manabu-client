<template>
  <two-card-layout>
    <template v-slot:left-cards>
      <div v-if="user">
        <profile-bio-card :user="user" :is-teacher="isTeacher" />
        <teacher-packages-card v-if="isTeacher" :teacher="user" class="mt-5 h-auto pb-2" />
      </div>
    </template>
    <template v-slot:right-cards> sa </template>
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
      async get(): Promise<JoinedUserDoc> {
        const { data } = await userRepository.getById({ _id: this.userId, query: {} });
        const { user } = data;
        return user;
      },
    },
  },
  methods: {},
});
</script>
