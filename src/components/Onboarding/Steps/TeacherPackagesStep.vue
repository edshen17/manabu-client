<template>
  <div>
    <template>
      <div data-app>
        <grid-button-layout
          step-title="Please set up your lesson packages"
          main-class="lg:w-11/12"
          padding-class="h-20v"
        >
          <template v-slot:main>
            <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <article
                v-for="pkg in teacherPackages"
                :key="pkg._id"
                class="
                  border-solid border-2 border-black-50
                  shadow-md
                  mx-auto
                  w-full
                  max-w-2xl
                  transform
                  hover:-translate-y-1
                  duration-300
                  hover:shadow-lg
                  cursor-pointer
                "
              >
                <div class="p-7 my-auto pb-12">
                  <h2 class="text-2xl font-semibold text-gray-700 capitalize">{{ pkg.name }}</h2>
                  <p class="text-xl font-light leading-relaxed text-gray-700 mt-5">
                    Lesson Count: {{ pkg.lessonAmount }}
                  </p>
                  <!-- <label class="inline-flex items-center mt-4">
                    <input type="checkbox" class="h-5 w-5 text-gray-600" /><span
                      class="ml-2 text-gray-700"
                      @change="emitStepForward"
                      >Offer</span
                    >
                  </label> -->
                  <label class="inline-flex items-center mt-2 mr-3">
                    <input
                      type="checkbox"
                      class="h-5 w-5 text-gray-600"
                      @change="updatePackageOffering($event, { _id: pkg._id })"
                    /><span class="ml-2 text-gray-700 text-md">Offer</span>
                  </label>
                  <p class="pt-4">Duration:</p>
                  <div>
                    <label
                      v-for="lessonDuration in lessonDurations"
                      :key="lessonDuration"
                      class="inline-flex items-center mt-2 mr-3"
                    >
                      <input
                        type="checkbox"
                        class="h-5 w-5 text-gray-600"
                        :checked="pkg.lessonDurations.includes(lessonDuration)"
                        :value="lessonDuration"
                        @change="updatePackageDuration({ _id: pkg._id, lessonDuration })"
                      /><span class="ml-2 text-gray-700 text-md">{{ lessonDuration }} minutes</span>
                    </label>
                  </div>
                </div>
              </article>
            </div>
          </template>
          <template v-slot:button
            ><grid-button
              :button-text="$t('onboarding.buttons.next')"
              class="absolute bottom-10 md:block"
              @click="emitStepForward"
            />
          </template>
        </grid-button-layout>
      </div>
    </template>

    <!-- <div class="min-h-screen flex justify-center items-center bg-indigo-500">
      <div class="mx-auto grid lg:grid-flow-col gap-8 lg:gap-16">
        <div class="bg-white p-6 space-y-2 rounded-lg shadow-xl border transition">
          <label class="font-semibold text-gray-800" for="player"> create player </label>
          <div class="flex space-x-2">
            <input
              id="player"
              class="
                appearance-none
                border-2 border-gray-400
                px-2
                py-1.5
                rounded-md
                focus:outline-none
                focus:ring
                focus:ring-indigo-600
                focus:ring-opacity-25
                focus:border-indigo-500
              "
              placeholder="player name"
            />
            <button
              class="
                px-4
                py-2
                bg-indigo-500
                text-white
                font-black
                rounded-md
                font-mono
                text-xl
                leading-none
                hover:bg-indigo-600
                focus:ring focus:ring-indigo-200 focus:bg-indigo-600
                active:bg-green-500
              "
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { PackageDoc } from '../../../../../server/models/Package';
import GridButton from '../Common/GridButton.vue';
import GridButtonLayout from '../Layouts/GridButtonLayout.vue';

type PackageFormData = Pick<
  PackageDoc,
  '_id' | 'isOffering' | 'name' | 'lessonAmount' | 'lessonDurations'
>;

export default Vue.extend({
  name: 'TeacherPackagesStep',
  components: { GridButtonLayout, GridButton },
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      updatedPackages: [] as PackageFormData[],
      createdPackages: [] as PackageFormData[],
    };
  },
  computed: {
    ...mapGetters({
      teacherPackages: 'user/teacherPackages',
    }),
    lessonDurations: {
      get(): number[] {
        const lessonDurations = [30, 60, 90];
        return lessonDurations;
      },
    },
  },
  mounted() {
    const packages = this.teacherPackages as PackageDoc[];
    for (const pkg of packages) {
      const { isOffering, name, lessonAmount, lessonDurations, _id } = pkg;
      this.updatedPackages.push({ _id, isOffering, name, lessonAmount, lessonDurations });
    }
  },
  methods: {
    emitStepForward(): void {
      // if (this.teacherHourlyRate || this.teacherHourlyRate >= 0) {
      //   EventBus.$emit('step-forward', {
      //     value: this.teacherHourlyRate,
      //     emittedValueName: 'teacherHourlyRate',
      //   });
      // }
    },
    updatePackageDuration(props: { _id: string; lessonDuration: number }): void {
      const { _id, lessonDuration } = props;
      const updatedPackage = this._findUpdatedPackage(_id);
      const lessonDurations = updatedPackage.lessonDurations;
      const lessonDurationIndex = lessonDurations.indexOf(lessonDuration);
      if (lessonDurationIndex === -1) {
        lessonDurations.push(lessonDuration);
      } else {
        lessonDurations.splice(lessonDurationIndex, 1);
      }
    },
    _findUpdatedPackage(_id: string): PackageFormData {
      const updatedPackage = this.updatedPackages.find((pkg) => pkg._id == _id)!;
      return updatedPackage;
    },
    updatePackageOffering(event: any, props: { _id: string }): void {
      const { _id } = props;
      const updatedPackage = this._findUpdatedPackage(_id);
      updatedPackage.isOffering = event.target.checked;
    },
  },
});
</script>
