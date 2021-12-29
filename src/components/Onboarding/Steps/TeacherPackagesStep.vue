<template>
  <div>
    {{ teacherPackages }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'TeacherPackagesStep',
  components: {},
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      teacherPackages: 'user/teacherPackages',
    }),
  },
  mounted() {
    return;
  },
  methods: {},
});
</script>
