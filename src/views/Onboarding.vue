<template>
  <div class="lg:pb-10 min-h-screen">
    <progress-bar ref="progressBar" class="pt-8 md:pt-10" :step-index="stepIndex" />
    <!-- <language-name-step
      v-show="stepIndex == 0"
      :step-title="targetLanguageText"
      :language-offerings="targetLanguageOfferings"
      emitted-value-name="targetLanguageCode"
    />
    <language-level-step
      v-show="stepIndex == 1"
      :step-title="
        $t('onboarding.languageLevel', { language: $t(`localeCode.${targetLanguageCode}`) })
      "
      emitted-value-name="targetLanguageLevel"
    />
    <language-name-step
      v-show="stepIndex == 2"
      :step-title="$t('onboarding.speakingNonTargetLanguage')"
      :language-offerings="nonTargetLanguageOfferings"
      emitted-value-name="nonTargetLanguageCode"
    />
    <language-level-step
      v-show="stepIndex == 3"
      :step-title="
        $t('onboarding.languageLevel', { language: $t(`localeCode.${nonTargetLanguageCode}`) })
      "
      emitted-value-name="nonTargetLanguageLevel"
    />
    <region-step v-if="stepIndex == 4" :region="region" />
    <timezone-step v-if="stepIndex == 5" :region="region" :timezone="timezone" />
    <contact-method-name-step
      v-show="stepIndex == 6"
      :contact-methods="contactMethods"
      emitted-value-name="contactMethodName"
      :step-title="$t('onboarding.contactMethod')"
    />
    <contact-method-id-step
      v-if="stepIndex == 7"
      :step-title="
        $t('onboarding.contactMethodId', {
          contactMethod: $t(`onboarding.contactMethods.${contactMethodName}`),
        })
      "
      :contact-method-name="contactMethodName"
      :contact-method-id="contactMethodId"
    />
    <profile-image-step
      v-if="stepIndex == 8"
      :step-title="$t('onboarding.userProfile.image')"
      :user-data="userData"
    />
    <profile-bio-step
      v-if="stepIndex == 9"
      :step-title="$t('onboarding.userProfile.bio')"
      emitted-value-name="profileBio"
      :profile-bio="profileBio"
    />
    <teacher-type-step
      v-show="stepIndex == 10"
      :step-title="$t('onboarding.userProfile.teacherType')"
      emitted-value-name="teacherType"
    />
    <teacher-license-step
      v-show="stepIndex == 11"
      :user-data="userData"
      :is-pro-teacher="isProTeacher"
    />
    <teacher-introduction-video-step v-show="stepIndex == 12" :user-data="userData" />
    <teacher-price-data-step v-show="stepIndex == 13" :is-pro-teacher="isProTeacher" /> -->
    <teacher-packages-step :user-data="userData" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import LayoutDefault from '../components/LayoutDefault/LayoutDefault.vue';
import ProgressBar from '../components/ProgressBar/ProgressBar.vue';
import LanguageNameStep from '../components/Onboarding/Steps/LanguageNameStep.vue';
import { TranslateResult } from 'vue-i18n';
import { mapGetters } from 'vuex';
import LanguageLevelStep from '../components/Onboarding/Steps/LanguageLevelStep.vue';
import { EventBus, EventBusPayload } from '../components/EventBus/EventBus';
import RegionStep from '../components/Onboarding/Steps/RegionStep.vue';
import TimezoneStep from '../components/Onboarding/Steps/TimezoneStep.vue';
import ContactMethodNameStep from '../components/Onboarding/Steps/ContactMethodNameStep.vue';
import ContactMethodIdStep from '../components/Onboarding/Steps/ContactMethodIdStep.vue';
import ProfileImageStep from '../components/Onboarding/Steps/ProfileImageStep.vue';
import ProfileBioStep from '../components/Onboarding/Steps/ProfileBioStep.vue';
import TeacherTypeStep from '../components/Onboarding/Steps/TeacherTypeStep.vue';
import TeacherLicenseStep from '../components/Onboarding/Steps/TeacherLicenseStep.vue';
import TeacherIntroductionVideoStep from '../components/Onboarding/Steps/TeacherIntroductionVideoStep.vue';
import TeacherPriceDataStep from '../components/Onboarding/Steps/TeacherPriceDataStep.vue';
import { TEACHER_ENTITY_TYPE } from '../../../server/components/entities/teacher/teacherEntity';
import TeacherPackagesStep from '../components/Onboarding/Steps/TeacherPackagesStep.vue';

type LanguageOfferings = {
  name: TranslateResult;
  languageCode: string;
  countryCode: string;
  isTeachable: boolean;
}[];

