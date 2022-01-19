import { makeQueryStringHandler } from '../../../../server/components/usecases/utils/queryStringHandler/index';
import axios from '../clients/axios';
import { ExchangeRateRepository } from './exchangeRateRepository';

const makeExchangeRateRepository = new ExchangeRateRepository().init({
  makeClient: axios,
  makeQueryStringHandler,
  resourcePath: '/exchangeRates',
});

export { makeExchangeRateRepository };
