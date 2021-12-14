<template>
  <div data-app class="flex justify-center items-center relative">
    <button id="profile-image-editor" class="cursor-pointer">
      <img :src="userData.profileImageUrl" class="rounded-full h-32" />
    </button>
    <v-dialog v-model="showModal" width="700" activator="#profile-image-editor">
      <v-card>
        <v-card-title class="grey lighten-2"
          ><template>
            <div class="flex items-center">
              <button class="mr-3 flex-none"><i class="fas fa-arrow-left fa-sm"></i></button>
              <p class="flex-grow ml-6">Edit Profile Picture</p>
              <button class="float-right flex-none bg-red-400 rounded-full px-2 py-1">Save</button>
            </div>
          </template></v-card-title
        >
        <div class="items-center flex justify-center static">
          <img
            v-show="!isEditingProfileImage"
            :src="userData.profileImageUrl"
            class="rounded-full h-52 relative mb-10"
          />
          <cropper
            v-show="isEditingProfileImage"
            ref="cropper"
            :src="image.src"
            :debounce="false"
            stencil-component="circle-stencil"
            class="overflow-y-hidden"
          />
        </div>
        <!-- <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="hideModal">Cancel</v-btn>
          <v-btn color="primary" text>
            <template>
              <label>
                <i class="fa fa-image"></i> Upload image
                <input
                  ref="file"
                  type="file"
                  style="display: none"
                  name="image"
                  accept="image/*"
                  @change="selectFile($event)"
                />
              </label>
            </template>
          </v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Cropper from '../Cropper/Cropper.vue';

export default Vue.extend({
  name: 'ProfileImage',
  components: { Cropper },
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showModal: false,
      profileImage: {
        original: null,
        updated: null,
        cropperImage: null,
      } as any,
      image: {
        src: '',
        type: '',
      } as any,
      isEditingProfileImage: false,
    };
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
  methods: {
    hideModal(): void {
      this.showModal = false;
    },
    selectFile(event: any) {
      const { files } = event.target;
      if (files && files[0]) {
        if (this.image.src) {
          URL.revokeObjectURL(this.image.src);
        }
        const blob = URL.createObjectURL(files[0]);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.image = {
            src: blob,
            type: this.getMimeType(e.target.result, files[0].type),
          };
        };
        reader.readAsArrayBuffer(files[0]);
        this.isEditingProfileImage = true;
      }
    },
    getMimeType(file: any, fallback = null) {
      const byteArray = new Uint8Array(file).subarray(0, 4);
      let header = '';
      for (let i = 0; i < byteArray.length; i++) {
        header += byteArray[i].toString(16);
      }
      switch (header) {
        case '89504e47':
          return 'image/png';
        case '47494638':
          return 'image/gif';
        case 'ffd8ffe0':
        case 'ffd8ffe1':
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8':
          return 'image/jpeg';
        default:
          return fallback;
      }
    },
  },
});
</script>
