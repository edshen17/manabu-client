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
                <input type="name" id="inputName" class="form-control" placeholder="Name" autofocus>
                <label for="inputName"></label>
              </div>
                <input type="email" id="inputEmail" class="form-control" placeholder="Email address">
                <label for="inputEmail"></label>
              </div>

              <div class="input-group mb-3">
                <input type="password" id="inputPassword" class="form-control" placeholder="Password" aria-label="Password" aria-describedby="basic-addon2">
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
            <button class="btn btn-lg btn-dark btn-block text-uppercase sign-up" type="submit" onsubmit="return false">Sign Up</button>
              <hr class="my-4">
              <button class="btn btn-lg btn-google btn-block text-uppercase" onsubmit="return false"><i class="fab fa-google mr-2"></i> Sign up with Google</button>
              <button class="btn btn-lg btn-facebook btn-block text-uppercase" onsubmit="return false"><i class="fab fa-facebook-f mr-2"></i> Sign up with Facebook</button>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    </div>
</template>

<script>
import LayoutDefault from './layouts/LayoutDefault';

export default {
    name: 'Signup',
    created() {
    this.$emit('update:layout', LayoutDefault);
    },
    data() {
        return {
            showPassword: false,
        }
    }, 
    methods: {
        switchVisibility() {
            const passwordField = document.querySelector('#inputPassword');
            if (passwordField.getAttribute('type') === 'password') passwordField.setAttribute('type', 'text');
            else passwordField.setAttribute('type', 'password');
            this.showPassword = !this.showPassword;
        }
  }
}
</script>

<style lang="css">
@import '../../src/assets/css/forms.css';
@import '../../src/assets/css/styles.css';

</style>