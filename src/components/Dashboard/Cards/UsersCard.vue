<template>
  <long-card v-if="users.length > 0">
    <div>
      <h2 class="text-xl md:text-md font-semibold border-0 border-solid border-b-2 py-2 px-5">
        {{ title }}
      </h2>
      <div class="grid grid-cols-1 divide-y cursor-pointer">
        <router-link
          v-for="user in visibleUsers"
          :key="user._id"
          :to="{ name: 'UserProfile', params: { userId: user._id } }"
        >
          <div class="flex hover:bg-gray-100 px-5 py-3">
            <img :src="user.profileImageUrl" class="rounded-full w-12" />
            <div class="px-3">
              <p>{{ user.name }}</p>
              <p class="uppercase text-sm text-gray-500 tracking-wide">
                {{ getUserType(user) }}
              </p>
            </div>
          </div>
        </router-link>
        <button
          v-if="users.length > 3"
          class="text-center uppercase text-gray-500 text-sm hover:bg-gray-100 py-2 border-solid"
          @click="onButtonClick"
        >
          {{ visibilityButtonText }}
        </button>
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
      showLimit: 3,
      queryLimit: 6,
      pages: 0,
    };
  },
  computed: {
    visibleUsers: {
      get(): JoinedUserDoc[] {
        const usersToShow = this.showLimit * (this.page + 1);
        const usersCopy = this.users.slice();
        const visibleUsers = usersCopy.splice(0, usersToShow);
        return visibleUsers;
      },
    },
    isEnd: {
      get(): boolean {
        const isEnd = this.page > this.pages;
        return isEnd;
      },
    },
    queryPage: {
      get(): number {
        const queryPage = Math.ceil(this.users.length / this.queryLimit);
        return queryPage;
      },
    },
    visibilityButtonText: {
      get(): TranslateResult {
        const visibilityButtonText = this.isEnd
          ? this.$t('button.common.showLess')
          : this.$t('button.common.showMore');
        return visibilityButtonText;
      },
    },
  },
  async created() {
    await this.getUsersBrancher();
  },
  methods: {
    async onButtonClick(): Promise<void> {
      this.isEnd ? (this.page = 0) : await this.showMore();
    },
    async showMore(): Promise<void> {
      if (!this.isEnd) {
        this.page++;
        await this.getUsersBrancher();
      }
    },
    async getUsersBrancher(): Promise<void> {
      this.isAdmin ? await this._getPendingTeachers() : await this._getUserTeacherEdges();
    },
    async _getPendingTeachers(): Promise<void> {
      const { data } = await adminRepository.get({
        path: '/pendingTeachers',
        query: {
          page: this.queryPage,
          limit: this.queryLimit,
        },
        isAbsolutePath: false,
      });
      const { teachers, pages } = data;
      this.users = this.users.concat(teachers);
      this.pages = pages;
    },
    async _getUserTeacherEdges(): Promise<void> {
      const { data } = await userRepository.get({
        path: `/users/${this.userData._id}/userTeacherEdges`,
        query: {
          page: this.queryPage,
          limit: this.queryLimit,
        },
        isAbsolutePath: true,
      });
      const { users, pages } = data;
      this.users = this.users.concat(users);
      this.pages = pages;
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
