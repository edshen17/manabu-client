import { AbstractModuleState } from '@/store/abstractions/AbstractModuleState';
import { IEntityState } from '@/store/abstractions/IEntityState';
import { StringKeyObject } from '@server/types/custom';

type ExchangeRateEntityState = IEntityState<ExchangeRateEntityStateData>;
type ExchangeRateEntityStateData = StringKeyObject;

type OptionalExchangeRateModuleStateInitParams = {};

class ExchangeRateModuleState extends AbstractModuleState<
  OptionalExchangeRateModuleStateInitParams,
  ExchangeRateEntityStateData
> {
  public getDefaultEntityStateData = (): ExchangeRateEntityStateData => {
    const defaultEntityStateData = {};
    return defaultEntityStateData;
  };
}

export { ExchangeRateModuleState, ExchangeRateEntityState, ExchangeRateEntityStateData };
