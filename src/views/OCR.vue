<template>
  <div>
    <content-uploader />
  </div>
</template>

<script lang="ts">
import ContentUploader from '@/components/Ocr/ContentUploader.vue';
import Vue from 'vue';

export default Vue.extend({
  name: 'Ocr',
  components: { ContentUploader },
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
