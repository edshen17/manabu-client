<template>
  <div class="min-h-screen">
    <div class="flex flex-wrap justify-center">
      <img
        src="../assets/img/torii-lg.png"
        class="object-contain h-28 md:h-32 2xl:h-36 w-full mt-3 md:mt-10"
      />
    </div>
    <div class="flex flex-wrap justify-center">
      <div class="pt-10 px-6 rounded-lg w-11/12 md:w-6/12 xl:w-4/12 2xl:w-3/12 mb-28">
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
            <p v-show="$v.name.$error" class="vuelidate-error mt-3">
              {{ $t('error.userAuth.name') }}
            </p>
          </div>
          <div>
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
            <p v-show="$v.email.$error" class="vuelidate-error mt-3">
              {{ $t('error.userAuth.email') }}
            </p>
          </div>
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
        <p v-show="$v.password.$error" class="vuelidate-error my-1">
          <span v-if="isSignupPage">{{ $t('error.userAuth.password.length') }}</span>
          <span v-else>{{ $t('error.userAuth.password.length') }}</span>
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
            <router-link :to="{ path: 'login', query: $route.query }" class="text-blue-500">
              {{ $t('userAuth.loginHere') }}
            </router-link>
          </span>
          <span v-else class="inline-block">
            {{ $t('userAuth.noAccount') }}
            <router-link :to="{ path: 'signup', query: $route.query }" class="text-blue-500">{{
              $t('userAuth.signupHere')
            }}</router-link>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { focus } from 'vue-focus';
import { email, minLength, required, requiredIf } from 'vuelidate/lib/validators';
import LayoutDefault from '../components/LayoutDefault/LayoutDefault.vue';
import { StringKeyObject } from '../../../server/types/custom';
import { StatusCodes } from 'http-status-codes';
import { makeUserRepository } from '../repositories/user/index';
import { IS_PRODUCTION } from '../../../server/constants';
const userRepository = makeUserRepository;

export default Vue.extend({
  name: 'UserAuthForm',
  components: {},
  directives: { focus },
  data() {
    return {
      name: '',
      email: '',
      password: '',
      showPassword: false,
      isLoading: false,
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
        const GOOGLE_AUTH_URL = IS_PRODUCTION
          ? process.env.VUE_APP_GOOGLE_AUTH_URL!
          : process.env.VUE_APP_GOOGLE_AUTH_URL_DEV!;
        return `${GOOGLE_AUTH_URL}&state=${this.queryState}`;
      },
    },
    queryState: {
      get: function (): string {
        const queryState = (this as any).$route.query.state || '';
        return queryState;
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
      if (!this.$v.$invalid && !this.isLoading) {
        await this._handleLogin();
      }
    },
    async _handleLogin(): Promise<void> {
      let payload: StringKeyObject = {
        email: this.email,
        password: this.password,
      };
      let endpoint = '/users/auth/base/login';
      this.isLoading = true;
      if (this.isSignupPage) {
        payload = { ...payload, name: this.name };
        endpoint = '/users';
      }
      await this._authorizeUser({ payload, endpoint });
      this.$router.push('/dashboard');
    },
    async _authorizeUser(props: { payload: StringKeyObject; endpoint: string }): Promise<void> {
      const { payload, endpoint } = props;
      const query = this.queryState
        ? {
            state: this.queryState,
          }
        : {};
      try {
        this.$store.dispatch('user/resetEntityState');
        await userRepository.create({
          payload,
          customResourcePath: endpoint,
          query,
        });
      } catch (err: any) {
        const hasErrorResponse = err.response;
        const httpStatusCode = hasErrorResponse ? err.response.status : undefined;
        let apiErrorMsgLocale = 'error.general';
        if (httpStatusCode == StatusCodes.CONFLICT) {
          apiErrorMsgLocale = 'error.userAuth.login.emailExists';
        } else if (httpStatusCode == StatusCodes.UNAUTHORIZED) {
          apiErrorMsgLocale = 'error.userAuth.login.invalid';
        }
        throw new Error(apiErrorMsgLocale);
      }
    },
    async handleGoogleLogin(): Promise<void> {
      location.href = this.GOOGLE_AUTH_URL;
    },
  },
});
</script>
