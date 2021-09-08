<template>
  <div>
    <transition
      name="fade"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <slot />
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'FadeInOut',
  components: {},
  model: {},
  props: {},
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
