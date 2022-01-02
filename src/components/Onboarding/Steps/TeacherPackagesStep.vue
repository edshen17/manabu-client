<template>
  <div>
    <template>
      <div data-app>
        <grid-button-layout
          :step-title="$t('onboarding.package.title')"
          main-class="lg:w-11/12"
          padding-class="h-20v"
        >
          <template v-slot:main>
            <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pt-2">
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
                "
              >
                <div class="p-7 my-auto">
                  <div class="flex">
                    <div class="flex-grow">
                      <h2
                        v-show="!isEditingPackage(pkg)"
                        class="
                          inline-block
                          text-xl
                          lg:text-2xl
                          font-semibold
                          text-gray-700
                          capitalize
                          py-1
                          break-words
                        "
                        :class="{ 'hover:bg-gray-200 cursor-pointer': isCustomPackage(pkg) }"
                        @click="
                          setEditingPackageId({ _id: pkg._id, focusedInputName: 'packageName' })
                        "
                      >
                        {{ getPackageData(pkg._id).name }}
                      </h2>
                    </div>
                    <button
                      v-show="isCustomPackage(pkg) && !isEditingPackage(pkg)"
                      class="float-right"
                      @click="setEditingPackageId({ _id: pkg._id })"
                    >
                      <i class="fas fa-edit text-xl lg:text-2xl"></i>
                    </button>
                    <input
                      v-show="isCustomPackage(pkg) && isEditingPackage(pkg)"
                      v-focus="isFocused({ _id: pkg._id, focusedInputName: 'packageName' })"
                      name="packageName"
                      type="text"
                      class="form-border h-12"
                      :value="getPackageData(pkg._id).name"
                      @input="updatePackageName($event, pkg._id)"
                      @focus="setFocusedInputName('packageName')"
                    />
                    <p
                      v-show="showError({ _id: pkg._id, propertyName: 'name' })"
                      class="vuelidate-error mt-2"
                    >
                      {{ $t('error.onboarding.package.name') }}
                    </p>
                  </div>
                  <div class="flex mt-5 space-x-2">
                    <span class="text-lg font-light leading-relaxed text-gray-700">
                      <p class="inline">{{ $t('onboarding.package.lessonAmount') }}</p>
                      <p
                        v-show="!isEditingPackage(pkg)"
                        class="inline px-1 py-1"
                        :class="{ 'hover:bg-gray-200 cursor-pointer': isCustomPackage(pkg) }"
                        @click="
                          setEditingPackageId({ _id: pkg._id, focusedInputName: 'lessonAmount' })
                        "
                      >
                        {{ getPackageData(pkg._id).lessonAmount }}
                      </p>
                    </span>
                    <input
                      v-show="isCustomPackage(pkg) && isEditingPackage(pkg)"
                      v-focus="isFocused({ _id: pkg._id, focusedInputName: 'lessonAmount' })"
                      name="lessonAmount"
                      type="number"
                      class="form-border w-12 h-10 -mt-1"
                      :value="getPackageData(pkg._id).lessonAmount"
                      @input="updatePackageAmount($event, pkg._id)"
                      @focus="setFocusedInputName('lessonAmount')"
                    />
                  </div>
                  <p
                    v-show="showError({ _id: pkg._id, propertyName: 'lessonAmount' })"
                    class="vuelidate-error mt-2"
                  >
                    {{ $t('error.onboarding.package.lessonAmount') }}
                  </p>
                  <label class="inline-flex items-center mt-2 mr-3">
                    <input
                      type="checkbox"
                      class="h-5 w-5 text-gray-600"
                      :checked="pkg.isOffering"
                      @change="updatePackageOffering($event, pkg._id)"
                    /><span class="ml-2 text-gray-700 text-md">{{
                      $t('onboarding.package.isOffering')
                    }}</span>
                  </label>
                  <p class="pt-4 text-lg">{{ $t('onboarding.package.lessonDuration') }}</p>
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
                    /><span class="ml-2 text-gray-700 text-md">{{
                      $t('onboarding.package.lessonDurations', { lessonDuration })
                    }}</span>
                  </label>
                  <p
                    v-show="showError({ _id: pkg._id, propertyName: 'lessonDurations' })"
                    class="vuelidate-error my-2"
                  >
                    {{ $t('error.onboarding.package.lessonDurations') }}
                  </p>
                  <div v-show="isEditingPackage(pkg)" class="flex justify-end mt-4">
                    <button
                      class="py-2 px-3 hover:bg-gray-200 animate-pulse text-blue-600"
                      @click="savePackage(pkg._id)"
                    >
                      {{ $t('button.common.save') }}
                    </button>
                  </div>
                </div>
              </article>
            </div>
          </template>
          <template v-slot:button
            ><grid-button
              :button-text="$t('button.onboarding.next')"
              class="absolute bottom-10 md:block"
              @click="emitStepForward"
            />
          </template>
        </grid-button-layout>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { PACKAGE_ENTITY_TYPE } from '../../../../../server/components/entities/package/packageEntity';
import { PackageDoc } from '../../../../../server/models/Package';
import { StringKeyObject } from '../../../../../server/types/custom';
import GridButton from '../Common/GridButton.vue';
import GridButtonLayout from '../Layouts/GridButtonLayout.vue';
import { focus } from 'vue-focus';
import { EventBus } from '../../EventBus/EventBus';

