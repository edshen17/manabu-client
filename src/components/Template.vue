<template>
  <div class="Template">
    <b-container fluid>
      <b-row>
        <b-col sm="2">1 of 3</b-col>
        <b-col>2 of 3</b-col>
        <b-col sm="2">3 of 3</b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import LayoutDefault from './layouts/LayoutDefault';
export default {
    name: 'Template',
    props: {
        eg: Object,
    },
    computed: {
        storeUserData: {
        get() {
            return store.getters.userData;
        },
        set(userData) {
            return userData;
        }
        },
        isLoggedIn: {
            get() {
            return store.getters.isLoggedIn;
            },
            set(isLoggedIn) {
            return isLoggedIn;
            }
        },
    },
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
