<template>
  <div class="flex flex-wrap justify-center">
    <img
      src="../assets/img/torii-lg.png"
      class="object-contain h-36 w-full my-5"
    />
    <div class="py-8 px-6 shadow-2xl rounded-lg sm:px-10 w-11/12 md:w-6/12 xl:w-4/12 2xl:w-1/5 mb-28">
      <form class="mb-0 space-y-6" @keyup.13="handleAuthFormSubmit">
        <div v-if="isSignupPage">
          <span class="form-border">
            <input v-model="name" name="name" type="text" for="name" autocomplete="name" :placeholder="$t('userAuth.name')"/>
          </span>
          <p class="text-sm text-red-400 mt-2" v-show="$v.name.$error">{{$t('userAuth.errors.name')}}</p>
        </div>
        <div>
          <span class="form-border">
            <input v-model="email" name="email" type="email" autocomplete="email" :placeholder="$t('userAuth.email')"/>
          </span>
          <p class="text-sm text-red-400 mt-2" v-show="$v.email.$error">{{$t('userAuth.errors.email')}}</p>
        </div>
        <div class="grid grid-cols-12">
          <span
            class="block border-2 border-r-0 border-gray-300 rounded-md rounded-r-none col-span-10"
          >
            <input
              v-model="password"
              class="w-full h-10 pl-3 pr-32 text-base placeholder-gray-600"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="on"
              :placeholder="$t('userAuth.password')"
            />
          </span>
          <span
            class="border-2 border-gray-300 rounded-md rounded-l-none col-span-2 text-center flex"
          >
            <button
              class="bg-white border-2 border-gray-300 rounded-md rounded-l-none flex-grow"
              type="button"
              @click="togglePasswordView"
            >
              <i class="fas fa-eye text-gray-600" v-show="showPassword"></i>
              <i class="fas fa-eye-slash text-gray-600" v-show="!showPassword"></i>
            </button>
          </span>
        </div>
      </form>
      <p class="text-sm text-red-400 my-1" v-show="$v.password.$error">{{$t('userAuth.errors.password')}}</p>
      <button
        class="bg-gray-700 text-white font-bold py-3 px-4 rounded w-full my-5"
        type="button"
        @click="handleAuthFormSubmit"
      >
        <span v-if="isSignupPage">{{$t('userAuth.signup')}}</span>
        <span v-else>{{$t('userAuth.login')}}</span>
      </button>
      <hr class="my-1 border-gray-300" />
      <button
        class="bg-red-500 text-white font-bold py-3 px-4 rounded w-full my-5"
        type="button"
        @click="handleGoogleLogin"
      >
        <i class="fab fa-google mr-3"></i>
        {{$t('userAuth.googleLogin')}}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import { email, minLength, required } from 'vuelidate/lib/validators';
import LayoutDefault from '../components/LayoutDefault.vue';

export default Vue.extend({
  name: 'UserAuthForm',
  created() {
    this.$emit('update:layout', LayoutDefault);
  },
  computed: {
    isSignupPage: {
      get(): boolean {
        const routeName = this.$route.name;
        const isSignupPage = routeName == 'Signup';
        return isSignupPage;
      }
    },
  },
  data() {
    return {
      name: '',
      email: '',
      password: '',
      showPassword: false,
    }
  },
  validations: {
    name: {
      required
    },
    email: {
      required,
      email,
    },
    password: {
      required,
      minLength: minLength(8),
    }
  },
  methods: {
    togglePasswordView(): void {
      this.showPassword = !this.showPassword;
    },
    async handleAuthFormSubmit(): Promise<void> {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        if (this.isSignupPage) {
          await this._handleSignup();
        } else {
          await this._handleBaseLogin();
        }
      }
    },
    async _handleSignup(): Promise<void> {
      const body = {
        name: this.name,
        email: this.email,
        password: this.password,
      }
      await axios.post('/users/create', body);
      this.$router.push('/dashboard');
    },
    async _handleBaseLogin(): Promise<void> {

    },
    async handleGoogleLogin(): Promise<void> {
      location.href = 'http://google.com'
    }
  }
});
</script>
