import { AbstractModuleAction } from '@/store/abstractions/AbstractModuleAction';
import { MODULE_NAME } from '@/store/abstractions/IModuleFactory';
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

  protected _getEntityStatePayload = (entityStatePromise: StringKeyObject): StringKeyObject => {
    const entityStatePayload =
      entityStatePromise && entityStatePromise.data[`${MODULE_NAME.EXCHANGE_RATE}s`];
    return entityStatePayload;
  };
}
export { ExchangeRateModuleAction };
