<template>
  <div class="flex justify-center my-5">
    <div class="container px-8">
      <div class="text-center mb-5">
        <h3 class="text-3xl font-semibold leading-normal mb-2 text-gray-800 uppercase">
          Teacher Signup
        </h3>
        <div class="leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase mx-8 lg:text-lg">
          下の５つのステップをよく読んでManabuの先生にご登録下さい。
        </div>
      </div>
      <div
        v-for="(step, index) in stepData"
        :key="step.text"
        class="flex relative pt-10 pb-10 sm:items-center md:w-2/3 mx-auto"
      >
        <div class="h-full w-6 absolute inset-0 flex items-center justify-center">
          <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
        </div>
        <div
          class="
            flex-shrink-0
            w-6
            h-6
            rounded-full
            mt-10
            sm:mt-0
            inline-flex
            items-center
            justify-center
            bg-indigo-500
            text-white
            relative
            z-10
            title-font
            font-medium
            text-sm
          "
        >
          {{ index + 1 }}
        </div>
        <div class="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
          <div class="flex-grow sm:pl-6 sm:mt-0">
            <h2 class="font-medium title-font text-gray-900 mb-1 text-xl">
              {{ step.text }}
            </h2>
          </div>
        </div>
      </div>
      <button
        class="
          mx-auto
          flex
          bg-gray-700
          text-white
          font-bold
          py-2
          px-4
          rounded
          text-center text-lg
          align-middle
          mt-5
          mb-14
        "
      >
        <router-link :to="routerData">Sign up for a teacher account now!</router-link>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { TranslateResult } from 'vue-i18n';
import { makeQueryStringHandler } from '../../../server/components/usecases/utils/queryStringHandler';
import { StringKeyObject } from '../../../server/types/custom';
const queryStringHandler = makeQueryStringHandler;

export default Vue.extend({
  name: 'TeacherSignup',
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {
    stepData: {
      get(): { text: TranslateResult | string }[] {
        return [
          {
            text: 'Sign up for a teacher account now!をクリック、Googleのアカウントでサインアップ',
          },
          {
            text: '資格の有無、話せる言語とレベル、お住まいの国と時間帯、LINEやSkypeやDiscordなどのIDを記入',
          },
          {
            text: '1/1 appointment remainingという部分をクリックし、ご希望の面接の日時を選んでください。',
          },
          {
            text: ' 面接日から２週間後までの予定をカレンダーに１時間単位でドラッグして入れて下さい。',
          },
          {
            text: '面接の日までに、Find a teacher のページから他の先生方を参考に、 アイコン画像、1~2分の自己紹介動画やプロフィールを作成してください。また、名前＋Sensei になるように編集して下さい。(例: Aya Sensei）',
          },
        ];
      },
    },
    routerData: {
      get(): StringKeyObject {
        const state = queryStringHandler.encodeQueryStringObj({
          state: {
            isTeacherApp: true,
          },
        });
        const query = queryStringHandler.parseQueryString(state);
        const routerData = { path: 'signup', query };
        return routerData;
      },
    },
  },
  mounted() {
    return;
  },
  methods: {},
});
</script>
