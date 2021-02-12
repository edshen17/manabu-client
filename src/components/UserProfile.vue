<template>
  <div class="user-profile" v-if="viewingUserData">
    <div v-if="!loading" class="mt-5">
      <b-row>
        <b-col></b-col>
        <b-col md="5" style="padding: 0 0 0 0 !important;">
          <div class="card mb-3">
            <div class="embed-responsive embed-responsive-16by9">
              <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/fV3Fu5csdcA" allowfullscreen></iframe>
            </div>
              <div class="card-body">
                <h5 class="card-title">Card title</h5>
                <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
              </div>
    </div>
          <!-- <div class="card profile-card">
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
              <div v-if="myUserData.role == 'admin' && viewingUserData.teacherAppPending && !this.isApproved">
                <b-button class="mt-3 float-right" variant="success" @click="approveTeacher(viewingUserData._id)">Approve application</b-button>
              </div>
            </div>
          </div> -->
        </b-col>
        <b-col md="3">
          <div class="card profile-card mb-3">
            <div class="card-body">
              sadadas
            </div>
          </div>
        </b-col>
        <b-col></b-col>
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
            isApproved: false,
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
