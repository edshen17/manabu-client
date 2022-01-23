import { PackageDoc } from '@server/models/Package';
import { JoinedUserDoc } from '@server/models/User';
import fx from 'money';
import { mapGetters } from 'vuex';
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
      await (this as any).$store.dispatch('exchangeRate/getEntityStateData');
      fx.base = 'USD'; // default open exchange rate base
      fx.rates = (this as any).exchangeRates;
      let convertedAmount = fx(amount)
        .from(sourceCurrency.toUpperCase())
        .to(targetCurrency.toUpperCase());
      convertedAmount = isRounding ? Math.round(convertedAmount) : convertedAmount;
      const formattedAmount = currency(convertedAmount).value;
      return formattedAmount;
    },
    async getPackagePrice(props: {
      teacher: JoinedUserDoc;
      pkg: PackageDoc;
      lessonDuration: number;
    }): Promise<string> {
      const { teacher, pkg, lessonDuration } = props;
      const priceData = teacher.teacherData!.priceData;
      const lessonAmount = pkg.lessonAmount;
      const { hourlyRate, currency } = priceData;
      const targetCurrency = (this as any).currency;
      const convertedHourlyRate = await (this as any).convert({
        amount: hourlyRate * (lessonDuration / 60),
        sourceCurrency: currency,
        targetCurrency: targetCurrency,
        isRounding: true,
      });
      const total = convertedHourlyRate * lessonAmount;
      const packagePrice = `${total.toLocaleString()} ${targetCurrency}`;
      return packagePrice;
    },
  },
};

export { makeExchangeRateMixin };
