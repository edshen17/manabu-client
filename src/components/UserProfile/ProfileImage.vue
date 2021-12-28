<template>
  <div data-app class="flex justify-center items-center">
    <button>
      <label class="flex justify-center items-center text-white relative cursor-pointer">
        <img
          v-show="showProfileImage"
          :src="userData.profileImageUrl"
          class="h-28 rounded-full border-2"
        />
        <preview
          v-show="showPreviewImage"
          class="rounded-full"
          :width="125"
          :height="125"
          :image="profileImage.cropperPreview.image"
          :coordinates="profileImage.cropperPreview.coordinates"
        />
        <i
          class="fas fa-camera text-white absolute opacity-95"
          style="text-shadow: 0 0 4px #000"
        ></i>
        <input
          ref="imageUploader"
          type="file"
          class="hidden"
          name="image"
          accept="image/*"
          @change="onFileSelect($event)"
        />
      </label>
    </button>
    <v-dialog
      v-model="isEditingProfileImage"
      :no-click-animation="true"
      width="700"
      activator="#profile-image-editor"
      @click:outside="resetProfileImage"
    >
      <v-card>
        <v-card-title class="grey lighten-2"
          ><template>
            <div class="flex items-center w-full">
              <button class="mr-3 flex-none" @click="hideModal">
                <i class="fas fa-arrow-left fa-sm"></i>
              </button>
              <p class="flex-grow ml-6">{{ $t('userProfile.common.edit') }}</p>
              <button
                class="float-right flex-none rounded-full px-2 py-1"
                style="background-color: #364f6b; color: #f5f5f5"
                @click="saveProfileImage"
              >
                Save
              </button>
            </div>
          </template></v-card-title
        >
        <div class="items-center flex justify-center static">
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
  },
  mounted() {
    return;
  },
  methods: {
    resetProfileImage(): void {
      this.profileImage.src = '';
    },
    updateCropperPreview(result: any) {
      this.profileImage.cropperPreview = result;
    },
    hideModal(): void {
      this.isEditingProfileImage = false;
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
    saveProfileImage(): void {
      const cropper = (this as any).$refs.extendedCropper.$refs.cropper;
      const { canvas, image } = cropper.getResult();
      if (canvas) {
        canvas.toBlob((blob: Blob): void => {
          this.profileImage.src = image.src;
          this._uploadBlobToStorage(blob);
        });
      }
      this.profileImage.isSaved = true;
      (this as any).$refs.imageUploader.value = '';
      this.hideModal();
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
