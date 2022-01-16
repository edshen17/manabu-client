<template>
  <long-card v-if="teachers.length > 0">
    <div>
      <h2 class="text-xl md:text-md font-semibold border-0 border-solid border-b-2 py-2 px-5">
        Pending Teachers
      </h2>
      <div class="grid grid-cols-1 divide-y">
        <div
          v-for="teacher in teachers"
          :key="teacher._id"
          class="flex hover:bg-gray-100 px-5 py-3"
        >
          <img :src="teacher.profileImageUrl" class="rounded-full w-12" />
          <div class="px-3">
            <p>{{ teacher.name }}</p>
            <p class="uppercase text-sm text-gray-500 tracking-wide">
              {{ teacher.teacherData.type }}
            </p>
          </div>
        </div>
        <div class="text-center py-2 uppercase text-gray-500 text-sm hover:bg-gray-100">
          show more
        </div>
      </div>
    </div>
  </long-card>
</template>

<script lang="ts">
import Vue from 'vue';
import LongCard from '../Layouts/LongCard.vue';
import { makeAdminRepository } from '../../../repositories/admin';
const adminRepository = makeAdminRepository;

export default Vue.extend({
  name: 'TeachersCard',
  components: { LongCard },
  props: {
    // prop: {
    //   type: String,
    //   default: '',
    //   required: true,
    // },
  },
  data() {
    return {
      teachers: [],
      teachersToShow: 5,
    };
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
