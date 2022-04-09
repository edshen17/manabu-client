<template>
  <div>
    <router-link
      v-for="packageTransaction in visiblePackageTransactions"
      :key="packageTransaction._id"
      :to="{
        name: 'ExtendedAppointmentCalendar',
        params: {
          packageTransaction,
          userId: packageTransaction.hostedById,
          packageTransactionId: packageTransaction._id,
        },
      }"
    >
      <div
        class="bg-white border-l-4 px-4 pt-3 pb-5 border-solid shadow-md rounded-lg rounded-l-none mb-4 h-auto w-full hover:bg-gray-100 text-left"
        :class="{
          'border-green-300 ': packageTransaction.status == 'pending',
          'border-black': packageTransaction.status == 'completed',
          'border-green-600': packageTransaction.status == 'confirmed',
          'border-red-300': packageTransaction.status == 'cancelled',
        }"
      >
        <p class="leading-relaxed uppercase text-gray-600 tracking-wide">
          {{ getPackageName(packageTransaction.packageData) }}
        </p>
        <div class="flex">
          <div class="flex flex-col flex-1">
            <div class="flex space-x-1 py-1">
              <p class="text-lg">
                {{
                  $t('appointment.remainingAppointments', {
                    remainingAppointments: packageTransaction.remainingAppointments,
                    totalAppointments: packageTransaction.packageData.lessonAmount,
                  })
                }}
              </p>
            </div>
            <p class="text-sm text-gray-400 py-1">
              {{ $t(`localeCode.${packageTransaction.lessonLanguage}`) }} /
              {{
                $t('userProfile.teacher.lessonSelection.price', {
                  lessonDuration: packageTransaction.lessonDuration,
                  lessonAmount: packageTransaction.packageData.lessonAmount,
                })
              }}
            </p>
          </div>
          <img
            v-if="packageTransaction"
            :src="packageTransaction.hostedByData.profileImageUrl"
            class="rounded-full h-12"
          />
        </div>
      </div>
    </router-link>
    <div
      v-if="!isAdmin && !isTeacher && visiblePackageTransactions.length == 0"
      class="bg-white p-4 border-solid shadow-md rounded-md mb-4 h-auto w-full"
    >
      <div>
        <i18n path="dashboard.findTeacher" tag="label">
          <a href="mailto:support@manabu.sg" class="text-blue-500">support@manabu.sg</a>
        </i18n>
        <router-link
          to="/teachers"
          tag="button"
          class="bg-green-500 text-white rounded-lg p-2 my-2 block"
        >
          Find a teacher
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { makePackageMixin } from '@/mixins/package';
import { PackageTransactionDoc } from '@server/models/PackageTransaction';
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'PackageTransactionCards',
  components: {},
  mixins: [makePackageMixin],
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      userData: 'user/entityStateData',
      isTeacher: 'user/isTeacher',
      isAdmin: 'user/isAdmin',
      packageTransactions: 'packageTransaction/entityStateData',
    }),
    visiblePackageTransactions: {
      get(): PackageTransactionDoc[] {
        const incompletePackageTransactions = this.packageTransactions.filter(
          (packageTransaction: PackageTransactionDoc) => {
            return (
              packageTransaction.remainingAppointments > 0 &&
              this.userData._id == packageTransaction.reservedById
            );
          }
        );
        // const visiblePackageTransactions = incompletePackageTransactions.slice(0, 3);
        // return visiblePackageTransactions;
        return incompletePackageTransactions;
      },
    },
  },
  methods: {
    getProfileImageUrl(packageTransaction: PackageTransactionDoc): string | undefined {
      const isHostedBy = this.userData._id == packageTransaction.hostedById;
      const { hostedByData, reservedByData } = packageTransaction;
      let profileImageUrl = isHostedBy
        ? reservedByData.profileImageUrl
        : hostedByData.profileImageUrl;
      return profileImageUrl;
    },
  },
});
</script>
