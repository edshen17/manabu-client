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
          h-16
          w-16
          z-10
          block
          rounded-full
          object-cover
        "
        :src="userData.profileImageUrl"
      />
      <div class="col-span-9 my-3 mx-6 md:mx-0 font-semi-bold">
        <p class="text-lg">{{ userData.name }}</p>
        <div class="flex flex-wrap space-x-4 mt-3 items-center">
          <p class="capitalize">{{ $t(`userProfile.role.${userData.role}`) }}</p>
          <p class="text-lg">ฅ^•ﻌ•^ฅ</p>
        </div>
      </div>
    </div>
    <hr class="border-gray-400 mx-auto" />
    <basic-account-dropdown-link
      :router-links="innerRouterLinks"
      class="mt-6 lg:my-2"
      :router-link-class="routerLinkClass"
      :active-router-link-class="activeRouterLinkClass"
      @linkClick="$emit('linkClick')"
    ></basic-account-dropdown-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import BasicAccountDropdownLink from './BasicAccountDropdownLink.vue';

export default Vue.extend({
  name: 'BasicAccountDropdown',
  components: {
    BasicAccountDropdownLink,
  },
  props: {
    innerRouterLinks: {
      required: false,
      type: Array,
    },
    outerRouterLinks: {
      required: false,
      type: Array,
    },
    routerLinkClass: {
      required: false,
      type: String,
    },
    activeRouterLinkClass: {
      required: false,
      type: String,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      userData: 'user/entityStateData',
    }),
  },
  mounted() {
    return;
  },
  methods: {},
});
</script>
