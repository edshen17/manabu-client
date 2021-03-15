<template>
  <div class="Dashboard"></div>
</template>
<script>
import LayoutDefault from './layouts/LayoutDefault';
export default {
    name: 'Dashboard',
    created() {
        this.$emit('update:layout', LayoutDefault);
    },
    data() {
        return {
        }
    },
    methods: {},
    mounted() {}
}
</script>

<style lang="css">
@import "../../src/assets/css/styles.css";
</style>
