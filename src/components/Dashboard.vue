<template>
    <div class ="Dashboard">
        <p>{{userObj.data.role}}</p>
        <div class="student-dashboard" v-if="userObj == 'student'">student</div>
        <!-- <teacher-dashboard v-if="userObj.data.role == 'teacher'"></teacher-dashboard> -->
    </div>
</template>

<script>
import LayoutDefault from './layouts/LayoutDefault';
import TeacherDashboard from './TeacherDashboard'
import getUserData from '../assets/scripts/tokenGetter'

export default {
    components: {
        TeacherDashboard
    },
    name: 'Dashboard',
    async created() {
        this.$emit('update:layout', LayoutDefault);
        this.userObj = await getUserData();
    },
    data() {
        return {
            userObj: '',
        }
    },
    methods: {},
}
</script>

<style lang="css">
@import '../../src/assets/css/styles.css';

</style>