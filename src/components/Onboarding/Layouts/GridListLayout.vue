<template>
  <grid-base-layout :step-title="stepTitle">
    <div class="container w-full mx-auto md:w-8/12 xl:w-6/12 place-items-center">
      <ul class="px-0">
        <li
          v-for="(listItem, index) in listItems"
          :key="index"
          class="list-none px-3 py-3 text-lg font-semibold cursor-pointer hover:bg-gray-100 border-2 border-b-0"
          :class="{
            'rounded-t-lg rounded-l-lg rounded-r-lg rounded-bl-none rounded-br-none': index == 0,
            'border-b-2 rounded-b-lg': index == listItems.length - 1,
          }"
          @click="emitStepForward(listItem.value)"
        >
          <button>{{ listItem.content }}</button>
        </li>
      </ul>
    </div>
  </grid-base-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import { EventBus } from '../../EventBus/EventBus';
import GridBaseLayout from './GridBaseLayout.vue';

type ListItems = { content: unknown; value: unknown }[];

export default Vue.extend({
  name: 'GridRectLayout',
  components: { GridBaseLayout },
  props: {
    stepTitle: {
      type: String,
      default: '',
      required: true,
    },
    emittedValueName: {
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
  methods: {
    emitStepForward(value: any): void {
      EventBus.$emit('step-forward', {
        value,
        emittedValueName: this.emittedValueName,
      });
    },
  },
});

export { ListItems };
</script>
