<template>
  <div data-app>
    <v-menu
      v-model="showEventEditor"
      :position-x="eventEditorCoord.x"
      :position-y="eventEditorCoord.y"
      absolute
      offset-y
      style="max-width: 600px"
      :close-on-content-click="false"
      :close-on-click="false"
    >
      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'EventEditor',
  components: {},
  props: {
    showEventEditor: {
      type: Boolean,
      default: false,
      required: true,
    },
    eventEditorCoord: {
      type: Object,
      default: () => ({ x: 0, y: 0 }),
      required: true,
    },
  },
  data() {
    return {
      items: [
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' },
      ],
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
