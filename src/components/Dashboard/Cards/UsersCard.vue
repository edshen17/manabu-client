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
        <div
          v-show="users.length >= limit && !isEnd"
          class="text-center py-2 uppercase text-gray-500 text-sm hover:bg-gray-100"
          @click="showMore"
        >
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
import { makeUserRepository } from '../../../repositories/user';
import { JoinedUserDoc } from '../../../../../server/models/User';
import { TranslateResult } from 'vue-i18n';
const adminRepository = makeAdminRepository;
const userRepository = makeUserRepository;

export default Vue.extend({
  name: 'UsersCard',
  components: { LongCard },
  props: {
    title: {
      type: String,
      required: true,
    },
    userData: {
      type: Object,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      users: [] as JoinedUserDoc[],
      page: 0,
      limit: 3,
      isEnd: false,
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
    await this.getUsersBrancher();
  },
  methods: {
    async getUsersBrancher(): Promise<void> {
      this.isAdmin ? await this._getPendingTeachers() : await this._getUserTeacherEdges();
    },
    async _getPendingTeachers(): Promise<void> {
      const { data } = await adminRepository.get({
        path: '/pendingTeachers',
        query: {
          page: this.page,
          limit: this.limit,
        },
        isAbsolutePath: false,
      });
      const { teachers } = data;
      this.users = this.users.concat(teachers);
      this.setIsEnd(teachers);
    },
    async _getUserTeacherEdges(): Promise<void> {
      const { data } = await userRepository.get({
        path: `/users/${this.userData._id}/userTeacherEdges`,
        query: {
          page: this.page,
          limit: this.limit,
        },
        isAbsolutePath: true,
      });
      const { users } = data;
      this.users = this.users.concat(users);
      this.setIsEnd(users);
    },
    async showMore(): Promise<void> {
      this.page++;
      await this.getUsersBrancher();
    },
    getUserType(user: JoinedUserDoc): TranslateResult {
      const isTeacher = 'teacherData' in user;
      const userType = isTeacher
        ? this.$t(`userProfile.teacher.${user.teacherData!.type}`)
        : this.$t('userProfile.student');
      return userType;
    },
    setIsEnd(users: JoinedUserDoc[]): void {
      if (users.length == 0) {
        this.isEnd = true;
      }
    },
  },
});
</script>