type PackageFormData = Pick<
  PackageDoc,
  '_id' | 'isOffering' | 'name' | 'lessonAmount' | 'lessonDurations' | 'type'
>;

export default Vue.extend({
  name: 'TeacherPackagesStep',
  components: { GridButtonLayout, GridButton },
  directives: { focus },
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      packages: [] as PackageFormData[],
      editingPackageId: '',
      focusedInputName: '',
      packageErrors: {} as StringKeyObject,
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
    PACKAGE_ENTITY_TYPE: {
      get(): StringKeyObject {
        return PACKAGE_ENTITY_TYPE;
      },
    },
  },
  mounted() {
    return;
  },
  methods: {
    emitStepForward(): void {
      let hasPackageError = false;
      let isOfferingPackage = false;
      for (const _id in this.packageErrors) {
        hasPackageError = hasPackageError || this._hasPackageError(_id);
      }
      for (const pkg of this.packages) {
        isOfferingPackage = isOfferingPackage || pkg.isOffering;
      }
      if (!hasPackageError && isOfferingPackage) {
        EventBus.$emit('step-forward', {
          value: this.packages,
          emittedValueName: 'teacherPackages',
        });
      } else if (!isOfferingPackage) {
        throw new Error('error.onboarding.package.isOffering');
      }
    },
    updatePackageDuration(props: { _id: string; lessonDuration: number }): void {
      const { _id, lessonDuration } = props;
      const packageToUpdate = this.getPackageData(_id);
      const lessonDurations = packageToUpdate.lessonDurations;
      const lessonDurationIndex = lessonDurations.indexOf(lessonDuration);
      if (lessonDurationIndex === -1) {
        lessonDurations.push(lessonDuration);
      } else {
        lessonDurations.splice(lessonDurationIndex, 1);
      }
    },
    getPackageData(_id: string): PackageFormData {
      let packageData = this._findPackage({ _id, packageArr: this.packages });
      if (!packageData) {
        const teacherPackage = this._findPackage({ _id, packageArr: this.teacherPackages });
        const { isOffering, name, lessonAmount, lessonDurations, type } = teacherPackage;
        packageData = { _id, isOffering, name, lessonAmount, lessonDurations, type };
        this.packages.push(packageData);
      }
      return packageData;
    },
    _findPackage(props: {
      _id: string;
      packageArr: PackageFormData[] | PackageDoc[];
    }): PackageFormData {
      const { _id, packageArr } = props;
      const pkg = packageArr.find((pkg) => pkg._id == _id)!;
      return pkg;
    },
    updatePackageOffering(event: any, _id: string): void {
      this._updatePackage(event, { _id, propertyName: 'isOffering', eventTargetName: 'checked' });
    },
    _updatePackage(
      event: any,
      props: { _id: string; propertyName: string; eventTargetName: any }
    ): void {
      const { _id, propertyName, eventTargetName } = props;
      const packageToUpdate: StringKeyObject = this.getPackageData(_id);
      packageToUpdate[propertyName] = event.target[eventTargetName];
    },
    updatePackageName(event: any, _id: string): void {
      this._updatePackage(event, { _id, propertyName: 'name', eventTargetName: 'value' });
    },
    updatePackageAmount(event: any, _id: string): void {
      this._updatePackage(event, {
        _id,
        propertyName: 'lessonAmount',
        eventTargetName: 'valueAsNumber',
      });
    },
    setEditingPackageId(props: { _id: string; focusedInputName?: string }): void {
      const { _id, focusedInputName } = props;
      this.editingPackageId = _id;
      this.setFocusedInputName(focusedInputName);
    },
    setFocusedInputName(focusedInputName?: string) {
      this.focusedInputName = focusedInputName || '';
    },
    isEditingPackage(pkg: PackageDoc): boolean {
      const isEditingPackage = this.editingPackageId == pkg._id && this.isCustomPackage(pkg);
      return isEditingPackage;
    },
    isCustomPackage(pkg: PackageDoc) {
      const isCustomPackage = pkg.type == PACKAGE_ENTITY_TYPE.CUSTOM;
      return isCustomPackage;
    },
    isFocused(props: { _id: string; focusedInputName: string }): boolean {
      const { _id, focusedInputName } = props;
      const isFocused = this.editingPackageId == _id && this.focusedInputName == focusedInputName;
      return isFocused;
    },
    savePackage(_id: string) {
      const hasPackageError = this._hasPackageError(_id);
      if (!hasPackageError) {
        this.setEditingPackageId({ _id: '' });
      }
    },
    _hasPackageError(_id: string): boolean {
      let hasPackageError = false;
      for (const property in this.packageErrors[_id]) {
        hasPackageError = hasPackageError || this.packageErrors[_id][property];
      }
      return hasPackageError;
    },
    showError(props: { _id: string; propertyName: string }): boolean {
      const { _id, propertyName } = props;
      const value = (this.getPackageData(_id) as StringKeyObject)[propertyName];
      const isArray = Array.isArray(value);
      const isEmptyArray = value.length == 0;
      const showError = isArray ? isEmptyArray : !value;
      if (!this.packageErrors[_id]) {
        this.packageErrors[_id] = {};
      }
      this.packageErrors[_id][propertyName] = showError;
      return showError;
    },
  },
});
</script>
