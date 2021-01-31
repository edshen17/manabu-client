<template>
  <div class="user-profile" v-if="userData">
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
                  :src="imageSourceEdit(userData.profileImage)"
                />
              </div>
              <div class="text-center mt-2">
                <h5>{{ this.userData.name }}</h5>
                <div
                  v-for="lang in userData.fluentLanguages.concat(userData.nonFluentLanguages)"
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
              <p class="mt-2 mb-0">{{ formatBio(userData.profileBio) }}</p>
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
import imageSourceEdit from '../assets/scripts/imageSourceEdit';
import fetchUserData from '../assets/scripts/fetchUserData';
import languageLevelBars from '../assets/scripts/languageLevelBars';
export default {
    name: 'UserProfile',
    created() {
        this.$emit('update:layout', LayoutDefault);
    },
    data() {
        return {
            userData: null,
            loading: true,
        }
    },
    async mounted() {
        try {
            this.userData = await fetchUserData(this.$route.params.uId);;
            this.loading = false;
            // console.log(user)
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
    },
}
</script>

<style lang="css">
@import "../../src/assets/css/styles.css";
</style>
