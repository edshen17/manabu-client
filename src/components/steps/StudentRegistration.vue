<template>
    <div>
        <div class="container">
            <div class="row">
                <div class="col-md">
                    <div>
                        <form @submit.prevent="handleSubmit">
                            <div class="form-group">
                                <label for="learningLanguage">Target Language</label>
                                <b-form-select v-model="user.learningLanguage" :options="optionsLearningLanguage" size="md"></b-form-select>
                                <div v-if="submitted && user.learningLanguage.length == 0" class="invalid">Please provide a target language</div>
                            </div>
                            
                            <div class="form-group">
                                <label for="level">Target Language Level</label>
                                <b-form-select v-model="user.level" :options="optionsLevel" size="md" :select-size="3"></b-form-select>
                                <div v-if="submitted && user.level.length == 0" class="invalid">Please provide a language level</div>
                            </div>
                            <div class="form-group">
                                <label for="learnedLanguage">Native Language</label>
                                <b-form-select v-model="user.learnedLanguage" :options="optionsNativeLanguage" size="md"></b-form-select>
                                <div v-if="submitted && user.learnedLanguage.length == 0" class="invalid">Please provide a language</div>
                            </div>
                            <div class="form-group">
                                <label for="region">Country/Region</label>
                                <b-form-select v-model="user.region" @change="updateTimezone" :options="optionsRegion" size="md"></b-form-select>
                                <div v-if="submitted && user.region.length == 0" class="invalid">Please provide a region</div>
                            </div>
                            <div class="form-group">
                                <label for="timeZone">Timezone</label>
                                <b-form-select v-model="user.timeZone" :options="optionsTz" size="md"></b-form-select>
                                <div v-if="submitted && user.timeZone.length == 0" class="invalid">Please provide a timezone</div>
                            </div>
                            <div class="form-group">
                                <button class="btn btn-primary" @click="handleSubmit">Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import ct from 'countries-and-timezones';
    import jwt_decode from "jwt-decode";
    import { required, minLength } from 'vuelidate/lib/validators';

    export default {
        name: 'StudentRegistration',
        mounted() {
            const countries = ct.getAllCountries();
            for (const countryCode in countries) {
                const regionObj = {
                    value: countryCode,
                    text: `${countries[countryCode].name} - ${countryCode}`,
                }
                this.optionsRegion.push(regionObj);
            }

            this.optionsRegion.sort(this.compare);
        },
     
        data() {
            return {
                host: 'http://localhost:5000/api',
                optionsLearningLanguage: [
                    { value: 'JP', text: 'Japanese' },
                    { value: null, text: 'Other languages coming soon!', disabled: true }
                ],
                optionsLevel: [
                    { value: 'A2', text: 'Elementary (A2)' },
                    { value: 'B1', text: 'Intermediate (B1)' },
                    { value: 'B2', text: 'Upper Intermediate (B2)' },
                    { value: 'C1', text: 'Advanced (C1)' },
                    { value: 'C2', text: 'Proficient (C2)' },
                ],
                optionsNativeLanguage: [
                    { value: 'EN', text: 'English' },
                    { value: 'JP', text: 'Japanese' },
                    { value: 'CN', text: 'Chinese' },
                    { value: 'KR', text: 'Korean' },
                    { value: 'other', text: 'Other' },
                ],
                optionsRegion: [],
                optionsTz: ['Asia/Singapore (UTC+08:00)'],
                user: {
                    _id: jwt_decode(localStorage.getItem('token')).id,
                    learningLanguage: 'jp',
                    learnedLanguage: 'en',
                    level: 'b1',
                    region: 'SG',
                    timeZone: 'Asia/Singapore (UTC+08:00)',
                },
                submitted: false,
            };
        },
        methods: {
            compare(a, b) { // used to sort the countries in the select dropdown
                if (a.text < b.text)
                    return -1;
                if (a.text > b.text)
                    return 1;
                return 0;
            },
            updateTimezone() { // update timezone when region is changed
                this.optionsTz = [];
                const region = this.user.region;
                const tz = ct.getTimezonesForCountry(region);
                for (let i = 0; i < tz.length; i++) {
                    this.optionsTz.push(`${tz[i].name} (UTC${tz[i].utcOffsetStr})`)
                }
            },
            handleSubmit(e) {
                this.submitted = true;

                if (this.user.learningLanguage && this.user.learnedLanguage && this.user.level && this.user.region && this.user.timeZone) { // all inputs are filled in
                    const sendUpdateObj = {
                        token: localStorage.getItem('token'),
                        learningLanguages: [`${this.user.learningLanguage}-${this.user.level}`],
                        learnedLanguages: [`${this.user.learnedLanguage}-c2`],
                        region: this.user.region,
                        timezone: this.user.timeZone,

                    }
                    axios.put(`${this.host}/user/${this.user._id}/updateProfile`, sendUpdateObj).then(() => {
                        this.$emit('student-reg-submit', true);
                    }).catch((err) => {
                        console.log(err);
                    })
                }
            }
        }
    };
</script>
<style lang="css" scoped>
.invalid {
    width: 100%;
    margin-top: .25rem;
    font-size:  80%;
    color: #dc3545;
}

.btn {
    float: right;
}



</style>