<template>
  <div v-if="user._id" class="rounded-lg shadow-md bg-white">
    <video v-if="isTeacher" controls>
      <source :src="user.teacherData.introductionVideoUrl" type="video/mp4" />
    </video>
    <div class="flex m-4" :class="{ 'py-5': !isTeacher }">
      <div>
        <img :src="user.profileImageUrl" class="rounded-full w-20" />
      </div>
      <div class="mx-4">
        <p class="text-2xl">{{ user.name }}</p>
        <p class="text-sm md:text-base text-gray-400 uppercase tracking-wide my-1">
          {{ userRole }}
        </p>
        <p class="text-gray-400 text-xs md:text-sm">
          {{ $t('userProfile.common.lastOnline', { date: lastOnlineDate }) }}
        </p>
        <div class="mt-1 text-sm md:text-base">
          <div class="flex">
            <p class="mt-1 mr-3 w-20 md:w-24">{{ targetLanguagePrependText }}</p>
            <language-bars
              :language-level="targetLanguage.level"
              :language-code="targetLanguage.code"
            />
          </div>
          <div class="flex">
            <p class="mt-1 mr-3 w-20 md:w-24">{{ $t('userProfile.common.alsoSpeaks') }}</p>
            <language-bars
              :language-level="nonTargetLanguage.level"
              :language-code="nonTargetLanguage.code"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="mx-auto border-0 border-t-2 border-solid">
      <read-more
        class="justify-center px-6 pt-3 pb-6 mx-auto profile-bio"
        :more-str="$t('button.common.showMore')"
        :text="sanitizedProfileBio"
        :less-str="$t('button.common.showLess')"
        :max-chars="200"
      ></read-more>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
import { JoinedUserDoc } from '../../../../server/models/User';
import LanguageBars from './LanguageBars.vue';
import relativeTime from 'dayjs/plugin/relativeTime';
import { TranslateResult } from 'vue-i18n';
import DOMPurify from 'dompurify';
import { StringKeyObject } from '../../../../server/types/custom';

dayjs.extend(relativeTime);

export default Vue.extend({
  name: 'ProfileBioCard',
  components: { LanguageBars },
  props: {
    user: {
      type: Object,
      required: true,
    },
    isTeacher: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    lastOnlineDate: {
      get(): string {
        const lastOnlineDate = dayjs().to(dayjs(this.user.lastOnlineDate));
        return lastOnlineDate;
      },
    },
    userRole: {
      get(): TranslateResult {
        const userRole = this.isTeacher
          ? this.$t(`userProfile.teacher.${this.user.teacherData!.type}`)
          : this.$t('userProfile.role.user');
        return userRole;
      },
    },
    sanitizedProfileBio: {
      get(): string {
        const sanitizedProfileBio = DOMPurify.sanitize(this.user.profileBio!);
        return sanitizedProfileBio;
      },
    },
    languages: {
      get(): JoinedUserDoc['languages'] {
        const languages = this.user.languages;
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
    targetLanguagePrependText: {
      get(): TranslateResult {
        const targetLanguagePrependText = this.isTeacher
          ? this.$t('userProfile.teacher.teaches')
          : this.$t('userProfile.learning');
        return targetLanguagePrependText;
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
  async mounted() {
    return;
  },
  methods: {},
});
</script>
