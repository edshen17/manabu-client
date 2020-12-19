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
                <input type="email" id="inputEmail" class="form-control" placeholder="Email address" v-model="email">
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
                        <li v-for="error in errors" :key="error" class="list-group-item list-group-item-danger">{{ error }}</li>
                    </ul>
                </div>
              <hr class="my-4">
              <button class="btn btn-lg btn-google btn-block text-uppercase" v-google-signin-button="clientId"><i class="fab fa-google mr-2"></i> Log in with Google</button>
              <button class="btn btn-lg btn-facebook btn-block text-uppercase"><i class="fab fa-facebook-f mr-2"></i> Log in with Facebook</button>
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


export default {
    directives: {
        GoogleSignInButton
    },
    name: 'Login',
    created() {
    this.$emit('update:layout', LayoutDefault);
    },
    data() {
        return {
            clientId: '406805009852-i2g9ccjm8frj23098sp678qnrjn5bmdk.apps.googleusercontent.com',
            errors: [],
            email: '',
            password: '',
            host: 'http://localhost:5000/api',
        }
    },
    mounted() {
       
    },
    methods: {
        checkForm() {
            this.errors = [];
            if (!this.email) {
                this.errors.push('Email required.');
            } 
            
            if (!this.validEmail(this.email)) {
                this.errors.push('Valid email required.');
            } 
            
            if (!this.password) {
                this.errors.push('Password required.');
            }

            if (!this.errors.length) {
                return true;
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
                }).then((res) =>{
                    if (res.status == 200) {
                        localStorage.setItem('token', res.data.token);
                        this.$router.push('/') // change later
                    }
                }).catch((err) => { // username/password was wrong
                    this.errors.push('Incorrect username or password');
                });
            }
        },
        OnGoogleAuthSuccess (idToken) {
            axios.post('http://localhost:5000/api/glogin', {
                idToken
            }).then((res) =>{
                if (res.status == 200) {
                    localStorage.setItem('token', res.data.token);
                    this.$router.push('/') // change later
                }
            }).catch((err) => { // username/password was wrong
                alert(`Something went wrong with Google Authentication! ${err}`);
            });
        },
    OnGoogleAuthFail (err) {
      alert(`Something went wrong with Google Authentication! ${err}`);
    }
    }
}
</script>

<style lang="css">
@import '../../src/assets/css/forms.css';
@import '../../src/assets/css/styles.css';

</style>