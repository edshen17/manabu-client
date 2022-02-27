<script lang="ts">
import Vue from 'vue';
import LayoutDefault from './LayoutDefault.vue';

export default Vue.extend({
  name: 'LayoutDefaultDynamic',
  components: { LayoutDefault },
  created() {
    this.$parent.$emit('update:layout', LayoutDefault);
  },
  render() {
    return (this as any).$slots.default[0];
  },
});
</script>
