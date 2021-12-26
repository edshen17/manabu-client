<template>
  <file-upload-layout
    :step-title="$t('onboarding.licenseUpload')"
    supported-file-types="image/*, .pdf"
    :no-file-error-message="$t('error.onboarding.licenseUpload')"
    :cloud-file-path="`${userData._id}/images/teacherLicense`"
    emitted-value-name="teacherLicenseUrl"
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
