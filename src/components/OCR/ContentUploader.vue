<template>
  <div>
    <vue-topprogress ref="topProgress"></vue-topprogress>
    <div v-if="!url" class="mx-auto w-11/12 md:w-10/12 lg:w-6/12 pt-4 md:pt-10">
      <div class="flex pt-4">
        <div class="w-full">
          <div>
            <ul class="list-disc pl-5">
              <li v-for="point in bulletedData" :key="point" class="mb-4 text-lg text-gray-600">
                {{ point }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <section v-if="url" class="text-gray-600 body-font overflow-hidden">
      <div class="container py-24">
        <div class="lg:w-full mx-auto flex flex-wrap justify-center">
          <img
            alt="preview"
            :src="url"
            class="object-scale-down rounded border-2 max-w-7xl lg:w-1/2 max-h-96"
          />
          <div class="lg:w-1/2 w-full px-10">
            <p class="text-gray-900 text-3xl title-font font-medium mb-1">
              {{ extractedText }}
            </p>
            <button @click="isTranslationBlurred = !isTranslationBlurred">
              <p
                class="leading-relaxed text-xl py-5 filter"
                :class="{ 'blur-sm': isTranslationBlurred }"
              >
                {{ translatedText }}
              </p>
            </button>
          </div>
        </div>
      </div>
    </section>

    <div v-if="files.length == 0" class="flex items-center justify-center text-center my-40">
      <div
        class="w-full md:w-7/12 min-h-60 relative border-dashed border-2"
        :class="{ 'bg-green-100': isDragOver }"
      >
        <div class="h-full w-full" @dragover="dragover" @dragleave="dragleave" @drop="drop">
          <form enctype="multipart/form-data">
            <input
              ref="fileInput"
              type="file"
              class="cursor-pointer absolute w-full h-full top-0 right-0 bottom-0 left-0 opacity-0 overflow-hidden"
              accept=".jpg,.jpeg,.png"
              name="uploadedImages"
              @change="onChange"
            />
          </form>

          <label :class="dropZoneInnerClass" class="min-h-60">
            <div class="flex-col">
              <p>Drop, click, or paste file from clipboard.</p>
            </div>
          </label>
        </div>
        <!-- <div v-else :class="dropZoneInnerClass" class="flex-col my-4">
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
        </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mixpanel } from '@/plugins/mixpanel';
import { makeContentRepository } from '@/repositories/content';
import { StringKeyObject } from '@server/types/custom';
import Vue from 'vue';
import { vueTopprogress } from 'vue-top-progress';
import { TranslateResult } from 'vue-i18n';
import translate from 'deepl';

const contentRepository = makeContentRepository;

export default Vue.extend({
  name: 'ContentUploader',
  components: { vueTopprogress },
  data() {
    return {
      files: [] as any[],
      isDragOver: false,
      ocrContents: [] as StringKeyObject[],
      url: '',
      extractedText: '',
      isTranslationBlurred: true,
    };
  },
  asyncComputed: {
    translatedText: {
      async get(): Promise<any> {
        if (this.extractedText) {
          const { data } = await translate({
            text: this.extractedText.replace(/[\r\n]+/gms, ''),
            target_lang: 'EN-US',
            auth_key: process.env.VUE_APP_DEEPL_AUTH_KEY!,
            free_api: true,
          });
          const { translations } = data;
          const translatedText = translations[0].text;
          return translatedText;
        }
      },
    },
  },
  computed: {
    dropZoneInnerClass: {
      get(): string {
        const dropZoneInnerClass = 'flex items-center justify-center h-full w-full text-lg';
        return dropZoneInnerClass;
      },
    },
    bulletedData: {
      get(): TranslateResult[] {
        const bulletedData = [
          'Upload an image and Manabu will output text found in that image (OCR + translations)',
          'Use screenshotting tools to copy/paste images. You can paste files any time you want',
          'Works best on smaller images, so make sure to screenshot only the text parts',
          'We will be adding new features soon, including Anki integration, saving upload data, and more',
          'We would love to hear your feedback. Contact us at support@manabu.sg',
        ];
        return bulletedData;
      },
    },
  },
  mounted() {
    document.addEventListener('paste', this.onPaste);
    mixpanel.track('OCR');
  },
  destroyed() {
    document.removeEventListener('paste', this.onPaste);
  },
  methods: {
    onChange(): void {
      this.files = [...(this.$refs.fileInput as any).files];
      this.renderImages();
      this.uploadImages();
    },
    // remove(i: number): void {
    //   this.files.splice(i, 1);
    // },
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
      (this.$refs.fileInput as any).files = event.dataTransfer.files;
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
      (this as any).$refs.topProgress.start();
      const { data } = await contentRepository.create({
        customResourcePath: '/contents/ocr',
        query: {},
        config: { headers },
        payload: formData,
      });
      const { ocrContents } = data;
      this.ocrContents = ocrContents;
      (this as any).$refs.topProgress.done();
      this.extractText();
      mixpanel.track('OCR Upload', { ocrContents });
    },
    renderImages(): void {
      for (const file of this.files) {
        this.url = URL.createObjectURL(file);
      }
    },
    onPaste(event: any): void {
      const isImage = event.clipboardData.files.length > 0;
      if (isImage) {
        const file = event.clipboardData.files[0];
        this.files = [file];
        this.renderImages();
        this.uploadImages();
      }
    },
    extractText(): void {
      if (this.ocrContents.length > 0) {
        this.extractedText = this.ocrContents[0][0][0].description;
      }
    },
  },
});
</script>
