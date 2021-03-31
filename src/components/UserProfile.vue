<template>
  <div class="user-profile" v-if="viewingUserData">
    <div v-if="!loading" class="mt-4">
        <teacher-profile :viewingUserData="viewingUserData" :myUserData="myUserData" :packages="packages" :exchangeRates="exchangeRates" v-if="viewingUserData.teacherData"></teacher-profile>
        <student-profile :viewingUserData="viewingUserData" :myUserData="myUserData" v-else></student-profile>
    </div>
    <div v-else>
      <div class="d-flex justify-content-center my-4">
        <b-spinner label="Loading..."></b-spinner>
      </div>
    </div>
  </div>
</template>
<script>
import LayoutDefault from './layouts/LayoutDefault';
import TeacherProfile from './steps/TeacherProfile';
import StudentProfile from './steps/StudentProfile';
import imageSourceEdit from '../assets/scripts/imageSourceEdit';
import fetchUserData from '../assets/scripts/fetchUserData';
import fetchPackageData from '../assets/scripts/fetchPackageData';
import store from '../store/store';
import languageLevelBars from '../assets/scripts/languageLevelBars';
import fetchExchangeRates from '../assets/scripts/fetchExchangeRates';

export default {
    name: 'UserProfile',
    created() {
        this.$emit('update:layout', LayoutDefault);
    },
    components: {
        TeacherProfile,
        StudentProfile,
    },
    computed: {
      storeUserData: {
        get() {
          return store.getters.userData;
        },
        set(userData) {
          return userData;
        }
        }
    },
    data() {
        return {
            myUserData: null,
            viewingUserData: null,
            packages: null,
            loading: true,
        }
    },
    async mounted() {
        try {
            this.viewingUserData = await fetchUserData(this.$route.params.uId);
            this.myUserData = this.storeUserData;
            this.packages = await fetchPackageData(this.$route.params.uId)
            this.exchangeRates = await fetchExchangeRates();
            this.loading = false;
        } catch (err) {
            this.$router.push('/404').catch(err => { });
        }
    },
    methods: {
        fetchExchangeRates,
        fetchPackageData,
        fetchUserData,
        imageSourceEdit,
        languageLevelBars,
        formatBio(bio) {
            if (!bio) {
                return 'This user has not written a profile yet.'
            } else {
                return bio;
            }
        },
    },
}
</script>

<style lang="css">
@import "../../src/assets/css/styles.css";
</style>
