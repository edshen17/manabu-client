<template>
  <div class="sm:py-8 shadow-lg rounded-lg mx-10">
    <profile-image :user-data="userData" />
    <!-- <div
      class="
        w-20
        h-20
        rounded-full
        inline-flex
        items-center
        justify-center
        bg-gray-200
        text-gray-400
      "
    >
      <svg
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        class="w-10 h-10"
        viewBox="0 0 24 24"
      >
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    </div> -->
    <div class="flex flex-col items-center text-center justify-center">
      <h2 class="font-medium title-font mt-4 text-gray-900 text-lg">{{ userData.name }}</h2>
      <div class="w-12 h-1 bg-indigo-500 rounded mt-2 mb-4"></div>
      <p class="text-base">
        Raclette knausgaard hella meggs normcore williamsburg enamel pin sartorial venmo tbh hot
        chicken gentrify portland.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ProfileImage from './ProfileImage.vue';

export default Vue.extend({
  name: 'ProfileCard',
  components: {
    ProfileImage,
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
