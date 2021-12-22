<template>
  <div data-app>
    <grid-button-layout step-title="Please upload your teaching certificate.">
      <template v-slot:main>
        <div v-cloak @drop.prevent="addDropFile" @dragover.prevent>
          <v-file-input v-model="file" outlined dense accept="image/*, .pdf"></v-file-input>
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

export default Vue.extend({
  name: 'TeacherLicenseUpload',
  components: { GridBaseLayout, GridButton, GridButtonLayout },
  data() {
    return {
      file: null as any,
    };
  },
  computed: {},
  mounted() {
    return;
  },
  methods: {
    addDropFile(e: any): void {
      this.file = e.dataTransfer.files[0];
      // upload to google cloud storage
    },
    emitStepForward(): void {
      EventBus.$emit('step-forward');
    },
  },
});
</script>
