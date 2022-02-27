import { makeExchangeRateRepository } from '@/repositories/exchangeRate';
import { makeExchangeRateModuleState } from '../state';
import { ExchangeRateModuleAction } from './exchangeRateModuleAction';

const makeExchangeRateModuleAction = new ExchangeRateModuleAction().init({
  makeRepository: makeExchangeRateRepository,
  makeModuleState: makeExchangeRateModuleState,
});

export { makeExchangeRateModuleAction };
