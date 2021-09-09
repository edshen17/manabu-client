<template>
  <div>
    <div
      v-for="routerLink in routerLinks"
      :key="routerLink.title"
      :class="divClass"
      @click="$emit('linkClick')"
    >
      <span :class="{ 'text-purple-400': $route.path == routerLink.link }">
        <router-link v-show="routerLink.isShowing" :to="routerLink.link" :class="routerLinkClass">{{
          routerLink.title
        }}</router-link>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'BasicAccountDropdownLink',
  components: {},
  model: {},
  props: {
    routerLinks: {
      required: false,
      type: Array,
    },
    divClass: {
      required: false,
      type: String,
      default: 'py-4 lg:py-3 lg:px-4 inline-block no-underline w-full h-full',
    },
    routerLinkClass: {
      required: false,
      type: String,
      default:
        'py-4 lg:py-3 lg:px-4 inline-block no-underline w-full h-full lg:hover:bg-gray-700 lg:rounded-md',
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
