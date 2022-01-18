<template>
  <div class="bg-gray-50 h-auto min-h-screen">
    <div class="flex flex-wrap md:flex-nowrap w-full md:w-9/12 mx-auto md:py-7">
      <div class="w-full md:w-8/12 md:mx-2">
        <div class="rounded-lg shadow-md">
          <video controls>
            <source
              src="https://firebasestorage.googleapis.com/v0/b/japanese-221819.appspot.com/o/dev-61e578db0d920e908eccf69e%2Fvideos%2F1736107238341807-introductionVideo.mp4?alt=media&token=453cb2b0-4f2f-48f9-a582-f640a2f69e90"
              type="video/mp4"
            />
          </video>
          <div class="flex m-3">
            <div>
              <img src="https://fakeimg.pl/300/" class="rounded-full w-20" />
            </div>
            <div class="mx-4">
              <p class="text-2xl">Mio Sensei</p>
              <p class="text-xs text-gray-400 uppercase tracking-wide my-1">community teacher</p>
              <p class="text-gray-400 text-xs">Last online 10 days ago</p>
              <div class="flex">
                <p class="text-sm mt-1 mr-3">Teaches</p>
                <language-bars :language-level="'C2'" :language-code="'ja'" />
              </div>
              <div class="flex">
                <p class="text-sm mt-1 mr-3">Also Speaks</p>
                <language-bars :language-level="'C2'" :language-code="'en'" />
              </div>
            </div>
          </div>
          <div class="mx-auto border-0 border-t-2 border-solid">
            <p class="justify-center p-6 mx-auto">
              profile bioprofile bioprofile bioprofile bioprofile bioprofile bioprofile bioprofile
              bioprofile bioprofile bioprofile bioprofile bioprofile bioprofile bioprofile
              bioprofile bioprofile bioprofile bioprofile bio
            </p>
          </div>
        </div>
        <div class="rounded-lg shadow-md mt-5 h-auto pb-2">
          <p class="justify-center p-6 mx-auto text-2xl">Lessons</p>
          <div class="px-6 mx-auto">
            <div class="border-solid border-2 rounded-md mb-5">
              <div class="p-3">
                <p class="text-lg text-blue-500">Light plan</p>
                <p class="mt-2 text-gray-500">
                  This is for students who want a balanced but intensive learning schedule. With
                  this plan, you will receive 12 personalized lessons every month or about 3 lessons
                  every week.
                </p>
              </div>
            </div>
          </div>
          <div class="px-5 mx-auto">
            <div class="border-solid border-2 rounded-md mb-5">
              <div class="p-3">
                <p class="text-lg text-pink-500">Moderate plan</p>
                <p class="mt-2 text-gray-500">
                  This is for students who want a balanced but intensive learning schedule. With
                  this plan, you will receive 12 personalized lessons every month or about 3 lessons
                  every week.
                </p>
              </div>
            </div>
          </div>
          <div class="px-5 mx-auto">
            <div class="border-solid border-2 rounded-md mb-5">
              <div class="p-3">
                <p class="text-lg text-green-500">Mainichi plan</p>
                <p class="mt-2 text-gray-500">
                  This is for students who want a balanced but intensive learning schedule. With
                  this plan, you will receive 12 personalized lessons every month or about 3 lessons
                  every week.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full md:w-4/12 md:mx-3 max-h-96">
        <div class="rounded-lg shadow-md max-h-96 h-96"></div>
        <div class="rounded-lg shadow-md max-h-96 mt-5">price data</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import LanguageBars from '../components/UserProfile/LanguageBars.vue';

export default Vue.extend({
  name: '',
  components: { LanguageBars },
  props: {
    // prop: {
    //   type: String,
    //   default: '',
    //   required: true,
    // },
  },
  data() {
    return {};
  },
  computed: {
    // prop: {
    //   get(): any {
    //     return;
    //   },
    // },
  },
  mounted() {
    return;
  },
  methods: {},
});
</script>
