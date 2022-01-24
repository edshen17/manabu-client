import { PackageDoc } from '@server/models/Package';
import { JoinedUserDoc } from '@server/models/User';
import { StringKeyObject } from '@server/types/custom';
import fx from 'money';
import { mapGetters } from 'vuex';
import { PAYMENT_GATEWAY_FEE } from '../../../../server/constants';
const currency = require('currency.js');

const makeExchangeRateMixin = {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      exchangeRates: 'exchangeRate/entityStateData',
      currency: 'user/currency',
    }),
  },
  methods: {
    async convert(props: {
      amount: number;
      sourceCurrency: string;
      targetCurrency: string;
      isRounding?: boolean;
    }): Promise<number> {
      const { amount, sourceCurrency, targetCurrency, isRounding } = props;
      const self = this as any;
      await self.$store.dispatch('exchangeRate/getEntityStateData');
      fx.base = 'USD'; // default open exchange rate base
      fx.rates = self.exchangeRates;
      let convertedAmount = fx(amount)
        .from(sourceCurrency.toUpperCase())
        .to(targetCurrency.toUpperCase());
      convertedAmount = isRounding ? Math.round(convertedAmount) : convertedAmount;
      const formattedAmount = self.formatCurrency(convertedAmount);
      return formattedAmount;
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
      const subTotal = self.formatCurrency(convertedHourlyRate * lessonAmount);
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
    formatPrice(props: { currency: string; price: number }): string {
      const { currency, price } = props;
      const formattedPrice = `${price.toLocaleString()} ${currency}`;
      return formattedPrice;
    },
    formatCurrency(value: number): number {
      const formattedCurrency = currency(value).value;
      return formattedCurrency;
    },
  },
};

export { makeExchangeRateMixin };
