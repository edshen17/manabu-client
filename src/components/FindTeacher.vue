<template>
  <div class="FindTeacher">
      <div v-if='teacherArr'>
          <!-- {{teacherArr}} -->
          <!-- <div
            class="card mb-3 shadow border-0"
            v-for="teacher in teacherArr"
            :key="teacher.userId"
            style="cursor: pointer"
            @click="redirectTo(`/calendar/${packageTransaction.hostedBy}/${packageTransaction._id}`)"
        >
            <div>
            <div class="card-header">
                <span class="mt-2">
                {{teacher.name}}
                </span>
            </div>
            </div>
            <div class="card-body">
            <img
                class="mini-image"
                alt="100x100"
                :src="imageSourceEdit(packageTransaction.relevantUserData.profileImage)"
            />
            <p></p>
            <p>
                {{packageTransaction.remainingAppointments}} /
                {{packageTransaction.packageData.lessonAmount}} appointments
                remaining. ({{packageTransaction.reservationLength}}
                minutes per appointment)
            </p>
            </div>
        </div> -->
      </div>
  </div>
</template>
<script>
import LayoutDefault from './layouts/LayoutDefault';
import axios from 'axios';
export default {
    name: 'FindTeacher',
    created() {
        this.$emit('update:layout', LayoutDefault);
    },
    data() {
        return {
            teacherArr: null,
            params: {},
            loaded: false,
        }
    },
    methods: {},
    mounted() {
        if (Object.keys(this.$route.query).length === 0) {
            this.params = {};
        }
        axios.get(`api/teachers?teacherType=${encodeURIComponent(JSON.stringify(['unlicensed', 'licensed']))}&teachingLanguages=${encodeURIComponent(JSON.stringify(['en',]))}`).then((res) => {
            if (res.status == 200) {
                this.teacherArr = res.data;
                this.loaded = true;
                console.log(this.teacherArr)
            }
        })
    },
}
</script>

<style lang="css">
@import "../../src/assets/css/styles.css";
</style>
