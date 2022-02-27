import { AbstractModuleMutation } from '@/store/abstractions/AbstractModuleMutation';
import { ExchangeRateEntityStateData } from '../state/exchangeRateModuleState';

class ExchangeRateModuleMutation extends AbstractModuleMutation<ExchangeRateEntityStateData> {}

export { ExchangeRateModuleMutation };
