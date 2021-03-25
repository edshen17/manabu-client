<template>
  <div class="TeacherApplication">
    <b-container fluid class="mt-4">
      <b-row>
        <b-col></b-col>
        <b-col sm="8">
        <b-card-body class="mb-3 shadow border-0">
        <b-card-title><b>MANABU</b> - <span class="light-bold">学びをチカラに</span></b-card-title>
        <b-card-text>         
          <p class="jp-text">
            先生の募集にご興味をお持ちいただきありがとうございます。Manabuはシンガポールの小さなコミュニティーから始まった会社です。シンガポール在住の日本人が集まってボランティアで日本語を教えていましたが、徐々に拡大して会社を組織するに至りました。人と人との関わりを第一に、コミュニケーションを大切にしながら育ってきたグループです。是非あなたも一緒に日本語や日本の文化を世界に広めて、グローバルに活躍して下さい！Manabuはグローバルに働く先生方を全力で応援します。
          </p>
          <p class="jp-text">
              1. Sign up for a Teacher account now!をクリック、Googleのアカウントなどでサインアップ<br>
              2. 資格の有無、話せる言語とレベル、お住まいの国と時間帯、LINEやSkypeやDiscordなどのIDを記入<br>
              3. 1/1 appointment remainingという部分をクリックし、ご希望の面接の日時を選んでください。<br>
              4. 面接の日までにできる範囲で構いませんので自己紹介動画やプロフィールを記入してお待ちください。(ガイドを参考にしてください。)
          </p>
        </b-card-text>
          <b-button variant="outline-dark" @click="redirect" class="mt-2">Sign up for a Teacher Account now!</b-button>

        </b-card-body>         
          </b-col
        >
        <b-col></b-col>
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
