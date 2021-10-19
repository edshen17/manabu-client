<template>
  <v-sheet height="64" class="flex flex-wrap mx-auto">
    <v-toolbar flat>
      <v-btn outlined class="mx-4" color="grey darken-2" @click="setToday">
        {{ $t('calendar.today') }}</v-btn
      >
      <v-btn fab text small color="grey darken-2" @click="prev">
        <v-icon small> mdi-chevron-left </v-icon>
      </v-btn>
      <v-btn fab text small color="grey darken-2" @click="next">
        <v-icon small> mdi-chevron-right </v-icon>
      </v-btn>
      <v-toolbar-title v-if="$refs.calendar && !isMobile" class="mx-4">
        {{ $refs.calendar.title }}
      </v-toolbar-title>
      <v-menu bottom right>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-show="!isMobile" outlined color="grey darken-2" v-bind="attrs" v-on="on">
            <span>{{ typeToLabel[type].text }}</span>
            <v-icon right> mdi-menu-down </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(value, propertyName) in typeToLabel"
            v-show="(!isMobile && value.showIfDesktop) || (isMobile && value.showIfMobile)"
            :key="propertyName"
            @click="type = propertyName"
          >
            <v-list-item-title>{{ value.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
  </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'DateTooltip',
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
  methods: {},
});
</script>
