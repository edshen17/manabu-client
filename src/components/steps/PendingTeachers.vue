<template>
  <div class="PendingTeachers"></div>
</template>
<script>
import axios from 'axios';
export default {
    name: 'PendingTeachers',
    data() {
        return {
            pendingTeachers: [],
        }
    },
    methods: {},
    mounted() {
        axios.get(`api/teachers?pending=true`).then((res) => {
            if (res.status == 200) {
                this.teacherArr = res.data;
                this.loaded = true;
                console.log(this.teacherArr)
            }
        })
    }
}
</script>

<style lang="css">
@import "../../src/assets/css/styles.css";
</style>
