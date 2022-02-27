import { AbstractModuleGetter } from '@/store/abstractions/AbstractModuleGetter';
import { ExchangeRateEntityStateData } from '../state/exchangeRateModuleState';

class ExchangeRateModuleGetter extends AbstractModuleGetter<ExchangeRateEntityStateData> {}

export { ExchangeRateModuleGetter };
