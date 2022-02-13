<template>
  <left-card-layout v-if="user._id">
    <video v-if="isTeacher" controls class="w-full h-auto">
      <source :src="user.teacherData.introductionVideoUrl" type="video/mp4" />
    </video>
    <div class="flex m-4" :class="{ 'py-5': !isTeacher }">
      <div class="pr-2">
        <img :src="user.profileImageUrl" class="rounded-full w-20" />
      </div>
      <div class="mx-4 flex-1">
        <p class="text-2xl">{{ user.name }}</p>
        <p class="text-sm md:text-base text-gray-400 uppercase tracking-wide my-1">
          {{ userRole }}
        </p>
        <p class="text-gray-400 text-xs md:text-sm">
          {{ $t('userProfile.common.lastOnline', { date: lastOnlineDate }) }}
        </p>
        <div class="mt-1 text-sm md:text-base">
          <div class="flex">
            <p class="mt-1 mr-3 w-28">{{ targetLanguagePrependText }}</p>
            <language-bars
              :language-level="targetLanguage.level"
              :language-code="targetLanguage.code"
            />
          </div>
          <div class="flex">
            <p class="mt-1 mr-3 w-28">{{ $t('userProfile.common.alsoSpeaks') }}</p>
            <language-bars
              :language-level="nonTargetLanguage.level"
              :language-code="nonTargetLanguage.code"
            />
          </div>
        </div>
      </div>
      <button
        v-if="
          isTeacher && isAdmin && user.teacherData.applicationStatus != 'approved' && !hasApproved
        "
        class="w-20 h-10 bg-green-500 rounded-md text-white"
        @click="approveTeacher"
      >
        {{ $t('button.common.approve') }}
      </button>
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
  </left-card-layout>
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
import LeftCardLayout from './Layouts/LeftCardLayout.vue';
import { mapGetters } from 'vuex';
import { makeTeacherRepository } from '@/repositories/teacher';
import { makeUserRepository } from '@/repositories/user';
dayjs.extend(relativeTime);

const teacherRepository = makeTeacherRepository;
const userRepository = makeUserRepository;

export default Vue.extend({
  name: 'ProfileBioCard',
  components: { LanguageBars, LeftCardLayout },
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
    return {
      hasApproved: false,
    };
  },
  computed: {
    ...mapGetters({
      isAdmin: 'user/isAdmin',
    }),
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
  created() {
    if (this.isTeacher) {
      this.hasApproved = this.user.teacherData.applicationStatus == 'approved';
    }
  },
  methods: {
    async approveTeacher(): Promise<void> {
      try {
        this.hasApproved = true;
        await teacherRepository.updateById({
          _id: this.user.teacherData._id,
          updateParams: {
            approvalDate: new Date(),
            applicationStatus: 'approved',
          },
        });
        await userRepository.updateById({
          _id: this.user._id,
          updateParams: {
            role: 'teacher',
          },
        });
      } catch (err) {
        this.hasApproved = false;
        throw err;
      }
    },
  },
});
</script>
