<template>
  <div class="flex flex-col w-96 px-4 py-8 overflow-y-auto border-r-2">
    <div class="flex flex-col justify-between">
      <aside>
        <ul>
          <li>
            <v-treeview selectable :items="treeList" open-on-click hoverable></v-treeview>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<script lang="ts">
import { makeContentMixin } from '@/mixins/content';
import { StringKeyObject } from '@server/types/custom';
import Vue from 'vue';

export default Vue.extend({
  name: 'CategoryExplorer',
  components: {},
  mixins: [makeContentMixin],
  props: {
    // prop: {
    //   type: String,
    //   default: '',
    //   required: true,
    // },
  },
  data() {
    return {
      items: [
        {
          id: 1,
          name: 'Applications',
          selected: true,
          children: [
            { id: 2, name: 'Calendar : app' },
            { id: 3, name: 'Chrome : app' },
            { id: 4, name: 'Webstorm : app' },
          ],
        },
        {
          id: 19,
          name: 'Videos',
          children: [
            { id: 24, name: 'Intro : mov' },
            { id: 25, name: 'Conference introduction : avi' },
          ],
        },
      ],
    };
  },
  computed: {
    treeList: {
      get(): StringKeyObject[] {
        const googleCloudCategories = (this as any).googleCloudCategories as string[];
        const treeList = [];
        for (let i = 0; i < googleCloudCategories.length; i++) {
          const category = googleCloudCategories[i];
          const categorySplit = category.split('/');
          const isTopCategory = categorySplit.length == 2;
          const categoryName = categorySplit[categorySplit.length - 1];
          const isHiddenCategory = ['Adult'].includes(categoryName);
          if (isTopCategory && !isHiddenCategory) {
            treeList.push({
              id: i,
              name: categoryName,
              children: [] as any,
            });
          } else if (!isHiddenCategory) {
            treeList[treeList.length - 1].children.push({
              id: i,
              name: categoryName,
            });
          }
        }
        return treeList;
      },
    },
  },
  // watch: {
  //   prop: function () {},
  // },
  mounted() {
    console.log(this.treeList);
    return;
  },
  methods: {},
});
</script>
