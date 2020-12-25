<template>
  <div class="TeacherApplication">
    <p>forms/agreements go here</p>
    <button @click="redirect">Sign up for a Teacher Account now!</button>
    <!-- <button @click="redirect">Create a Teacher Account with an existing account!</button> -->
  </div>
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
    methods: {
        redirect() {
            this.$router.push('/signup?teacherSignup=true')
        }
    },
}
</script>

<style lang="css">
@import "../../src/assets/css/styles.css";
</style>
