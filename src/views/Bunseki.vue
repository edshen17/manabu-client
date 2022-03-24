<template>
  <div>{{ contentData }}</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { makeContentRepository } from '@/repositories/content';
import { StringKeyObject } from '@server/types/custom';
const contentRepository = makeContentRepository;

export default Vue.extend({
  name: 'Bunseki',
  components: {},
  props: {
    // prop: {
    //   type: String,
    //   default: '',
    //   required: true,
    // },
  },
  data() {
    return {
      contentData: {} as StringKeyObject,
    };
  },
  computed: {
    // prop: {
    //   get(): any {
    //     return;
    //   },
    // },
  },
  async mounted() {
    const { data } = await contentRepository.getById({
      _id: '62361fd26e0ecbf6c65f6000',
      query: {},
    });
    const { content } = data;
    this.contentData = content.summary;
  },
  methods: {},
});
</script>
