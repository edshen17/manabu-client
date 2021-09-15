<template>
  <div class="pb-24 lg:h-screen">
    <progress-bar ref="progressBar" class="pt-8 md:pt-10" @step-backward="step('backward')" />
    <language-name-step
      v-show="stepIndex == 0"
      :step-title="targetLanguageText"
      :language-offerings="languageOfferings"
      emitted-value-name="targetLanguageName"
    />
    <language-level-step
      v-show="stepIndex == 1"
      :step-title="
        $t('onboarding.languageLevel', { language: $t(`localeCode.${targetLanguageName}`) })
      "
      emitted-value-name="targetLanguageLevel"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import LayoutDefault from '../components/LayoutDefault/LayoutDefault.vue';
import ProgressBar from '../components/ProgressBar/ProgressBar.vue';
import LanguageNameStep from '../components/OnboardingSteps/LanguageNameStep.vue';
import { TranslateResult } from 'vue-i18n';
import { mapGetters } from 'vuex';
import LanguageLevelStep from '../components/OnboardingSteps/LanguageLevelStep.vue';
import { EventBus } from '../components/EventBus/EventBus';

type LanguageOfferings = {
  name: TranslateResult;
  localeCode: string;
  countryCode: string;
  isTeachable: boolean;
}[];

export default Vue.extend({
  name: 'Onboarding',
  components: { ProgressBar, LanguageNameStep, LanguageLevelStep },
  props: {},
  data() {
    return {
      targetLanguageName: '',
      targetLanguageLevel: '',
      stepIndex: 0,
      stepTotal: 10,
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
    fluentLanguageText: {
      get(): TranslateResult {
        const fluentLanguageText = this.$t('onboarding.fluentLanguage');
        return fluentLanguageText;
      },
    },
    languageOfferings: {
      get(): LanguageOfferings {
        const languageOfferings = [
          {
            name: this.$t('localeCode.ja'),
            localeCode: 'ja',
            countryCode: 'jp',
            isTeachable: true,
          },
          {
            name: this.$t('localeCode.en'),
            localeCode: 'en',
            countryCode: 'us',
            isTeachable: true,
          },
          {
            name: this.$t('localeCode.cn'),
            localeCode: 'cn',
            countryCode: 'cn',
            isTeachable: false,
          },
          {
            name: this.$t('localeCode.kr'),
            localeCode: 'kr',
            countryCode: 'kr',
            isTeachable: false,
          },
        ];
        return languageOfferings;
      },
    },
  },
  mounted() {
    EventBus.$on('item-clicked', this.handleStepForward());
    EventBus.$on('step-forward', this.handleStepForward());
  },
  created() {
    this.$emit('update:layout', LayoutDefault);
  },
  methods: {
    handleStepForward(): (payload: { value: any; emittedValueName: string }) => void {
      const self = this;
      return function (payload: { value: any; emittedValueName: string }) {
        const { value, emittedValueName } = payload;
        self.setData({ propertyName: emittedValueName, value });
        self.step('forward');
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
