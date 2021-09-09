<template>
  <div class="w-full px-3 mx-auto sm:text-black lg:text-white">
    <div class="mb-6 lg:my-2">
      <span
        v-for="routerLink in outerRouterLinks"
        :key="routerLink.title"
        class="lg:px-2 lg:py-1 lg:hover:bg-gray-600 rounded-md"
      >
        <router-link
          v-show="routerLink.isShowing"
          :to="routerLink.link"
          class="py-4 lg:py-3 lg:px-4 inline-block no-underline"
          >{{ routerLink.title }}</router-link
        >
      </span>
    </div>
    <hr class="border-gray-400 mx-auto lg:hidden" />
    <div class="grid grid-flow-col grid-cols-12">
      <img
        class="
          col-span-3
          md:col-span-2
          lg:col-span-4
          my-4
          mx-4
          lg:mx-5
          h-16
          w-16
          lg:h-20 lg:w-20
          z-10
          block
          rounded-full
          object-cover
        "
        src="https://lh3.googleusercontent.com/a-/AOh14GjQAkMXL_1lf8a8ymoxuR6PJZDhoVMNX8wUejGV=s96-c"
      />
      <div class="col-span-9 my-3 font-semi-bold">
        <p class="text-lg">greencopter4444</p>
        <div class="flex flex-wrap space-x-4 mt-3">
          <p>Level 53</p>
          <span class="border-l-2 border-gray-400"></span>
          <p>Lifetime</p>
        </div>
      </div>
    </div>
    <hr class="border-gray-400 mx-auto" />
    <div class="my-6 lg:my-2">
      <span
        v-for="routerLink in innerRouterLinks"
        :key="routerLink.title"
        class="lg:px-2 lg:py-1 lg:hover:bg-gray-600 rounded-md block cursor-pointer"
      >
        <router-link
          v-show="routerLink.isShowing"
          :to="routerLink.link"
          class="py-4 lg:py-3 lg:px-4 inline-block no-underline w-full h-full"
          >{{ routerLink.title }}</router-link
        >
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'BasicAccountDropdown',
  components: {},
  model: {},
  props: {
    innerRouterLinks: {
      required: false,
      type: Array,
    },
    outerRouterLinks: {
      required: false,
      type: Array,
    },
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {
    return;
  },
  methods: {},
});
</script>
