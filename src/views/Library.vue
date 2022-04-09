<template>
  <div class="flex">
    <category-explorer />
    <div class="w-full h-full p-8 overflow-y-auto">
      <content-cards />
    </div>
  </div>
</template>

<script lang="ts">
import CategoryExplorer from '@/components/Library/CategoryExplorer.vue';
import ContentCards from '@/components/Library/ContentCards.vue';
import Vue from 'vue';

export default Vue.extend({
  name: 'Osusume',
  components: { ContentCards, CategoryExplorer },
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
