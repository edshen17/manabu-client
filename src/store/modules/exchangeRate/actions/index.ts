import { makeExchangeRateRepository } from '@/repositories/exchangeRate';
import { MODULE_NAME } from '@/store/abstractions/IModuleFactory';
import { makeExchangeRateModuleState } from '../state';
import { ExchangeRateModuleAction } from './exchangeRateModuleAction';

const makeExchangeRateModuleAction = new ExchangeRateModuleAction().init({
  makeRepository: makeExchangeRateRepository,
  makeModuleState: makeExchangeRateModuleState,
  moduleName: MODULE_NAME.EXCHANGE_RATE,
});

export { makeExchangeRateModuleAction };
