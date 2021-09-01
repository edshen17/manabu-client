import axios from 'axios';

const fetchExchangeRates = async () => {
  const res = await axios
    .get(`/api/utils/exchangeRate`, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
    .catch((err) => {
      throw err;
    });
  return res.data;
};

export default fetchExchangeRates;
