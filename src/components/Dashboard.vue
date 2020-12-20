<template>
    <div class ="Dashboard">
        <div class="student-dashboard" v-if="userObj.role == 'user'">
            <p v-if="userData">{{userData.data}}</p>
        </div>
        <teacher-dashboard v-if="userObj.role == 'teacher'">
            <p v-if="userData">{{userData.data}}</p>
        </teacher-dashboard>
    </div>
</template>

<script>
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import LayoutDefault from './layouts/LayoutDefault';
import TeacherDashboard from './TeacherDashboard';
import getUserData from '../assets/scripts/tokenGetter'

export default {
    async mounted() {
        this.userObj = jwt_decode(localStorage.getItem('token'));
        this.userData = await getUserData();
    },
    components: {
        TeacherDashboard
    },
    name: 'Dashboard',
    async created() {
        this.$emit('update:layout', LayoutDefault);
    },
    data() {
        return {
            userObj: '',
            userData: null,
            host: 'http://localhost:5000/api'
        }
    },
    methods: {},
}
</script>

<style lang="css">
@import '../../src/assets/css/styles.css';

</style>