<template>
    <div>
        <div class="container">
            <div class="row">
                <div class="col-md">
                    <div>
                        <form @submit.prevent="handleSubmit">
                            <div class="form-group">
                                 <slot name="uniqueSelect"></slot>
                            </div>
                            <div class="form-group">
                                <label>Country/Region</label>
                                <b-form-select v-model="defaultData.region" @change="updateTimezone" :options="optionsRegion" size="md"></b-form-select>
                                <div v-if="submitted && defaultData.region.length == 0" class="invalid">Please provide a region</div>
                            </div>
                            <div class="form-group">
                                <label>Timezone</label>
                                <b-form-select v-model="defaultData.timezone" :options="optionsTz" size="md"></b-form-select>
                                <div v-if="submitted && defaultData.timezone.length == 0" class="invalid">Please provide a timezone</div>
                            </div>
                            <div class="form-group">
                                <button class="btn btn-primary" @click="handleSubmit(endpoint)">{{submitButtonText}}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// update axios req to use new user fields...


    import axios from 'axios';
    import ct from 'countries-and-timezones';
    import { required, minLength } from 'vuelidate/lib/validators';
    import getUserData from '../../assets/scripts/tokenGetter'

    export default {
        name: 'RegistrationForm1',
        props: {
            submitButtonText: String,
            formData: Object,
            endpoint: String,
            userId: String,
        },
        async mounted() {
            const countries = ct.getAllCountries();
            for (const countryCode in countries) {
                const regionObj = {
                    value: countryCode,
                    text: `${countries[countryCode].name} - ${countryCode}`,
                }
                this.optionsRegion.push(regionObj);
            }

            this.optionsRegion.sort(this.compare);
            this.userData = await getUserData();
        },
     
        data() {
            return {
                host: 'http://localhost:5000/api',
                optionsRegion: [],
                optionsTz: ['Asia/Singapore (UTC+08:00)'],
                defaultData: {
                    region: 'SG',
                    timezone: 'Asia/Singapore (UTC+08:00)',
                },
                userData: null,
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
                const tz = ct.getTimezonesForCountry(this.defaultData.region);
                for (let i = 0; i < tz.length; i++) {
                    this.optionsTz.push(`${tz[i].name} (UTC${tz[i].utcOffsetStr})`)
                }
            },
            handleSubmit(endpoint) {
                if (this.formData.fluentLanguage && this.formData.nonFluentLanguage && this.formData.level && this.defaultData.region && this.defaultData.timezone) { // all inputs are filled in
                    const sendUpdateObj = { ...this.formData, ...this.defaultData } // merge the data from the parent and child
                    sendUpdateObj.fluentLanguages = [`${sendUpdateObj.fluentLanguage}-C2`]
                    sendUpdateObj.nonFluentLanguages = [`${sendUpdateObj.nonFluentLanguage}-${sendUpdateObj.level}`]
                    axios.put(`${this.host}${this.endpoint}/${this.userData.data._id}/updateProfile`, sendUpdateObj, { headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                    }).then(() => {
                        this.$emit('form-submitted', true);
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