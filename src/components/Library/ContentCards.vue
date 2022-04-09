<template>
  <div class="flex flex-wrap justify-center">
    <div v-for="content of contents" :key="content._id">
      <div class="transform duration-500 hover:-translate-y-1">
        <v-card
          class="m-2 md:m-4 shadow-md content-card"
          min-width="374"
          max-width="374"
          min-height="400"
          outlined
        >
          <div class="cursor-pointer">
            <v-img v-if="content.coverImageUrl" height="250" :src="content.coverImageUrl"></v-img>
            <v-card-title>{{ content.title }}</v-card-title>
            <v-card-text>
              <div class="h-14">
                {{ content.summary | truncate(100, '...') }}
              </div>
            </v-card-text>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
// import lzString from 'lz-string';

export default Vue.extend({
  name: 'ContentCards',
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
    ...mapGetters({
      contents: 'content/entityStateData',
    }),
  },
  // watch: {
  //   prop: function () {},
  // },
  methods: {
    // decode(str: string): string {
    //   const decodedStr = lzString.decompressFromUTF16(str)!;
    //   return decodedStr;
    // },
  },
});
</script>

<style scoped>
.content-card .v-image {
  max-height: 200px;
}
</style>
