import { AbstractModuleFactory } from '@/store/abstractions/AbstractModuleFactory';
import { ExchangeRateEntityStateData } from './state/exchangeRateModuleState';

class ExchangeRateModuleFactory extends AbstractModuleFactory<ExchangeRateEntityStateData> {}

export { ExchangeRateModuleFactory };
