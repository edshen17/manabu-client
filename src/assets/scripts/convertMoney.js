import fx from 'money';
const convertMoney =  (amnt, from, to, isRounded, exchangeRates) => {
    if (!from || !to) {
        from = 'SGD';
        to = 'SGD';
      }
      fx.rates = exchangeRates;
      if (isRounded) {
        return fx.convert(amnt, { from, to })
      }
      else {
        return Math.round(fx.convert(amnt, { from, to }));
      }
}

export default convertMoney;