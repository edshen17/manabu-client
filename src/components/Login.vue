<template>
  <div class="Signup">
    <div class="container">
      <div class="row">
        <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div class="card card-signin my-5 shadow border-0">
            <div class="card-body">
              <h5 class="card-title text-center">{{ $t('login.login') }}</h5>
              <form class="form-signin">
                <div class="form-label-group">
                  <input
                    type="email"
                    id="inputEmail"
                    class="form-control"
                    ref="email"
                    :placeholder="$t('login.email')"
                    v-model="email"
                    @keyup.13="login"
                  />
                  <label for="inputEmail"></label>
                </div>

                <div class="form-label-group">
                  <input
                    type="password"
                    id="inputPassword"
                    class="form-control"
                    :placeholder="$t('login.password')"
                    autocomplete="on"
                    v-model="password"
                    @keyup.13="login"
                  />
                  <label for="inputPassword"></label>
                </div>
              </form>
              <div class="form-signin">
                <button
                  class="btn btn-lg btn-dark btn-block text-uppercase sign-up"
                  @click="login"
                >
                  {{ $t('login.login') }}
                </button>
                <div v-if="errors.length">
                  <ul class="list-group mt-4">
                    <li
                      v-for="(error, i) in errors"
                      :key="i"
                      class="list-group-item list-group-item-danger"
                    >
                      {{ error }}
                    </li>
                  </ul>
                </div>
                <hr class="my-4" />
                <button
                  class="btn btn-lg btn-google btn-block text-uppercase"
                  @click='redirect(GOOGLE_AUTH_URL)'
                >
                  <i class="fab fa-google mr-2"></i> {{$t('login.googleLogin')}}
                </button>
                <!-- <v-facebook-login class="btn btn-lg btn-facebook btn-block text-uppercase" :app-id="appId" :login-options="{ scope: 'email' }" @login="flogin" v-model="model" @sdk-init="handleSdkInit"></v-facebook-login> -->
                <p class="mt-4 float-right">
                  {{$t('login.noAccount')}}
                  <b-link :to="`/signup?state=${encodedQueryParams}`"
                    > {{$t('login.signupHere')}} </b-link
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import LayoutDefault from './layouts/LayoutDefault';
// import VFacebookLogin from 'vue-facebook-login-component'

axios.defaults.withCredentials = true;

export default {
    name: 'Login',
    created() {
    this.$emit('update:layout', LayoutDefault);
    },
    components: {
        // VFacebookLogin
    },
    computed: {
      encodedQueryParams: { // base 64
        get() {
          return this.$store.getters.encodedQueryParams;
        }
      },
      decodedQueryParams: {
        get() {
          return this.$store.getters.decodedQueryParams;
        }
      },
      isTeacherApp: {
        get() {
          return this.decodedQueryParams.isTeacherApp;
        }
      },
      hostedBy: {
        get() {
          return this.decodedQueryParams.hostedBy;
        }
      },
    },
    data() {
        return {
            clientId: process.env.VUE_APP_G_CLIENTID,
            GOOGLE_AUTH_URL: process.env.VUE_APP_GOOGLE_AUTH_URL_DEV,
            appId: process.env.VUE_APP_FACEBOOK_APPID,
            errors: [],
            email: '',
            password: '',
            host: 'api',
            FB: {},
            model: {},
            scope: {}
        }
    },
    mounted() {
      if (!this.$route.query.state) {
        this.$store.commit('setEncodedQueryParams', {});
      }
      this.$refs.email.focus();
    },
    methods: {
      redirect(url){
        window.location.href = `${url}&state=${this.encodedQueryParams}`
      },
      checkForm() {
          this.errors = [];
            if (!this.email || !this.password) {
              this.errors.push('Please fill out all required fields.');
          }

          if (this.password && !this.validEmail(this.email)) {
              this.errors.push('Valid email required.');
          }
      },
      validEmail: function (email) {
          const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(email);
      },
      login() {
          // check if form information is correct
          this.checkForm()

          if (!this.errors.length) { // everything is good
              axios.post('api/login', {
                  email: this.email,
                  password: this.password,
                  isTeacherApp: this.isTeacherApp,
              }).then((res) =>{
                  if (res.status == 200) {
                      this.$router.push({ path: '/dashboard', query: { hostedBy: this.$route.query.hostedBy, }}).catch(err => { });
                  }
              }).catch((err) => { // username/password was wrong
                  this.errors.push(err.response.data);
              });
          }
      },
    }
}
</script>

<style lang="css">
@import "../../src/assets/css/forms.css";
@import "../../src/assets/css/styles.css";
</style>
