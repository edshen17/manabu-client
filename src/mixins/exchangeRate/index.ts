import { StringKeyObject } from '@server/types/custom';
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
      fx.rates = (this as StringKeyObject).exchangeRates;
      let convertedAmount = fx(amount)
        .from(sourceCurrency.toUpperCase())
        .to(targetCurrency.toUpperCase());
      convertedAmount = isRounding ? Math.round(convertedAmount) : convertedAmount;
      const formattedAmount = currency(convertedAmount).value;
      return formattedAmount;
    },
  },
};

export { makeExchangeRateMixin };
