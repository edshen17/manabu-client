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
