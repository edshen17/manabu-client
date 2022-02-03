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
      class="
        shadow-md
        rounded-lg rounded-l-none
        bg-white
        mb-4
        h-auto
        w-full
        hover:bg-gray-100
        text-left
      "
      tag="button"
    >
      <a>
        <div
          class="border-l-4 w-full h-full px-4 pt-3 pb-5"
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
      </a>
    </router-link>
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
      packageTransactions: 'packageTransaction/entityStateData',
    }),
    visiblePackageTransactions: {
      get(): PackageTransactionDoc[] {
        const incompletePackageTransactions = this.packageTransactions.filter(
          (packageTransaction: PackageTransactionDoc) => {
            return packageTransaction.remainingAppointments > 0;
          }
        );
        const visiblePackageTransactions = incompletePackageTransactions.slice(0, 3);
        return visiblePackageTransactions;
      },
    },
  },
  async created() {
    await this.$store.dispatch('packageTransaction/getEntityStateData');
  },
  mounted() {
    return;
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
