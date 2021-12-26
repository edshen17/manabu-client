<template>
  <file-upload-layout
    :step-title="$t('onboarding.teacherIntroductionVideoUpload')"
    supported-file-types="video/*, .ogg, mp4, webm"
    :no-file-error-message="$t('error.onboarding.teacherIntroductionVideoUpload')"
    :cloud-file-path="`${userData._id}/videos/introductionVideo`"
    emitted-value-name="teacherIntroductionVideoUrl"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import FileUploadLayout from '../Layouts/FileUploadLayout.vue';

export default Vue.extend({
  name: 'TeacherIntroductionVideoStep',
  components: { FileUploadLayout },
  props: {
    userData: {
      type: Object,
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
