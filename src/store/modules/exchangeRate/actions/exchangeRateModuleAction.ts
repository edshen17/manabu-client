import { AbstractModuleAction } from '@/store/abstractions/AbstractModuleAction';
import { StringKeyObject } from '@server/types/custom';
import { ExchangeRateEntityStateData } from '../state/exchangeRateModuleState';

type OptionalExchangeRateModuleActionInitParams = {};

class ExchangeRateModuleAction extends AbstractModuleAction<
  OptionalExchangeRateModuleActionInitParams,
  ExchangeRateEntityStateData
> {
  protected _getEntityStatePromise = async (): Promise<StringKeyObject> => {
    const entityStatePromise = await this._repository.get({
      path: '/',
      query: {},
    });
    return entityStatePromise;
  };
}
export { ExchangeRateModuleAction };
