<template>
  <div class="user-profile" v-if="viewingUserData">
        <div v-if="!loading" class="mt-5">
      <b-row>
        <b-col md="2"></b-col>
        <b-col md="3">
          <div class="card profile-card">
            <div class="card-body">
              <div class="picture-container">
                <img
                  class="dashboard-profile no-cursor"
                  alt="100x100"
                  :src="imageSourceEdit(viewingUserData.profileImage)"
                />
              </div>
              <div class="text-center mt-2">
                <h5>{{ this.viewingUserData.name }}</h5>
                <div
                  v-for="lang in viewingUserData.fluentLanguages.concat(viewingUserData.nonFluentLanguages)"
                  :key="lang"
                  class="mx-1"
                  style="display: inline"
                >
                  {{ lang }}
                  <span
                    v-for="(n, i) in 5"
                    :key="i"
                    class="level"
                    :class="languageLevelBars(lang, i)"
                  ></span>
                </div>
              </div>
              <p class="mt-2 mb-0">{{ formatBio(viewingUserData.profileBio) }}</p>
              <div v-if="myUserData.role == 'admin' && viewingUserData.teacherAppPending">
                <b-button class="mt-3 float-right" variant="success" @click="approveTeacher(viewingUserData._id)">Approve application</b-button>
              </div>
            </div>
          </div>
        </b-col>
        <b-col md="5">
        </b-col>
        <b-col md="2"></b-col>
      </b-row>
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
import myUserData from '../assets/scripts/tokenGetter';
import imageSourceEdit from '../assets/scripts/imageSourceEdit';
import fetchUserData from '../assets/scripts/fetchUserData';
import languageLevelBars from '../assets/scripts/languageLevelBars';
import axios from 'axios';
export default {
    name: 'UserProfile',
    created() {
        this.$emit('update:layout', LayoutDefault);
    },
    data() {
        return {
            myUserData: null,
            viewingUserData: null,
            loading: true,
            host: 'http://localhost:5000/api',
        }
    },
    async mounted() {
        try {
            const myUser = await myUserData();
            this.myUserData = myUser.data;
            this.viewingUserData = await fetchUserData(this.$route.params.uId);
            this.loading = false;
        } catch (e) {
            this.$router.push('/404');
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
          ).catch((err) => {
            console.log(err);
          })

          axios.put(`${this.host}/teacher/${uId}/updateProfile`, { isApproved: true, },
            { headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          }
          ).catch((err) => {
            console.log(err);
          })
        }
    },
}
</script>

<style lang="css">
@import "../../src/assets/css/styles.css";
</style>
