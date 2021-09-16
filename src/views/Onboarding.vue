<template>
  <div class="pb-24 lg:h-screen">
    <progress-bar ref="progressBar" class="pt-8 md:pt-10" :step-index="stepIndex" />
    <language-name-step
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
      :step-title="nonTargetLanguageText"
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
    <region-step v-show="stepIndex == 4" />
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

type LanguageOfferings = {
  name: TranslateResult;
  languageCode: string;
  countryCode: string;
  isTeachable: boolean;
}[];

export default Vue.extend({
  name: 'Onboarding',
  components: { ProgressBar, LanguageNameStep, LanguageLevelStep, RegionStep },
  props: {},
  data() {
    return {
      targetLanguageCode: '',
      targetLanguageLevel: '',
      nonTargetLanguageCode: '',
      nonTargetLanguageLevel: '',
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
    nonTargetLanguageText: {
      get(): TranslateResult {
        const nonTargetLanguageText = this.$t('onboarding.speakingNonTargetLanguage');
        return nonTargetLanguageText;
      },
    },
    fluentLanguageText: {
      get(): TranslateResult {
        const fluentLanguageText = this.$t('onboarding.fluentLanguage');
        return fluentLanguageText;
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
  },
  mounted() {
    EventBus.$on('item-clicked', this.handleStepForward());
    EventBus.$on('step-forward', this.handleStepForward());
    EventBus.$on('step-backward', this.handleStepBackward());
  },
  created() {
    this.$emit('update:layout', LayoutDefault);
  },
  methods: {
    handleStepForward(): (payload: EventBusPayload) => void {
      const self = this;
      return function (payload: EventBusPayload) {
        const { value, emittedValueName } = payload;
        self.setData({ propertyName: emittedValueName, value });
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
