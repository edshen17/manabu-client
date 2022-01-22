<template>
  <div class="bg-gray-50 h-auto min-h-screen">
    <div class="flex flex-wrap md:flex-nowrap w-full md:w-9/12 mx-auto md:py-7">
      <div class="w-full md:w-8/12 md:mx-2">
        <profile-bio-card :user="user" :is-teacher="isTeacher" />
        <teacher-packages-card v-if="isTeacher" :teacher="user" />
      </div>
      <div class="w-full md:w-4/12 md:mx-3 max-h-96 sticky top-24 rounded-lg bg-white shadow-md">
        <div class="max-h-96 h-96">sa</div>
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
const userRepository = makeUserRepository;

export default Vue.extend({
  name: 'UserProfile',
  components: { ProfileBioCard, TeacherPackagesCard },
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
