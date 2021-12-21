<template>
  <grid-list-layout
    :step-title="stepTitle"
    :list-items="teacherTypes"
    :emitted-value-name="emittedValueName"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import GridListLayout, { ListItems } from '../Layouts/GridListLayout.vue';

export default Vue.extend({
  name: 'TeacherType',
  components: { GridListLayout },
  props: {
    stepTitle: {
      type: String,
      required: true,
    },
    emittedValueName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    teacherTypes: {
      get(): ListItems {
        const teacherTypes = [
          {
            value: 'unlicensed',
            content: this.$t('onboarding.userProfile.teacherTypes.commTeacher'),
          },
          {
            value: 'licensed',
            content: this.$t('onboarding.userProfile.teacherTypes.proTeacher'),
          },
        ];
        return teacherTypes;
      },
    },
  },
  mounted() {
    return;
  },
  methods: {},
});
</script>
