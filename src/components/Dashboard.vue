<template>
    <div class ="Dashboard">
        <div class="student-dashboard" v-if="userObj.role == 'user'">
            <div v-if="userData">
                <!-- <p>{{userData.data}}</p> -->
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">Large modal</button>

             
                <div>
  <b-button v-b-modal.modal-lg>Launch demo modal</b-button>

        <b-modal id="modal-lg" size="lg" :title="`Welcome to Manabu, ${userData.data.name}! Let us know more about you!`" :no-close-on-backdrop="true" :hide-footer="true">
            <student-registration></student-registration>
        </b-modal>
</div>
            </div>
        </div>
        <teacher-dashboard v-if="userObj.role == 'teacher'">
            <p v-if="userData">{{userData.data}}</p>
        </teacher-dashboard>
    </div>
</template>

<script>
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { required, minLength, email, between } from 'vuelidate/lib/validators'
import LayoutDefault from './layouts/LayoutDefault';
import TeacherDashboard from './TeacherDashboard';
import getUserData from '../assets/scripts/tokenGetter'
import StudentRegistration from './steps/StudentRegistration.vue';

export default {
    async mounted() {
        this.userObj = jwt_decode(localStorage.getItem('token'));
        this.userData = await getUserData();
    },
    components: {
        TeacherDashboard,
        StudentRegistration
    },
    name: 'Dashboard',
    async created() {
        this.$emit('update:layout', LayoutDefault);
    },
    data() {
        return {
            userObj: '',
            userData: null,
            host: 'http://localhost:5000/api',
        }
    },
    methods: {

    },
}
</script>

<style lang="css">
/* @import '../../src/assets/css/styles.css'; */
.modal-header .close {
  display:none !important;
}

</style>