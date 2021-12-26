<template>
  <div data-app>
    <grid-button-layout :step-title="stepTitle">
      <template v-slot:main>
        <div v-cloak class="mt-3" @drop.prevent="setFileToUpload" @dragover.prevent>
          <v-file-input
            v-model="fileToUpload"
            outlined
            dense
            :accept="supportedFileTypes"
          ></v-file-input>
          <p v-show="$v.fileToUpload.$error" class="vuelidate-error ml-6 -mt-3">
            {{ noFileErrorMessage }}
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
  name: 'FileUploadLayout',
  components: { GridBaseLayout, GridButton, GridButtonLayout },
  props: {
    stepTitle: {
      type: String,
      required: true,
    },
    supportedFileTypes: {
      type: String,
      required: true,
    },
    noFileErrorMessage: {
      type: String,
      required: true,
    },
    emittedValueName: {
      type: String,
      required: true,
    },
    cloudFilePath: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      fileToUpload: null as any,
    };
  },
  computed: {},
  mounted() {
    return;
  },
  methods: {
    setFileToUpload(e: any): void {
      this.fileToUpload = e.dataTransfer.files[0];
    },
    async emitStepForward(): Promise<void> {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        const downloadUrl = this._uploadFile();
        EventBus.$emit('step-forward', {
          value: downloadUrl,
          emittedValueName: this.emittedValueName,
        });
      }
    },
    async _uploadFile(): Promise<string> {
      const fileType = this.fileToUpload.type.split('/')[1];
      const metaData = {
        contentType: fileType,
      };
      const { downloadUrl } = await googleCloudStorageRepository.create({
        file: this.fileToUpload,
        metaData,
        cloudFilePath: `${this.cloudFilePath}.${fileType}`,
      });
      return downloadUrl;
    },
  },
  validations: {
    fileToUpload: {
      required,
    },
  },
});
</script>
