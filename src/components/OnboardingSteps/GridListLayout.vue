<template>
  <div class="container w-11/12 lg:w-4/12 mx-auto">
    <h2 class="flex justify-center text-2xl font-bold my-4 pb-8 lg:text-3xl lg:my-16">
      {{ stepTitle }}
    </h2>
    <div class="w-full place-items-center">
      <ul class="px-0">
        <li
          v-for="(listItem, index) in listItems"
          :key="index"
          class="
            list-none
            px-3
            py-3
            text-lg
            font-semibold
            cursor-pointer
            hover:bg-gray-100
            border-2 border-b-0
          "
          :class="{
            'rounded-t-lg rounded-l-lg rounded-r-lg rounded-bl-none rounded-br-none': index == 0,
            'border-b-2 rounded-b-lg': index == listItems.length - 1,
          }"
          @click="$emit('item-clicked', listItem)"
        >
          {{ listItem.content }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
type ListItems = { content: unknown; value: unknown }[];

export default Vue.extend({
  name: 'GridRectLayout',
  components: {},
  props: {
    stepTitle: {
      type: String,
      default: '',
      required: true,
    },
    listItems: {
      type: Array,
      default: (): {}[] => [],
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {
    return;
  },
  methods: {},
});

export { ListItems };
</script>
