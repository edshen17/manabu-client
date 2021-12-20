<template>
  <div data-app class="flex justify-center items-center">
    <button>
      <label class="flex justify-center items-center text-white relative cursor-pointer">
        <img v-show="showProfileImage" :src="userData.profileImageUrl" class="h-28 rounded-full" />
        <preview
          v-show="showPreviewImage"
          class="rounded-full"
          :width="125"
          :height="125"
          :image="profileImage.cropperPreview.image"
          :coordinates="profileImage.cropperPreview.coordinates"
        />
        <i class="fas fa-camera text-white opacity-90 absolute"></i>
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
              <p class="flex-grow ml-6">Edit Profile Picture</p>
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
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { IS_PRODUCTION } from '../../../../server/constants';
import { StringKeyObject } from '../../../../server/types/custom';
import { makeUserRepository } from '../../repositories/user';

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
};
const firebaseApp = initializeApp(firebaseConfig);
const firebaseStorage = getStorage(firebaseApp);
const userRepository = makeUserRepository;

export default Vue.extend({
  name: 'ProfileImage',
  components: { ExtendedCropper, Preview },
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
        canvas.toBlob(async (blob: Blob) => {
          this.profileImage.src = image.src;
          if (IS_PRODUCTION) {
            await this._uploadBlobToStorage(blob);
          }
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
      try {
        const storageRef = ref(
          firebaseStorage,
          `images/${this.userData._id}_profilePic.${fileType}`
        );
        await uploadBytes(storageRef, blob, metaData);
        const profileImageUrl = await getDownloadURL(storageRef);
        const { data } = await userRepository.updateById({
          _id: this.userData._id,
          updateParams: { profileImageUrl },
        });
        const { user } = data;
        this.$store.dispatch('user/setEntityStateData', {
          ...user,
        });
      } catch (err: any) {
        throw new Error(err);
      }
    },
  },
});
</script>
