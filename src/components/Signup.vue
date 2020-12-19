<template>
    <div class="Signup">
        <div class="container">
    <div class="row">
      <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div class="card card-signin my-5">
          <div class="card-body">
            <h5 class="card-title text-center">Sign Up</h5>
            <form class="form-signin">
              <div class="form-label-group">
            <div class="form-label-group">
                <input type="name" id="inputName" class="form-control" placeholder="Name" autofocus v-model="name">
                <label for="inputName"></label>
              </div>
                <input type="email" id="inputEmail" class="form-control" placeholder="Email address" v-model="email">
                <label for="inputEmail"></label>
              </div>

              <div class="input-group mb-3">
                <input type="password" id="inputPassword" class="form-control" placeholder="Password" v-model="password" autocomplete="on" aria-label="Password" aria-describedby="basic-addon2">
                <label for="inputPassword"></label>
                <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button" @click="switchVisibility">
                    <i class="fas fa-eye" v-show="showPassword"></i> 
                    <i class="fas fa-eye-slash" v-show="!showPassword"></i>
                </button>
                </div>
                </div>
            </form>
            <div class="form-signin">
            <button class="btn btn-lg btn-dark btn-block text-uppercase sign-up" type="submit" onsubmit="return false" @click="signUp">Sign Up</button>
              <div v-if="errors.length">
                    <ul class="list-group mt-4">
                        <li v-for="error in errors" :key="error" class="list-group-item list-group-item-danger">{{ error }}</li>
                    </ul>
                </div>
              <hr class="my-4">
              <button class="btn btn-lg btn-google btn-block text-uppercase" onsubmit="return false"><i class="fab fa-google mr-2"></i> Continue with Google</button>
              <!-- <button class="btn btn-lg btn-facebook btn-block text-uppercase" onsubmit="return false"><i class="fab fa-facebook-f mr-2"></i> Continue with Facebook</button> -->
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

export default {
    name: 'Signup',
    created() {
    this.$emit('update:layout', LayoutDefault);
    },
    data() {
        return {
            showPassword: false,
            name: '',
            email: '',
            password: '',
            errors: [],
        }
    }, 
    methods: {
        switchVisibility() {
            const passwordField = document.querySelector('#inputPassword');
            if (passwordField.getAttribute('type') === 'password') passwordField.setAttribute('type', 'text');
            else passwordField.setAttribute('type', 'password');
            this.showPassword = !this.showPassword;
        },
        checkForm() {
            this.errors = [];
            if (!this.name || !this.email || !this.password) {
                this.errors.push('Please fill out all required fields.');
            }
            
            if (this.email && !this.validEmail(this.email)) {
                this.errors.push('Valid email required.');
            } 

            if (this.name && !this.validName(this.name)) {
                this.errors.push('Please use the English alphabet and do not include any numbers/special characters in the name field.');
            } 

            if (this.password && !this.validPassword(this.password)) {
                this.errors.push('Your password needs a minimum of 8 characters with at least one capital letter, a number, and a special character.');
            } 
        },
        validEmail: function (email) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        validPassword: function (password) {
          const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
          return re.test(password);
      },
      validName: function(name) {
        const re = /^([a-zA-Z ]){2,30}$/
        return re.test(name);
      },
      signUp() {
            // check if form information is correct
            this.checkForm()
            
            if (!this.errors.length) { // everything is good
                axios.post('http://localhost:5000/api/register', {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                }).then((res) =>{
                    if (res.status == 200) {
                        localStorage.setItem('token', res.data.token);
                        this.$router.go() // change later
                    }
                }).catch((err) => {
                    this.errors.push('A user with that email already exists.');
                });
            }
        },
  }
}
</script>

<style lang="css">
@import '../../src/assets/css/forms.css';
@import '../../src/assets/css/styles.css';

</style>