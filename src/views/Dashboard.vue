<template>
  <div class="bg-gray-50 h-auto min-h-screen">
    <div
      class="
        flex
        justify-center
        container
        py-5
        md:py-10
        mx-auto
        md:w-11/12
        xl:w-9/12
        flex-wrap
        md:flex-nowrap
      "
    >
      <profile-card :user-data="userData" class="bg-white max-h-72" />
      <div>
        <div class="shadow-md rounded-lg bg-white mb-2">
          <p class="leading-relaxed text-base">
            Taxidermy bushwick celiac master cleanse microdosing seitan. Fashion axe four dollar
            toast truffaut, direct trade kombucha brunch williamsburg keffiyeh gastropub tousled
            squid meh taiyaki drinking vinegar tacos.
          </p>
          <div class="flex md:mt-4 mt-6">
            <button
              class="
                inline-flex
                text-white
                bg-indigo-500
                border-0
                py-1
                px-4
                focus:outline-none
                hover:bg-indigo-600
                rounded
              "
            >
              Button
            </button>
            <a class="text-indigo-500 inline-flex items-center ml-4"
              >Learn More
              <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                class="w-4 h-4 ml-2"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>
        <users-card :title="$t('dashboard.admin.pendingTeachers')" />
        <users-card :title="usersCardTitle" />
      </div>
    </div>
    <edit-calendar :user-id="userData._id" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { TranslateResult } from 'vue-i18n';
import { mapGetters } from 'vuex';
import EditCalendar from '../components/Calendar/EditCalendar.vue';
import UsersCard from '../components/Dashboard/Cards/UsersCard.vue';
import LayoutDefault from '../components/LayoutDefault/LayoutDefault.vue';
import ProfileCard from '../components/UserProfile/ProfileCard.vue';

export default Vue.extend({
  name: 'Dashboard',
  components: {
    EditCalendar,
    ProfileCard,
    UsersCard,
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
    }),
    usersCardTitle: {
      get(): TranslateResult {
        const usersCardTitle = this.isTeacher
          ? this.$t('dashboard.myStudents')
          : this.$t('dashboard.myTeachers');
        return usersCardTitle;
      },
    },
  },
  created() {
    this.$emit('update:layout', LayoutDefault);
    // if (!this.isFinishedOnboarding) {
    //   this.$router.push('/onboarding');
    // }
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
