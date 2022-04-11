<template>
  <div class="flex items-center justify-center text-center">
    <div
      class="w-full md:w-7/12 min-h-60 relative border-dashed border-2"
      :class="{ 'bg-green-100': isDragOver }"
    >
      <div
        v-if="fileArr.length == 0"
        class="h-full w-full"
        @dragover="dragover"
        @dragleave="dragleave"
        @drop="drop"
      >
        <input
          ref="file"
          type="file"
          class="cursor-pointer absolute w-full h-full top-0 right-0 bottom-0 left-0 opacity-0 overflow-hidden"
          multiple
          accept=".jpg,.jpeg,.png"
          @change="onChange"
        />
        <label :class="dropZoneInnerClass" class="min-h-60">
          <div class="flex-col">
            <p>Drop, click, or paste files from clipboard.</p>
          </div>
        </label>
      </div>
      <div v-else :class="dropZoneInnerClass" class="flex-col my-4">
        <ul v-if="fileArr.length" v-cloak class="my-4">
          <li v-for="file in fileArr" :key="file" class="text-sm p-1">
            {{ file.name }}
            <button
              class="ml-2"
              type="button"
              title="Remove file"
              @click="remove(fileArr.indexOf(file))"
            >
              remove
            </button>
          </li>
        </ul>
        <button class="p-2 my-4 bg-red-600 rounded text-white" @click="fileArr = []">
          Remove All
        </button>
        <button class="p-2 bg-indigo-600 rounded text-white">Upload</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { StringKeyObject } from '@server/types/custom';
import Vue from 'vue';

export default Vue.extend({
  name: 'ContentUploader',
  components: {},
  data() {
    return {
      fileArr: [] as StringKeyObject[],
      isDragOver: false,
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
    return;
  },
  methods: {
    onChange() {
      this.fileArr = [...this.$refs.file.files];
    },
    remove(i: number) {
      this.fileArr.splice(i, 1);
    },
    dragover(event: any) {
      event.preventDefault();
      this.isDragOver = true;
    },
    dragleave() {
      this.isDragOver = false;
    },
    drop(event: any) {
      event.preventDefault();
      this.$refs.file.files = event.dataTransfer.files;
      this.onChange();
      this.isDragOver = false;
    },
  },
});
</script>
