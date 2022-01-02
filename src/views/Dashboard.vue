<template>
  <div>
    <calendar :user-id="userData._id" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import Calendar from '../components/Calendar/Calendar.vue';
import LayoutDefault from '../components/LayoutDefault/LayoutDefault.vue';

export default Vue.extend({
  name: 'Dashboard',
  components: {
    Calendar,
  },
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      userData: 'user/entityStateData',
      isFinishedOnboarding: 'user/isFinishedOnboarding',
    }),
  },
  created() {
    this.$emit('update:layout', LayoutDefault);
    if (!this.isFinishedOnboarding) {
      this.$router.push('/onboarding');
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
