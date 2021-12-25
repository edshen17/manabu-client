<template>
  <div data-app>
    <grid-button-layout :step-title="$t('onboarding.licenseUpload')">
      <template v-slot:main>
        <div v-cloak class="mt-3" @drop.prevent="setTeacherLicense" @dragover.prevent>
          <v-file-input
            v-model="teacherLicenseFile"
            outlined
            dense
            accept="image/*, .pdf"
          ></v-file-input>
          <p v-show="$v.teacherLicenseFile.$error" class="vuelidate-error ml-6 -mt-3">
            {{ $t('error.onboarding.licenseUpload') }}
          </p>
        </div>
      </template>
      <template v-slot:button>
        <grid-button
          :button-text="$t('onboarding.buttons.next')"
          class="absolute bottom-0"
          @click="emitStepForward"
        />
      </template>
    </grid-button-layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GridBaseLayout from '../Layouts/GridBaseLayout.vue';
import GridButton from '../Common/GridButton.vue';
import { EventBus } from '../../EventBus/EventBus';
import GridButtonLayout from '../Layouts/GridButtonLayout.vue';
import { required } from 'vuelidate/lib/validators';
import { makeGoogleCloudStorageRepository } from '../../../repositories/googleCloudStorage';

const googleCloudStorageRepository = makeGoogleCloudStorageRepository;

export default Vue.extend({
  name: 'TeacherLicenseStep',
  components: { GridBaseLayout, GridButton, GridButtonLayout },
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      teacherLicenseFile: null as any,
    };
  },
  computed: {},
  mounted() {
    return;
  },
  methods: {
    setTeacherLicense(e: any): void {
      this.teacherLicenseFile = e.dataTransfer.files[0];
    },
    async emitStepForward(): Promise<void> {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        const downloadUrl = this._uploadTeacherLicense();
        EventBus.$emit('step-forward', {
          value: downloadUrl,
          emittedValueName: 'teacherLicenseUrl',
        });
      }
    },
    async _uploadTeacherLicense(): Promise<string> {
      const fileType = this.teacherLicenseFile.type.split('/')[1];
      const metaData = {
        contentType: fileType,
      };
      const { downloadUrl } = await googleCloudStorageRepository.create({
        file: this.teacherLicenseFile,
        metaData,
        uploadedFilePath: `${this.userData._id}/images/teacherLicense.${fileType}`,
      });
      return downloadUrl;
    },
  },
  validations: {
    teacherLicenseFile: {
      required,
    },
  },
});
</script>
