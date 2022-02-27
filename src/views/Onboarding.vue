<template>
  <div class="lg:pb-10 min-h-screen">
    <progress-bar
      class="pt-8 md:pt-10 mb-3 md:mb-7"
      :step-index="stepIndex"
      :step-total="stepTotal"
    />
    <name-step v-if="stepIndex == 0" :user-data="userData" :name="name" />
    <language-name-step
      v-show="stepIndex == 1"
      :step-title="targetLanguageText"
      :language-offerings="targetLanguageOfferings"
      :emitted-value-name="'targetLanguageCode'"
    />
    <language-level-step
      v-show="stepIndex == 2"
      :step-title="
        $t('onboarding.languageLevel', { language: $t(`localeCode.${targetLanguageCode}`) })
      "
      emitted-value-name="targetLanguageLevel"
    />
    <language-name-step
      v-show="stepIndex == 3"
      :step-title="$t('onboarding.speakingNonTargetLanguage')"
      :language-offerings="nonTargetLanguageOfferings"
      :emitted-value-name="'nonTargetLanguageCode'"
    />
    <language-level-step
      v-show="stepIndex == 4"
      :step-title="
        $t('onboarding.languageLevel', { language: $t(`localeCode.${nonTargetLanguageCode}`) })
      "
      emitted-value-name="nonTargetLanguageLevel"
    />
    <region-step v-if="stepIndex == 5" :region="region" :user-data="userData" />
    <timezone-step
      v-if="stepIndex == 6"
      :region="region"
      :timezone="timezone"
      :user-data="userData"
    />
    <contact-method-name-step
      v-show="stepIndex == 7"
      :step-title="$t('onboarding.contactMethod')"
    />
    <contact-method-id-step
      v-if="stepIndex == 8"
      :step-title="
        $t('onboarding.contactMethodId', {
          contactMethod: $t(`contactMethod.${contactMethodName}`),
        })
      "
      :contact-method-name="contactMethodName"
      :contact-method-id="contactMethodId"
      :user-data="userData"
    />
    <profile-image-step
      v-if="stepIndex == 9"
      :step-title="$t('onboarding.userProfile.image')"
      :user-data="userData"
    />
    <profile-bio-step
      v-if="stepIndex == 10"
      :step-title="$t('onboarding.userProfile.bio')"
      :profile-bio="profileBio"
      :user-data="userData"
    />
    <div v-show="isTeacher">
      <teacher-type-step
        v-show="stepIndex == 11"
        :step-title="$t('onboarding.userProfile.teacherType')"
      />
      <teacher-license-step
        v-if="stepIndex == 12"
        :user-data="userData"
        :is-pro-teacher="isProTeacher"
      />
      <teacher-introduction-video-step v-if="stepIndex == 13" :user-data="userData" />
      <teacher-price-data-step
        v-if="stepIndex == 14"
        :is-pro-teacher="isProTeacher"
        :user-data="userData"
        :hourly-rate="teacherHourlyRate"
      />
      <payment-email-step
        v-if="stepIndex == 15"
        :user-data="userData"
        :payout-email="payoutEmail"
      />
      <teacher-packages-step v-show="stepIndex == 16" :user-data="userData" />
    </div>
    <async-loader v-show="isFinishedOnboarding" :progress-percent="uploadProgress" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
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
import TeacherPackagesStep from '../components/Onboarding/Steps/TeacherPackagesStep.vue';
import { TEACHER_ENTITY_TYPE } from '../../../server/components/entities/teacher/teacherEntity';
import { makeUpdateUserByIdMixin } from '../mixins/updateUserById';
import { REPOSITORY_NAME } from '../repositories/abstractions/IRepository';
import { DEFAULT_CURRENCY } from '../../../server/constants';
import { StringKeyObject } from '../../../server/types/custom';
import { makePackageRepository } from '../repositories/package';
import { PACKAGE_ENTITY_TYPE } from '../../../server/components/entities/package/packageEntity';
import AsyncLoader from '../components/Onboarding/Steps/AsyncLoader.vue';
import NameStep from '../components/Onboarding/Steps/NameStep.vue';
import PaymentEmailStep from '../components/Onboarding/Steps/PaymentEmailStep.vue';

