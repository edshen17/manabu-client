<template>
  <file-upload-layout
    :step-title="$t('onboarding.teacherLicenseUpload')"
    supported-file-types="image/*, .pdf"
    :no-file-error-message="$t('error.onboarding.teacherLicenseUpload')"
    :cloud-file-path="`${userData._id}/images/teacherLicense`"
    update-param-name="licenseUrl"
    :is-disabled="!isProTeacher"
    :disabled-tooltip-text="$t('onboarding.teacherLicenseUploadTooltip')"
    :user-data="userData"
    repository-name="teacher"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import FileUploadLayout from '../Layouts/FileUploadLayout.vue';

export default Vue.extend({
  name: 'TeacherLicenseStep',
  components: { FileUploadLayout },
  props: {
    userData: {
      type: Object,
      required: true,
    },
    isProTeacher: {
      type: Boolean,
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
