<template>
  <div class="w-full px-3 mx-auto lg:text-white">
    <basic-account-dropdown-link
      :router-links="outerRouterLinks"
      class="my-6 lg:my-2"
      @linkClick="$emit('linkClick')"
    ></basic-account-dropdown-link>
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
    <basic-account-dropdown-link
      :router-links="innerRouterLinks"
      class="my-6 lg:my-2"
      @linkClick="$emit('linkClick')"
    ></basic-account-dropdown-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BasicAccountDropdownLink from './BasicAccountDropdownLink.vue';

export default Vue.extend({
  name: 'BasicAccountDropdown',
  components: {
    BasicAccountDropdownLink,
  },
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