const updateUserByIdMixin = makeUpdateUserByIdMixin;
const packageRepository = makePackageRepository;

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
    NameStep,
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
    AsyncLoader,
    PaymentEmailStep,
  },
  mixins: [updateUserByIdMixin],
  props: {},
  data() {
    return {
      name: '',
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
      teacherHourlyRate: 0,
      teacherPackages: [] as StringKeyObject[],
      payoutEmail: '',
      stepIndex: 0,
      uploadProgress: 0,
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/entityStateData',
      isTeacher: 'user/isTeacher',
    }),
    stepTotal: {
      get(): number {
        const stepTotal = !this.isTeacher ? 11 : 17;
        return stepTotal;
      },
    },
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
    isProTeacher: {
      get(): boolean {
        const isProTeacher = this.teacherType == TEACHER_ENTITY_TYPE.LICENSED;
        return isProTeacher;
      },
    },
    isFinishedOnboarding: {
      get(): boolean {
        const isFinishedOnboarding = this.stepTotal == this.stepIndex;
        return isFinishedOnboarding;
      },
    },
  },
  watch: {
    stepIndex: async function (): Promise<void> {
      if (this.isFinishedOnboarding) {
        this.uploadProgress += 25;
        await this.updateUserData();
        this.uploadProgress += 25;
        if (this.isTeacher) {
          await this.updateTeacherData();
        } else {
          this.uploadProgress += 50;
        }
        this.$router.push('/dashboard');
      }
    },
  },
  created() {
    EventBus.$on('step-forward', this.handleStepForward());
    EventBus.$on('step-backward', this.handleStepBackward());
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
    },
    async updateUserData(): Promise<void> {
      await (this as any).updateUserById({
        userId: this.userData._id,
        updateParams: {
          name: this.name || this.userData.name,
          contactMethods: [
            {
              name: this.contactMethodName,
              address: this.contactMethodId,
              isPrimaryMethod: true,
              type: 'online',
            },
          ],
          languages: [
            { code: this.targetLanguageCode, level: this.targetLanguageLevel },
            { code: this.nonTargetLanguageCode, level: this.nonTargetLanguageLevel },
          ],
          profileBio: this.profileBio,
          region: this.region,
          timezone: this.timezone,
        },
        repositoryName: REPOSITORY_NAME.USER,
      });
    },
    async updateTeacherData(): Promise<void> {
      await (this as any).updateUserById({
        userId: this.userData._id,
        teacherId: this.userData.teacherData._id,
        updateParams: {
          teachingLanguages: [{ code: this.targetLanguageCode, level: this.targetLanguageLevel }],
          alsoSpeaks: [{ code: this.nonTargetLanguageCode, level: this.nonTargetLanguageLevel }],
          type: this.teacherType,
          priceData: {
            hourlyRate: this.teacherHourlyRate,
            currency: DEFAULT_CURRENCY,
          },
          settings: {
            ...this.userData.teacherData.settings,
            payoutData: {
              email: this.payoutEmail,
            },
          },
        },
        repositoryName: REPOSITORY_NAME.TEACHER,
      });
      this.uploadProgress += 25;
      await this.updatePackageData();
    },
    async updatePackageData(): Promise<void> {
      const promiseArr = [];
      for (const pkg of this.teacherPackages) {
        const { _id, name, isOffering, lessonAmount, lessonDurations, type } = pkg;
        const updateParams: StringKeyObject = {
          isOffering,
          lessonDurations,
        };
        if (type == PACKAGE_ENTITY_TYPE.CUSTOM) {
          updateParams.name = name;
          updateParams.lessonAmount = lessonAmount;
        }
        const promise = packageRepository.updateById({
          _id,
          updateParams,
        });
        promiseArr.push(promise);
      }
      this.uploadProgress += 25;
      await Promise.all(promiseArr);
    },
  },
});
</script>
