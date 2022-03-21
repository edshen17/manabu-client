<template>
  <div data-app class="flex justify-center items-center">
    <v-dialog
      v-model="showDialog"
      :no-click-animation="true"
      width="700"
      @click:outside="resetProfileImage"
    >
      <template #activator="{ on, attrs }">
        <button v-bind="attrs" v-on="on">
          <img
            v-show="showProfileImage"
            :src="userData.profileImageUrl"
            class="h-28 rounded-full"
          />
          <preview
            v-show="showPreviewImage"
            class="rounded-full"
            :width="125"
            :height="125"
            :image="profileImage.cropperPreview.image"
            :coordinates="profileImage.cropperPreview.coordinates"
          />
        </button>
      </template>
      <v-card>
        <v-card-title class="grey lighten-2"
          ><template>
            <div class="flex items-center w-full">
              <button class="flex-none" @click="resetProfileImage">
                <i class="fas fa-arrow-left fa-sm mr-0 md:mr-2"></i>
              </button>
              <p class="flex-grow ml-6 text-sm md:text-xl">
                {{ $t('userProfile.common.profilePicture') }}
              </p>
              <button
                class="float-right flex-none rounded-full px-2 py-1 text-sm md:text-lg"
                style="background-color: #364f6b; color: #f5f5f5"
                @click="onDialogButtonClick"
              >
                {{ dialogButtonText }}
              </button>
            </div>
          </template></v-card-title
        >
        <div class="items-center flex justify-center">
          <input
            ref="imageUploader"
            type="file"
            class="hidden"
            name="image"
            accept="image/*"
            @input="onFileSelect($event)"
          />
          <span v-show="showProfileImage" class="items-center flex justify-center h-96">
            <img :src="userData.profileImageUrl" class="h-48 rounded-full" />
          </span>
          <extended-cropper
            v-show="isEditingProfileImage"
            ref="extendedCropper"
            :src="profileImage.src"
            :debounce="false"
            stencil-component="circle-stencil"
            class="overflow-y-hidden"
            @change="updateCropperPreview"
          />
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ExtendedCropper from '../Cropper/ExtendedCropper.vue';
import { Preview } from 'vue-advanced-cropper';
import { StringKeyObject } from '../../../../server/types/custom';
import { makeGoogleCloudStorageMixin } from '../../mixins/googleCloudStorage';
import { TranslateResult } from 'vue-i18n';
const googleCloudStorageMixin = makeGoogleCloudStorageMixin;

export default Vue.extend({
  name: 'ProfileImage',
  components: { ExtendedCropper, Preview },
  mixins: [googleCloudStorageMixin],
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      profileImage: {
        src: '',
        cropperPreview: {},
        isSaved: false,
      } as StringKeyObject,
      isEditingProfileImage: false,
      showDialog: false,
    };
  },
  computed: {
    showProfileImage: {
      get(): boolean {
        return !this.isEditingProfileImage && !this.profileImage.isSaved;
      },
    },
    showPreviewImage: {
      get(): boolean {
        return this.isEditingProfileImage || this.profileImage.isSaved;
      },
    },
    dialogButtonText: {
      get(): TranslateResult {
        const dialogButtonText = this.isEditingProfileImage
          ? this.$t('button.common.save')
          : this.$t('button.common.upload');
        return dialogButtonText;
      },
    },
  },
  mounted() {
    return;
  },
  methods: {
    resetProfileImage(): void {
      this.profileImage = {
        src: '',
        cropperPreview: {},
        isSaved: false,
      };
      this.isEditingProfileImage = false;
      this.showDialog = false;
      (this as any).$refs.imageUploader.value = '';
    },
    updateCropperPreview(result: any) {
      this.profileImage.cropperPreview = result;
    },
    onDialogButtonClick(): void {
      if (!this.isEditingProfileImage) {
        (this as any).$refs.imageUploader.click();
      } else {
        this._saveProfileImage();
      }
    },
    onFileSelect(event: any) {
      const { files } = event.target;
      if (files && files[0]) {
        if (this.profileImage.src) {
          URL.revokeObjectURL(this.profileImage.src);
        }
        const blob = URL.createObjectURL(files[0]);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.profileImage.src = blob;
        };
        reader.readAsArrayBuffer(files[0]);
        this.isEditingProfileImage = true;
      }
    },
    _saveProfileImage(): void {
      const cropper = (this as any).$refs.extendedCropper.$refs.cropper;
      const { canvas, image } = cropper.getResult();
      if (canvas) {
        canvas.toBlob((blob: Blob): void => {
          this.profileImage.src = image.src;
          this._uploadBlobToStorage(blob);
        });
      }
      this.profileImage.isSaved = true;
      this.resetProfileImage();
    },
    async _uploadBlobToStorage(blob: Blob): Promise<void> {
      const blobType = blob.type;
      const metaData = {
        contentType: blobType,
      };
      const fileType = blob.type.split('/')[1];
      const userId = this.userData._id;
      (this as any).updateUserAfterUpload({
        file: blob,
        metaData,
        cloudFilePath: `${userId}/images/profileImage.${fileType}`,
        userId,
        updateParamName: 'profileImageUrl',
        repositoryName: 'user',
      });
    },
  },
});
</script>
