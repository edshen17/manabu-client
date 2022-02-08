import { PackageDoc } from '@server/models/Package';
import { JoinedUserDoc } from '@server/models/User';
import { StringKeyObject } from '@server/types/custom';
import { TranslateResult } from 'vue-i18n';
import { mapGetters } from 'vuex';
import { PACKAGE_DISCOUNT_RATE, PAYMENT_GATEWAY_FEE } from '../../../../server/constants';
import { makeExchangeRateMixin } from '../exchangeRate';

const makePackageMixin = {
  mixins: [makeExchangeRateMixin],
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      currency: 'user/currency',
    }),
  },
  methods: {
    getPackageName(pkg: PackageDoc): TranslateResult | string {
      const packageTitle =
        pkg.type == 'default'
          ? (this as any).$t(`userProfile.teacher.lessonTypes.${pkg.name}.title`)
          : pkg.name;
      return packageTitle;
    },
    getPackageDescription(pkg: PackageDoc): TranslateResult | string {
      const packageDescription =
        pkg.type == 'default'
          ? (this as any).$t(`userProfile.teacher.lessonTypes.${pkg.name}.description`)
          : pkg.description! ||
            `With this plan, you will receive ${
              pkg.lessonAmount
            } personalized lessons, which is about ${Math.ceil(
              pkg.lessonAmount / 4
            )} lessons every week.`;
      return packageDescription;
    },
    async getPackagePriceData(props: {
      teacher: JoinedUserDoc;
      pkg: PackageDoc;
      lessonDuration: number;
      paymentGateway?: 'paypal' | 'paynow' | 'stripe';
    }): Promise<StringKeyObject> {
      const { teacher, pkg, lessonDuration, paymentGateway } = props;
      const self = this as any;
      const priceData = teacher.teacherData!.priceData;
      const lessonAmount = pkg.lessonAmount;
      const { hourlyRate, currency } = priceData;
      const targetCurrency = self.currency;
      const convertedHourlyRate = await self.convert({
        amount: hourlyRate * (lessonDuration / 60),
        sourceCurrency: currency,
        targetCurrency: targetCurrency,
        isRounding: true,
      });
      const subTotal =
        self.formatCurrency(convertedHourlyRate * lessonAmount) *
        (1 - PACKAGE_DISCOUNT_RATE(lessonAmount));
      const processingFee = paymentGateway
        ? self.formatCurrency(PAYMENT_GATEWAY_FEE[paymentGateway.toUpperCase()](subTotal))
        : 0;
      const total = self.formatCurrency(subTotal + processingFee);
      const formattedSubTotal = self.formatPrice({ currency: targetCurrency, price: subTotal });
      const formattedProcessingFee = self.formatPrice({
        currency: targetCurrency,
        price: processingFee,
      });
      const formattedTotal = self.formatPrice({ currency: targetCurrency, price: total });
      const packagePriceData = {
        subTotal,
        processingFee,
        total,
        formattedSubTotal,
        formattedProcessingFee,
        formattedTotal,
      };
      return packagePriceData;
    },
    getPackageDiscount(lessonAmount: number): {
      packageDiscount: number;
      formattedDiscount: string;
    } {
      const packageDiscount = PACKAGE_DISCOUNT_RATE(lessonAmount);
      const formattedDiscount = `${packageDiscount * 100}%`;
      return { packageDiscount, formattedDiscount };
    },
  },
};

export { makePackageMixin };