export default Vue.extend({
  name: 'Onboarding',
  components: {
    ProgressBar,
    LanguageNameStep,
    LanguageLevelStep,
    RegionStep,
    TimezoneStep,
    ContactMethodNameStep,
    ContactMethodIdStep,
    ProfileImageStep,
    ProfileBioStep,
    TeacherTypeStep,
    TeacherLicenseStep,
    TeacherIntroductionVideoStep,
    TeacherPriceDataStep,
    TeacherPackagesStep,
  },
  props: {},
  data() {
    return {
      targetLanguageCode: '',
      targetLanguageLevel: '',
      nonTargetLanguageCode: '',
      nonTargetLanguageLevel: '',
      region: '',
      timezone: '',
      contactMethodName: '',
      contactMethodId: '',
      profileBio: '',
      teacherType: '',
      teacherLicenseUrl: '',
      teacherIntroductionVideoUrl: '',
      teacherHourlyRate: 0,
      stepIndex: 0,
      stepTotal: 14,
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/entityStateData',
      isTeacher: 'user/isTeacher',
    }),
    targetLanguageText: {
      get(): TranslateResult {
        let targetLanguageText = this.$t('onboarding.learningTargetLanguage');
        if (this.isTeacher) {
          targetLanguageText = this.$t('onboarding.teachingTargetLanguage');
        }
        return targetLanguageText;
      },
    },
    targetLanguageOfferings: {
      get(): LanguageOfferings {
        const targetLanguageOfferings = [
          {
            name: this.$t('localeCode.ja'),
            languageCode: 'ja',
            countryCode: 'jp',
            isTeachable: true,
          },
          {
            name: this.$t('localeCode.en'),
            languageCode: 'en',
            countryCode: 'us',
            isTeachable: true,
          },
          {
            name: this.$t('localeCode.cn'),
            languageCode: 'cn',
            countryCode: 'cn',
            isTeachable: false,
          },
          {
            name: this.$t('localeCode.kr'),
            languageCode: 'kr',
            countryCode: 'kr',
            isTeachable: false,
          },
        ];
        return targetLanguageOfferings;
      },
    },
    nonTargetLanguageOfferings: {
      get(): LanguageOfferings {
        const targetLanguageOfferings = this.targetLanguageOfferings;
        const nonTargetLanguageOfferings = targetLanguageOfferings.filter((languageOffering) => {
          return languageOffering.languageCode != this.targetLanguageCode;
        });
        return nonTargetLanguageOfferings;
      },
    },
    contactMethods: {
      get(): {
        name: TranslateResult;
        iconClass: string;
        backgroundHex: string;
        logoHex: string;
      }[] {
        const contactMethods = [
          {
            name: this.$t('onboarding.contactMethods.skype'),
            value: 'skype',
            iconClass: 'fab fa-skype fa-3x',
            logoHex: '#00AFF0',
            backgroundHex: '#FFF',
          },
          {
            name: this.$t('onboarding.contactMethods.line'),
            iconClass: 'fab fa-line fa-3x',
            value: 'line',
            logoHex: '#00B900',
            backgroundHex: '#FFF',
          },
          {
            name: this.$t('onboarding.contactMethods.discord'),
            iconClass: 'fab fa-discord fa-3x',
            logoHex: '#7289DA',
            value: 'discord',
            backgroundHex: '#FFF',
          },
          {
            name: this.$t('onboarding.contactMethods.zoom'),
            iconClass: 'fas fa-video fa-2x',
            logoHex: '#FFF',
            value: 'zoom',
            backgroundHex: '#2D8CFF',
          },
        ];
        return contactMethods;
      },
    },
    isProTeacher: {
      get(): boolean {
        const isProTeacher = this.teacherType == TEACHER_ENTITY_TYPE.LICENSED;
        return isProTeacher;
      },
    },
  },
  mounted() {
    EventBus.$on('step-forward', this.handleStepForward());
    EventBus.$on('step-backward', this.handleStepBackward());
  },
  created() {
    this.$emit('update:layout', LayoutDefault);
  },
  methods: {
    handleStepForward(): (payload: EventBusPayload) => void {
      const self = this;
      return async function (payload: EventBusPayload): Promise<void> {
        const { value, emittedValueName } = payload || {};
        if (value && emittedValueName) {
          const finalValue = value;
          self.setData({ propertyName: emittedValueName, value: finalValue });
        }
        self.step('forward');
      };
    },
    handleStepBackward(): () => void {
      const self = this;
      return function () {
        self.step('handleStepBackward');
      };
    },
    setData(props: { propertyName: string; value: any }): void {
      const { propertyName, value } = props;
      (this as any)[propertyName] = value;
    },
    step(direction: string): void {
      const isForward = direction == 'forward';
      isForward ? this.stepIndex++ : this.stepIndex--;
      const progressPercent = (this.stepIndex / this.stepTotal) * 100;
      const progressBar = this.$refs.progressBar as any;
      progressBar.setProgressPercent(progressPercent);
    },
  },
});
</script>
