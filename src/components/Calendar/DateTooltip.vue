<template>
  <div></div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'DateTooltip',
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
    console.log((this.$parent as any).$refs.calendar);
  },
  methods: {},
});
</script>
