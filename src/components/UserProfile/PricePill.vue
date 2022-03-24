<template>
  <div
    class="py-1 mt-3 w-24 shadow-md bg-blue-400 no-underline rounded-full text-white font-semibold text-sm text-center"
  >
    {{ price }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'PricePill',
  components: {},
  props: {
    price: {
      type: String,
      required: true,
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
