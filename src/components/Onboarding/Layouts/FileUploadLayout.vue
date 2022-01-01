<template>
  <div data-app>
    <grid-button-layout :step-title="stepTitle">
      <template v-slot:main>
        <v-tooltip :disabled="!isDisabled" bottom>
          <template v-slot:activator="{ on, attrs }">
            <div
              v-cloak
              class="mt-3"
              v-bind="attrs"
              @drop.prevent="setFileToUpload"
              @dragover.prevent
              v-on="on"
            >
              <div :class="{ 'cursor-not-allowed': isDisabled }">
                <v-file-input
                  v-model="fileToUpload"
                  outlined
                  dense
                  :disabled="isDisabled"
                  :accept="supportedFileTypes"
                ></v-file-input>
              </div>
              <p v-show="$v.fileToUpload.$error && !isDisabled" class="vuelidate-error ml-6 -mt-3">
                {{ noFileErrorMessage }}
              </p>
            </div>
          </template>
          <span>{{ disabledTooltipText }}</span>
        </v-tooltip>
      </template>
      <template v-slot:button>
        <grid-button
          :button-text="$t('button.onboarding.next')"
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
import { makeGoogleCloudStorageMixin } from '../../../mixins/googleCloudStorage';

const googleCloudStorageMixin = makeGoogleCloudStorageMixin;

export default Vue.extend({
  name: 'FileUploadLayout',
  components: { GridBaseLayout, GridButton, GridButtonLayout },
  mixins: [googleCloudStorageMixin],
  props: {
    stepTitle: {
      type: String,
      required: true,
    },
    supportedFileTypes: {
      type: String,
      required: true,
    },
    updateParamName: {
      type: String,
      required: true,
    },
    noFileErrorMessage: {
      type: String,
      required: true,
    },
    cloudFilePath: {
      type: String,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabledTooltipText: {
      type: String,
      required: false,
      default: '',
    },
    userData: {
      type: Object,
      required: true,
    },
    repositoryName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      fileToUpload: null as any,
      show: false,
    };
  },
  computed: {},
  watch: {
    isDisabled: function (newVal) {
      if (newVal) {
        this.fileToUpload = null;
      }
    },
  },
  mounted() {
    return;
  },
  methods: {
    setFileToUpload(e: any): void {
      this.fileToUpload = e.dataTransfer.files[0];
    },
    async emitStepForward(): Promise<void> {
      if (!this.isDisabled) {
        this.$v.$touch();
      } else {
        EventBus.$emit('step-forward');
      }
      if (!this.$v.$invalid) {
        await this._uploadFile();
        EventBus.$emit('step-forward');
      }
    },
    async _uploadFile(): Promise<void> {
      const fileType = this.fileToUpload.type.split('/')[1];
      const metaData = {
        contentType: fileType,
      };
      const userId = this.userData._id;
      (this as any).updateUserAfterUpload({
        file: this.fileToUpload,
        metaData,
        cloudFilePath: `${this.cloudFilePath}.${fileType}`,
        userId,
        updateParamName: this.updateParamName,
        repositoryName: this.repositoryName,
      });
    },
  },
  validations: {
    fileToUpload: {
      required,
    },
  },
});
</script>
