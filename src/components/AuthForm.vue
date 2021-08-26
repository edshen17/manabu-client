<template>
  <div class="flex flex-wrap justify-center">
    <img
      src="../assets/img/torii-lg.png"
      class="object-contain h-36 w-full my-5"
    />
    <div class="py-8 px-6 shadow-2xl rounded-lg sm:px-10 w-11/12 md:w-1/5 mb-10">
      <span class="text-3xl text-center">
        <h2 v-if="isSignUpPage">登録</h2>
        <h2 v-else>Signup</h2>
      </span>
      <form class="mb-0 space-y-6">
        <div class="my-5">
          <span class="form-border">
            <input name="email" type="email" autocomplete="email" required />
          </span>
        </div>
        <div class="my-5">
          <span class="form-border">
            <input name="email" type="email" autocomplete="email" required />
          </span>
        </div>
        <div class="my-5 grid grid-cols-12">
          <span
            class="block border-2 border-r-0 border-gray-300 rounded-md rounded-r-none col-span-10"
          >
            <input
              class="w-full h-10 pl-3 pr-32 text-base placeholder-gray-600"
              type="text"
              placeholder=""
            />
          </span>
          <span
            class="border-2 border-gray-300 rounded-md rounded-l-none col-span-2 text-center flex"
          >
            <button
              class="bg-white border-2 border-gray-300 rounded-md rounded-l-none flex-grow"
            >
              <i class="fas fa-eye text-gray-600"></i>
            </button>
          </span>

          <!-- <div class="relative">
                  <span class="mt-1 form-border">
                    <input class="w-full h-10 pl-3 pr-32 text-base placeholder-gray-600" type="text" placeholder=""/>
                  </span>
                  <button class="absolute inset-y-0 right-0 flex items-center px-4 font-bold rounded-r-none bg-gray-200">
                    <i class="fas fa-eye"></i>
                    <i class="fas fa-eye-slash" v-show="!showPassword"></i>
                  </button>
              </div> -->
        </div>
      </form>
      <button
        class="bg-gray-700 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded w-full my-5"
      >
        Button
      </button>
      <hr class="my-1 border-gray-300" />
      <button
        class="bg-red-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded w-full my-5"
      >
        Google
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { StringKeyObject } from '../../../server/types/custom';
import LayoutDefault from './LayoutDefault.vue';

export default Vue.extend({
  name: 'AuthForm',
  created() {
    this.$emit('update:layout', LayoutDefault);
  },
  computed: {
    isSignupPage: {
      get(): boolean {
        const routeName = this.$route.name;
        const isSignUpPage = routeName == 'Signup';
        return isSignUpPage;
      }
    },
    formLocaleData: {
      get(): StringKeyObject {
        if (this.isSignupPage) {
          return {

          }
        } else {
          return {

          }
        }
      }
    }
  },
  data() {
    return {
    }
  },
  mounted() {
    console.log(this.$route.name)
  }
});
</script>
