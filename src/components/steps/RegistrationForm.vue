<template>
  <div v-if="userData">
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
                <b-form-select
                  v-model="modelData.region"
                  @change="updateTimezone"
                  :options="optionsRegion"
                  size="md"
                ></b-form-select>
                <div
                  v-show="submitted && modelData.region.length == 0"
                  class="invalid"
                >
                  Please provide a region
                </div>
              </div>
              <div class="form-group">
                <label>Timezone</label>
                <b-form-select
                  v-model="modelData.timezone"
                  :options="optionsTz"
                  size="md"
                ></b-form-select>
                <div
                  v-show="submitted && modelData.timezone.length == 0"
                  class="invalid"
                >
                  Please provide a timezone
                </div>
              </div>
              <div class="comm-tool">
                <div class="form-group">
                  <label>Preferred Communication Tool</label>
                  <b-form-select
                    v-model="modelData.commMethods.method"
                    :options="optionsCommMethod"
                    size="md"
                  ></b-form-select>
                  <div
                    v-show="submitted && modelData.timezone.length == 0"
                    class="invalid"
                  >
                    Please provide a communication tool
                  </div>
                  <b-form-input
                    v-model="modelData.commMethods.id"
                    :placeholder="`${modelData.commMethods.method} ID`"
                    class='mt-2'
                  ></b-form-input>
                  <div
                    v-show="submitted && modelData.commMethods.id.length == 0"
                    class="invalid"
                  >
                    Please provide an ID
                  </div>
                </div>
              </div>

              <div class="form-group">
                <button class="btn btn-primary mt-2" @click="handleSubmit()">
                  {{submitButtonText}}
                </button>
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
// import { required, minLength } from 'vuelidate/lib/validators';
import store from '../../store/store';

export default {
    name: 'RegistrationForm1',
    props: {
        submitButtonText: String,
        formData: Object,
        endpoint: String,
        userId: String,
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
        this.userData = this.storeUserData;
    },

    data() {
        return {
            host: '/api',
            optionsRegion: [],
            optionsTz: ['Asia/Singapore (UTC+08:00)'],
            optionsCommMethod: ['LINE', 'Skype', 'Discord',],
            modelData: {
                region: 'SG',
                timezone: 'Asia/Singapore (UTC+08:00)',
                commMethods: {
                  method: 'LINE',
                  id: '',
                }
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
            const tz = ct.getTimezonesForCountry(this.modelData.region);
            for (let i = 0; i < tz.length; i++) {
                this.optionsTz.push(`${tz[i].name} (UTC${tz[i].utcOffsetStr})`)
            }

            this.modelData.timezone = this.optionsTz[0]
        },
        handleSubmit() {
            this.submitted = true;
            if (this.formData.fluentLanguage && this.formData.nonFluentLanguage && this.formData.level && this.modelData.region && this.modelData.timezone && (this.modelData.commMethods.method && this.modelData.commMethods.id) || !(this.teacherComms.lineId.length == 0 
                      || this.teacherComms.skypeId.length == 0 
                      || this.teacherComms.discordId.length == 0)) { // all required inputs are filled in
                const sendUpdateObj = { ...this.formData, ...this.modelData } // merge the data from the parent and child
                sendUpdateObj.commMethods = [this.modelData.commMethods];
                
                sendUpdateObj.languages = [{language: sendUpdateObj.fluentLanguage, level: 'C2' }, { language: sendUpdateObj.nonFluentLanguage, level: sendUpdateObj.level }]
                axios.put(`${this.host}/user/${this.userData._id}/updateProfile`, sendUpdateObj).then((res) => {
                  if (res.status == 200) {
                    store.commit('setUserData', res.data);
                    if (this.endpoint == 'teacher') {
                      axios
                        .put(
                          `${this.host}/teacher/${this.userData._id}/updateProfile`,
                          { teachingLanguages: [{language: sendUpdateObj.fluentLanguage, level: 'C2' }], alsoSpeaks: [{ language: sendUpdateObj.nonFluentLanguage, level: sendUpdateObj.level }]},
                        ).then((res) => {
                          if (res.status == 200) {
                            this.$emit('form-submitted');
                          }
                        }).catch((err) => { console.log(err) })
                      } else {
                        this.$emit('form-submitted');
                      }
                  }
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
  margin-top: 0.25rem;
  font-size: 80%;
  color: #dc3545;
}

.btn {
  float: right;
}
</style>
