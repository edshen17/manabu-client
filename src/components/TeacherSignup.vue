<template>
  <div class="TeacherApplication">
    <b-container fluid class='h-100'>
      <b-row class='h-100'>
        <b-col>
          <b-row class='h-100'>
            <b-col sm="6" class="text-white text-center left-split">
              <div class='vertical-margin'>
                <span class='text-uppercase d-block'><h2>Teacher sign-up</h2></span>
                <span class=''><h3>左の５つのステップをよく読んでManabuの先生にご登録下さい。</h3></span>
              </div>
            </b-col>
            <b-col sm="6" style="margin-top: calc(13vh) !important;">
              <div v-for="i in 5" :key="i" class='mx-4 mt-4'>
                <span style='font-size: 3rem;' class='mx-3'>{{i}}</span>
                <span style='font-size: 1.7rem ' class='d-inline'>
                  {{listText[i]}}
                </span>
              </div>
              <b-button variant="outline-dark" @click="redirect" class="mx-4 mt-4" style='font-size: 2rem;'>Sign up for a teacher account now!</b-button>
            </b-col>
          </b-row>
          </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import LayoutDefault from './layouts/LayoutDefault';
export default {
    name: 'Dashboard',
    created() {
        this.$emit('update:layout', LayoutDefault);
    },
    data() {
        return {
          listText: {
            1: 'Sign up for a teacher account now!をクリック、Googleのアカウントでサインアップ',
            2: '資格の有無、話せる言語とレベル、お住まいの国と時間帯、LINEやSkypeやDiscordなどのIDを記入',
            3: '1/1 appointment remainingという部分をクリックし、ご希望の面接の日時を選んでください。',
            4: '面接日から２週間後までの予定をカレンダーに１時間単位でドラッグして入れて下さい。',
            5: '面接の日までに、Find a teacher のページから他の先生方を参考に、 アイコン画像、1~2分の自己紹介動画やプロフィールを作成してください。また、名前＋Sensei になるように編集して下さい。(例: Aya Sensei）',
          }
        }
    },
    methods: {
        redirect() {
            this.$router.push('/signup?teacherSignup=true').catch((err) => {})
        }
    },
}
</script>

<style lang="css">
@import "../../src/assets/css/styles.css";
</style>
