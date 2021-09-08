<template>
  <div class="flex flex-wrap mx-auto h-96"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import LayoutDefault from '../components/LayoutDefault.vue';

export default Vue.extend({
  name: '',
  components: {},
  model: {},
  props: {},
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
  created() {
    this.$emit('update:layout', LayoutDefault);
  },
  methods: {},
});
</script>
