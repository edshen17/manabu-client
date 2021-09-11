<template>
  <div class="h-screen">
    <div class="flex flex-wrap justify-center">
      <img src="../assets/img/torii-lg.png" class="object-contain h-36 w-full my-10" />
    </div>
    <div class="flex flex-wrap justify-center">
      <div
        class="
          py-10
          px-6
          shadow-2xl
          rounded-lg
          sm:px-10
          w-11/12
          md:w-6/12
          xl:w-4/12
          2xl:w-1/5
          mb-28
        "
      >
        <form class="mb-0 space-y-6">
          <div v-if="isSignupPage">
            <input
              v-model="name"
              v-focus="focusedInputName == 'name'"
              class="form-border"
              name="name"
              type="text"
              for="name"
              autocomplete="name"
              :placeholder="$t('userAuth.name')"
              @focus="focusedInputName = 'name'"
            />
            <p v-show="$v.name.$error" class="text-sm text-red-400 mt-2">
              {{ $t('error.name') }}
            </p>
          </div>
          <input
            v-model="email"
            v-focus="focusedInputName == 'email'"
            name="email"
            type="email"
            autocomplete="email"
            :placeholder="$t('userAuth.email')"
            class="form-border"
            @focus="focusedInputName = 'email'"
          />
          <p v-show="$v.email.$error" class="text-sm text-red-400 mt-2">
            {{ $t('error.email') }}
          </p>
          <div class="grid grid-cols-12">
            <input
              v-model="password"
              name="password"
              autocomplete="password"
              class="
                col-span-10
                border-r-0
                rounded-r-none
                block
                border-2 border-gray-300
                rounded-md
                border-solid
              "
              :type="showPassword ? 'text' : 'password'"
              :placeholder="$t('userAuth.password')"
              @focus="focusedInputName = 'password'"
              @keyup.13="handleAuthFormSubmit"
            />
            <button
              class="
                flex-grow
                block
                border-2 border-gray-300
                rounded-md
                border-solid
                rounded-l-none
                col-span-2
              "
              type="button"
              @click="togglePasswordView"
            >
              <span class="text-gray-600">
                <i v-show="showPassword" class="fas fa-eye"></i>
                <i v-show="!showPassword" class="fas fa-eye-slash"></i>
              </span>
            </button>
          </div>
        </form>
        <p v-show="$v.password.$error" class="text-sm text-red-400 my-1">
          <span v-if="isSignupPage">{{ $t('error.password.length') }}</span>
          <span v-else>{{ $t('error.password.required') }}</span>
        </p>
        <button
          class="bg-gray-700 py-3 px-4 rounded w-full my-6"
          type="button"
          @click="handleAuthFormSubmit"
        >
          <div class="text-white font-bold">
            <span v-if="isSignupPage">{{ $t('userAuth.signup') }}</span>
            <span v-else>{{ $t('userAuth.login') }}</span>
          </div>
        </button>
        <hr class="my-1 border-gray-300" />
        <button
          class="bg-red-500 py-3 px-4 rounded w-full my-6"
          type="button"
          @click="handleGoogleLogin"
        >
          <div class="text-white font-bold">
            <i class="fab fa-google mr-3"></i>
            <span>{{ $t('userAuth.googleLogin') }}</span>
          </div>
        </button>
        <p class="float-right">
          <span v-if="isSignupPage">
            {{ $t('userAuth.haveAccount') }}
            <router-link to="/login" class="text-blue-500">
              {{ $t('userAuth.loginHere') }}
            </router-link>
          </span>
          <span v-else class="inline-block">
            {{ $t('userAuth.noAccount') }}
            <router-link to="/signup" class="text-blue-500">{{
              $t('userAuth.signupHere')
            }}</router-link>
          </span>
        </p>
      </div>
    </div>
  </div>

  <!-- <div class="flex flex-wrap justify-center">
    <img src="../assets/img/torii-lg.png" class="object-contain h-36 w-full my-10" />
    
  </div> -->
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import { focus } from 'vue-focus';
import { email, minLength, required, requiredIf } from 'vuelidate/lib/validators';
import LayoutDefault from '../components/LayoutDefault/LayoutDefault.vue';
import { StringKeyObject } from '../../../server/types/custom';

export default Vue.extend({
  name: 'UserAuthForm',
  directives: { focus },
  data() {
    return {
      name: '',
      email: '',
      password: '',
      showPassword: false,
      _focusedInputName: '',
    };
  },
  computed: {
    isSignupPage: {
      get(): boolean {
        const routeName = this.$route.name;
        const isSignupPage = routeName == 'Signup';
        return isSignupPage;
      },
    },
    GOOGLE_AUTH_URL: {
      get: function (): string {
        const isProduction = process.env.NODE_ENV == 'production';
        let GOOGLE_AUTH_URL = process.env.VUE_APP_GOOGLE_AUTH_URL!;
        if (!isProduction) {
          GOOGLE_AUTH_URL = process.env.VUE_APP_GOOGLE_AUTH_URL_DEV!;
        }
        return GOOGLE_AUTH_URL;
      },
    },
    focusedInputName: {
      get: function (): string {
        const startFocusInputName = this.isSignupPage ? 'name' : 'email';
        const focusedInputName = this.$data._focusedInputName
          ? this.$data._focusedInputName
          : startFocusInputName;
        return focusedInputName;
      },
      set: function (newVal: string): void {
        this.$data._focusedInputName = newVal;
      },
    },
  },
  watch: {
    $route() {
      this.focusedInputName = this.isSignupPage ? 'name' : 'email';
    },
  },
  created() {
    this.$emit('update:layout', LayoutDefault);
  },
  validations: {
    name: {
      required: requiredIf(function (vm) {
        return vm.isSignupPage;
      }),
    },
    email: {
      required,
      email,
    },
    password: {
      required,
      minLength: minLength(8),
    },
  },
  methods: {
    togglePasswordView(): void {
      this.showPassword = !this.showPassword;
    },
    async handleAuthFormSubmit(): Promise<void> {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        await this._handleLogin();
      }
    },
    async _handleLogin(): Promise<void> {
      let body: StringKeyObject = {
        email: this.email,
        password: this.password,
      };
      let endpoint = '/users/auth/base/login';
      if (this.isSignupPage) {
        body = { ...body, name: this.name };
        endpoint = '/users/create';
      }
      await this._authorizeUser({ body, endpoint });
      this.$router.push('/dashboard');
    },
    async _authorizeUser(props: { body: StringKeyObject; endpoint: string }): Promise<void> {
      const { body, endpoint } = props;
      try {
        await axios.post(endpoint, body);
      } catch (err: any) {
        const hasErrorResponse = err.response;
        const httpStatusCode = hasErrorResponse ? err.response.status : undefined;
        const isLoginError = hasErrorResponse && httpStatusCode == 401;
        const apiErrorMsgLocale: string = isLoginError ? 'error.login.invalid' : 'error.general';
        throw new Error(apiErrorMsgLocale);
      }
    },
    async handleGoogleLogin(): Promise<void> {
      location.href = this.GOOGLE_AUTH_URL;
    },
  },
});
</script>
