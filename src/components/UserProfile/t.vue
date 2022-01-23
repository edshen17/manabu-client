<template>
  <div>
    <h2>Asynchronous Property</h2>
    <p>{{ myResolvedValue }}</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

function asyncChange() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('Changed Value!'), 1000);
  });
}

export default Vue.extend({
  name: '',
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
  asyncComputed: {
    async myResolvedValue() {
      return await asyncChange();
    },
  },
  mounted() {
    return;
  },
  methods: {},
});
</script>
