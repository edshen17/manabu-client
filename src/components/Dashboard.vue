<template>
    <div class ="Dashboard">
        <div v-if="userData"> <!--change here: if current-view = admin... from select dropdown-->
            <div class="student-dashboard" v-if="userData.data.role == 'user' || userData.data.role == 'admin'">
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">Large modal</button>
                <div>
                    <b-button v-b-modal.modal-lg>Launch demo modal</b-button>
                    <b-modal id="modal-lg" size="lg" :title="`Welcome to Manabu, ${userData.data.name}! Let us know more about you!`" :no-close-on-backdrop="true" :hide-footer="true">
                        <student-registration></student-registration>
                    </b-modal>
                </div>
            </div>
        <teacher-dashboard v-if="userData.data.role == 'teacher'">
            <p v-if="userData">{{userData.data}}</p>
        </teacher-dashboard>
        </div>
        <div v-else>
            <div class="d-flex justify-content-center my-4">
                <b-spinner label="Loading..."></b-spinner>
            </div>
        </div>
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
        this.userData = await getUserData();
        this.loading = false;

        console.log(this.loading)
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
            loading: true,
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

.d-flex .spinner-border {
    height: 3.5rem;
    width: 3.5rem;
}

</style>