<template>
  <div class="text-center mt-4 lg:mt-7 h-screen">
    <h3 class="text-4xl font-semibold leading-normal mb-2 text-gray-800 uppercase">
      Teacher Signup
    </h3>
    <div class="leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase mx-8">
      下の５つのステップをよく読んでManabuの先生にご登録下さい。
    </div>
    <div class="mt-2">
      <ol class="list-decimal">
        <li>Now this is a story all about how, my life got flipped turned upside down</li>
        <li>Now this is a story all about how, my life got flipped turned upside down</li>
        <!-- ... -->
      </ol>
    </div>
    <!-- <div class="mb-2 text-gray-700 mt-10">
      <i class="fas fa-briefcase mr-2 text-lg text-gray-500"></i>Solution Manager - Creative Tim
      Officer
    </div>
    <div class="mb-2 text-gray-700">
      <i class="fas fa-university mr-2 text-lg text-gray-500"></i>University of Computer Science
    </div> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import LayoutDefault from '../components/LayoutDefault/LayoutDefault.vue';

export default Vue.extend({
  name: '',
  components: {},
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
  created() {
    this.$emit('update:layout', LayoutDefault);
  },
  methods: {},
});
</script>
