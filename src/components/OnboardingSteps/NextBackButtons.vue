<template>
  <div class="flex justify-center w-11/12 lg:w-6/12 mx-auto my-5 md:my-16 text-white">
    <button class="flex-grow bg-blue-600 mr-2 py-2 rounded-md">Back</button>
    <button class="flex-grow bg-green-600 ml-2 py-2 rounded-md">Next</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'NextBackButtons',
  components: {},
  props: {
    // prop: {
    //   type: String,
    //   default: '',
    //   required: true,
    // },
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
