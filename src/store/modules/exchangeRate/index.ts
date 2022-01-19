import { makeExchangeRateModuleAction } from './actions';
import { ExchangeRateModuleFactory } from './exchangeRateModuleFactory';
import { makeExchangeRateModuleGetter } from './getters';
import { makeExchangeRateModuleMutation } from './mutations';
import { makeExchangeRateModuleState } from './state';

const makeExchangeRateModuleFactory = new ExchangeRateModuleFactory().init({
  makeModuleState: makeExchangeRateModuleState,
  makeModuleAction: makeExchangeRateModuleAction,
  makeModuleGetter: makeExchangeRateModuleGetter,
  makeModuleMutation: makeExchangeRateModuleMutation,
});

const makeExchangeRateModule = makeExchangeRateModuleFactory.build();

export { makeExchangeRateModule };
