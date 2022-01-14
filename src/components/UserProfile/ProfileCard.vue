<template>
  <div class="sm:py-8 shadow-lg rounded-lg w-96 md:w-5/6 md:mx-10 mb-5">
    <profile-image :user-data="userData" />
    <div class="flex flex-col items-center text-center justify-center">
      <h2 class="font-medium title-font mt-4 text-gray-900 text-lg">{{ userData.name }}</h2>
      <!-- <p class="text-base">
        Raclette knausgaard hella meggs normcore williamsburg enamel pin sartorial venmo tbh hot
        chicken gentrify portland.
      </p> -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import LanguageBars from './LanguageBars.vue';
import ProfileImage from './ProfileImage.vue';

export default Vue.extend({
  name: 'ProfileCard',
  components: {
    ProfileImage,
    LanguageBars,
  },
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    // prop: {
    //   get(): any {
    //     return;
    //   },
    // },
  },
  mounted() {
    return;
  },
  methods: {},
});
</script>
