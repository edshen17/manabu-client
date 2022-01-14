<template>
  <div class="py-8 shadow-lg rounded-lg w-96 md:w-5/6 md:mx-10 mb-5">
    <profile-image :user-data="userData" />
    <div class="flex flex-col items-center text-center justify-center">
      <h2 class="font-medium title-font mt-4 text-gray-900 text-lg">{{ userData.name }}</h2>
      <div class="flex">
        <language-bars
          :language-level="nonTargetLanguage.level"
          :language-code="nonTargetLanguage.language"
          class="mx-3"
        />
        <language-bars
          :language-level="targetLanguage.level"
          :language-code="targetLanguage.language"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { JoinedUserDoc } from '../../../../server/models/User';
import { StringKeyObject } from '../../../../server/types/custom';
import LanguageBars from './LanguageBars.vue';
import ProfileImage from './ProfileImage.vue';

export default Vue.extend({
  name: 'ProfileCard',
  components: {
    ProfileImage,
    LanguageBars,
  },
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    languages: {
      get(): JoinedUserDoc['languages'] {
        const languages = this.userData.languages;
        return languages;
      },
    },
    targetLanguage: {
      get(): StringKeyObject {
        const languages = this.languages;
        const targetLanguage = languages[0];
        return targetLanguage;
      },
    },
    nonTargetLanguage: {
      get(): StringKeyObject {
        const languages = this.languages;
        const nonTargetLanguage = languages[1];
        return nonTargetLanguage;
      },
    },
  },
  mounted() {
    return;
  },
  methods: {},
});
</script>
