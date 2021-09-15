<template>
  <div>
    <div
      v-for="routerLink in routerLinks"
      :key="routerLink.title"
      :class="divClass"
      @click="$emit('linkClick')"
    >
      <router-link
        v-show="routerLink.isShowing"
        :to="routerLink.path"
        :class="[routerLinkClass, $route.path == routerLink.path ? activeRouterLinkClass : '']"
        >{{ routerLink.title }}</router-link
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'BasicAccountDropdownLink',
  components: {},
  props: {
    routerLinks: {
      required: false,
      type: Array,
    },
    divClass: {
      required: false,
      type: String,
      default: 'py-4 lg:py-3 lg:px-4 inline-block no-underline w-full h-full text-gray-500',
    },
    routerLinkClass: {
      required: false,
      type: String,
      default: '',
    },
    activeRouterLinkClass: {
      required: false,
      type: String,
      default: 'text-black',
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
