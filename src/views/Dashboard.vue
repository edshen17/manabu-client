<template>
  <div v-if="isFinishedOnboarding" class="bg-gray-50 h-auto min-h-screen">
    <div
      class="
        flex
        justify-center
        container
        py-3
        lg:py-7
        mx-auto
        lg:w-full
        xl:w-9/12
        flex-wrap
        lg:flex-nowrap
      "
    >
      <profile-image-card :user-data="userData" class="bg-white max-h-72 max-w-sm" />
      <div class="w-full">
        <package-transaction-cards />
        <appointment-cards />
        <users-card :title="usersCardTitle" :user-data="userData" :is-admin="isAdmin" />
      </div>
    </div>
    <edit-calendar v-if="isTeacher || isAdmin" :user-id="userData._id" />
  </div>
</template>

<script lang="ts">
import AppointmentCards from '@/components/Dashboard/Cards/AppointmentCards.vue';
import PackageTransactionCards from '@/components/Dashboard/Cards/PackageTransactionCards.vue';
import { ls } from '@/store/plugins';
import Vue from 'vue';
import { TranslateResult } from 'vue-i18n';
import { mapGetters } from 'vuex';
import EditCalendar from '@/components/Calendar/EditCalendar.vue';
import UsersCard from '@/components/Dashboard/Cards/UsersCard.vue';
import ProfileImageCard from '@/components/UserProfile/ProfileImageCard.vue';

export default Vue.extend({
  name: 'Dashboard',
  components: {
    EditCalendar,
    ProfileImageCard,
    UsersCard,
    AppointmentCards,
    PackageTransactionCards,
  },
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      userData: 'user/entityStateData',
      isFinishedOnboarding: 'user/isFinishedOnboarding',
      isTeacher: 'user/isTeacher',
      isAdmin: 'user/isAdmin',
    }),
    usersCardTitle: {
      get(): TranslateResult {
        let usersCardTitle;
        if (this.isAdmin) {
          usersCardTitle = this.$t('dashboard.admin.pendingTeachers');
        } else if (this.isTeacher) {
          usersCardTitle = this.$t('dashboard.myStudents');
        } else {
          usersCardTitle = this.$t('dashboard.myTeachers');
        }
        return usersCardTitle;
      },
    },
  },
  async created() {
    if (!this.isFinishedOnboarding) {
      return this.$router.push('/onboarding');
    }
    const paymentData = ls.get('paymentData');
    const { teacher } = paymentData;
    if (paymentData) {
      this.$router.push({ path: `/user/${teacher._id}` });
    }
  },
  methods: {},
});
</script>

<style lang="scss">
.v-current-time {
  height: 2px;
  background-color: #ea4335;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;

  &.first::before {
    content: '';
    position: absolute;
    background-color: #ea4335;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: -5px;
    margin-left: -6.5px;
  }
}
</style>
