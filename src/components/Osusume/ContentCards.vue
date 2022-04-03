<template>
  <div>
    <div v-for="content of contents" :key="content._id">
      {{ content.title }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
// import lzString from 'lz-string';

export default Vue.extend({
  name: 'ContentCards',
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
    ...mapGetters({
      contents: 'content/entityStateData',
    }),
  },
  // watch: {
  //   prop: function () {},
  // },
  methods: {},
});
</script>
