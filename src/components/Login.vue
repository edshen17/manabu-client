<template>
    <div class="Signup">
        <div class="container">
    <div class="row">
      <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div class="card card-signin my-5">
          <div class="card-body">
            <h5 class="card-title text-center">Log in</h5>
            <form class="form-signin">
              <div class="form-label-group">
                <input type="email" id="inputEmail" class="form-control" placeholder="Email address" v-model="email" @keyup.13="login">
                <label for="inputEmail"></label>
              </div>

              <div class="form-label-group">
                <input type="password" id="inputPassword" class="form-control" placeholder="Password" autocomplete="on" v-model="password" @keyup.13="login">
                <label for="inputPassword"></label>
              </div>
            </form>
            <div class="form-signin">
                <button class="btn btn-lg btn-dark btn-block text-uppercase sign-up" @click="login">Log in</button>
                <div v-if="errors.length">
                    <ul class="list-group mt-4">
                        <li v-for="(error, i) in errors" :key="i" class="list-group-item list-group-item-danger">{{ error }}</li>
                    </ul>
                </div>
              <hr class="my-4">
              <button class="btn btn-lg btn-google btn-block text-uppercase" v-google-signin-button="clientId"><i class="fab fa-google mr-2 "></i> Continue with Google</button>
              <!-- <v-facebook-login class="btn btn-lg btn-facebook btn-block text-uppercase" :app-id="appId" :login-options="{ scope: 'email' }" @login="flogin" v-model="model" @sdk-init="handleSdkInit"></v-facebook-login> -->
              <p class="mt-4 float-right">Already have an account? <b-link :to="`/signup?teacherSignup=${isTeacherApp}`">Sign up here</b-link></p>
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
import GoogleSignInButton from 'vue-google-signin-button-directive'
import VFacebookLogin from 'vue-facebook-login-component'

export default {
    directives: {
        GoogleSignInButton,
    },
    name: 'Login',
    created() {
    this.$emit('update:layout', LayoutDefault);
    },
    components: {
        VFacebookLogin
    },
    data() {
        return {
            isTeacherApp: this.$route.query.teacherSignup == 'true',
            clientId: '406805009852-i2g9ccjm8frj23098sp678qnrjn5bmdk.apps.googleusercontent.com',
            appId: '202539034881612',
            errors: [],
            email: '',
            password: '',
            host: 'http://localhost:5000/api',
            FB: {},
            model: {},
            scope: {}
        }
    },
    mounted() {
 
    },
    methods: {
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
                axios.post('http://localhost:5000/api/login', {
                    email: this.email,
                    password: this.password,
                    isTeacherApp: this.isTeacherApp,
                }).then((res) =>{
                    if (res.status == 200) {
                        localStorage.setItem('token', res.data.token);
                        this.$router.go()
                    }
                }).catch((err) => { // username/password was wrong
                    this.errors.push(err.response.data);
                });
            }
        },
        OnGoogleAuthSuccess (idToken) {
            axios.post('http://localhost:5000/api/glogin', {
                idToken, 
                isTeacherApp: this.isTeacherApp,
            }).then((res) =>{
                if (res.status == 200) {
                    localStorage.setItem('token', res.data.token);
                    this.$router.go()
                }
            }).catch((err) => { // username/password was wrong
                this.errors = [];
                this.errors.push('Something went wrong during Google Authentication! If you are using incognito mode, make sure you have enabled cookies.')
            });
        },
    OnGoogleAuthFail (err) {
        this.errors = [];
        this.errors.push('Something went wrong during Google Authentication! If you are using incognito mode, make sure you have enabled cookies.')
    },
    handleSdkInit({ FB, scope }) {
        this.FB = FB
        this.scope = scope
      },

       flogin(res){ // for facebook logins. finish this.fb once https enabled...
            console.log(res)
            this.FB.api('/me', function(response) {
                console.log(JSON.stringify(response));
            });
        },
    }
}
</script>

<style lang="css">
@import '../../src/assets/css/forms.css';
@import '../../src/assets/css/styles.css';

</style>