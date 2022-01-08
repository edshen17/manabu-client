<template>
  <div class="h-auto mb-10 flex w-auto">
    <div class="mt-4 lg:mt-7">
      <div class="text-center">
        <h3 class="text-3xl font-semibold leading-normal mb-2 text-gray-800 uppercase">
          Teacher Signup
        </h3>
        <div class="leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase mx-8 lg:text-lg">
          下の５つのステップをよく読んでManabuの先生にご登録下さい。
        </div>
      </div>
      <div class="mt-4 text-lg mx-8 lg:mx-56 xl:mx-96">
        <ul class="list-decimal list-inside leading-relaxed">
          <li v-for="step in signUpData" :key="step.text" class="py-3 lg:py-2">{{ step.text }}</li>
        </ul>
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
import LayoutDefault from '../components/LayoutDefault/LayoutDefault.vue';
const queryStringHandler = makeQueryStringHandler;

export default Vue.extend({
  name: 'TeacherSignup',
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {
    signUpData: {
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
  created() {
    this.$emit('update:layout', LayoutDefault);
  },
  methods: {},
});
</script>
