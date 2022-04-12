<template>
  <div>
    {{ data }}
    <div class="flex items-center justify-center text-center">
      <div
        class="w-full md:w-7/12 min-h-60 relative border-dashed border-2"
        :class="{ 'bg-green-100': isDragOver }"
      >
        <div
          v-if="files.length == 0"
          class="h-full w-full"
          @dragover="dragover"
          @dragleave="dragleave"
          @drop="drop"
        >
          <form enctype="multipart/form-data">
            <input
              ref="fileInput"
              type="file"
              class="cursor-pointer absolute w-full h-full top-0 right-0 bottom-0 left-0 opacity-0 overflow-hidden"
              multiple
              accept=".jpg,.jpeg,.png"
              name="uploadedImages"
              @change="onChange"
            />
          </form>

          <label :class="dropZoneInnerClass" class="min-h-60">
            <div class="flex-col">
              <p>Drop, click, or paste files from clipboard.</p>
            </div>
          </label>
        </div>
        <div v-else :class="dropZoneInnerClass" class="flex-col my-4">
          <ul v-if="files.length" v-cloak class="my-4">
            <li v-for="(file, i) in files" :key="i" class="text-sm p-1">
              {{ file.name }}
              <button
                class="ml-2"
                type="button"
                title="Remove file"
                @click="remove(files.indexOf(file))"
              >
                remove
              </button>
            </li>
          </ul>
          <button class="p-2 my-4 bg-red-600 rounded text-white" @click="files = []">
            Remove All
          </button>
          <button class="p-2 bg-indigo-600 rounded text-white" @click="uploadImages">Upload</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { makeContentRepository } from '@/repositories/content';
import Vue from 'vue';
const contentRepository = makeContentRepository;

export default Vue.extend({
  name: 'ContentUploader',
  components: {},
  data() {
    return {
      files: [] as any[],
      isDragOver: false,
      data: null as any,
    };
  },
  computed: {
    dropZoneInnerClass: {
      get(): string {
        const dropZoneInnerClass = 'flex items-center justify-center h-full w-full text-lg';
        return dropZoneInnerClass;
      },
    },
  },
  mounted() {
    document.addEventListener('paste', this.onPaste);
  },
  destroyed() {
    document.removeEventListener('paste', this.onPaste);
  },
  methods: {
    onChange(): void {
      this.files = [...this.$refs.fileInput.files];
    },
    remove(i: number): void {
      this.files.splice(i, 1);
    },
    dragover(event: any): void {
      event.preventDefault();
      this.isDragOver = true;
    },
    dragleave(): void {
      this.isDragOver = false;
    },
    drop(event: any): void {
      event.preventDefault();
      this.isDragOver = false;
      this.$refs.fileInput.files = event.dataTransfer.files;
      this.onChange();
    },
    async uploadImages(): Promise<void> {
      const headers = {
        'Content-Type': 'multipart/form-data',
      };
      const formData = new FormData();
      for (let key in this.files) {
        formData.append('uploadedImages', this.files[key], this.files[key].name);
      }
      const { data } = await contentRepository.create({
        customResourcePath: '/contents/ocr',
        query: {},
        config: { headers },
        payload: formData,
      });
      this.data = data;
    },
    onPaste(event: any): void {
      const isImage = event.clipboardData.files.length > 0;
      if (isImage) {
        const file = event.clipboardData.files[0];
        this.files = [file];
      }
    },
  },
});
</script>
