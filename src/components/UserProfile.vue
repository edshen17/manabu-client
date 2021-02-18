<template>
  <div class="user-profile" v-if="viewingUserData">
    <div v-if="!loading" class="mt-5">
        <teacher-profile :userData="viewingUserData" v-if="viewingUserData.teacherData"></teacher-profile>
        <student-profile :userData="viewingUserData" v-else></student-profile>
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
import store from '../store/store';
import languageLevelBars from '../assets/scripts/languageLevelBars';
import axios from 'axios';
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
            myUserData: this.storeUserData,
            viewingUserData: null,
            loading: true,
            isApproved: false,
            host: 'http://localhost:5000/api',
        }
    },
    async mounted() {
        try {
            this.viewingUserData = await fetchUserData(this.$route.params.uId);
            this.loading = false;
        } catch (err) {
            this.$router.push('/404').catch(err => {});
        }
    },
    methods: {
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
        approveTeacher(uId) {
          axios.put(`${this.host}/user/${uId}/updateProfile`, { role: 'teacher', },
            { headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          }
          ).then((res) => {
            if (res.status == 200) {
              axios.put(`${this.host}/teacher/${uId}/updateProfile`, { isApproved: true, dateApproved: new Date(), },
              { headers: {
                'X-Requested-With': 'XMLHttpRequest'
              }
              }
            ).catch((err) => {
              console.log(err);
              })
            }
          }).then((res) => {
            if (res.status == 200) {
              this.isApproved = true;
            }
          }).catch((err) => {
            console.log(err);
          })

          
        }
    },
}
</script>

<style lang="css">
@import "../../src/assets/css/styles.css";
</style>
