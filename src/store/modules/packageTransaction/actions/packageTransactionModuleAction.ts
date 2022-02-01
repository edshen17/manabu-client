import { AbstractModuleAction } from '@/store/abstractions/AbstractModuleAction';
import { ModuleActionInitParams } from '@/store/abstractions/IModuleAction';
import { StringKeyObject } from '@server/types/custom';
import dayjs from 'dayjs';
import { PackageTransactionEntityStateData } from '../state/packageTransactionModuleState';

type OptionalPackageTransactionModuleActionInitParams = {
  dayjs: typeof dayjs;
};

class PackageTransactionModuleAction extends AbstractModuleAction<
  OptionalPackageTransactionModuleActionInitParams,
  PackageTransactionEntityStateData
> {
  private _dayjs!: typeof dayjs;

  protected _getSelfParams = (): StringKeyObject => {
    const getSelfParams = {
      query: { startDate: this._dayjs().hour(0).minute(0).second(0).millisecond(0).toString() },
    };
    return getSelfParams;
  };

  protected _initTemplate = async (
    optionalModuleActionInitParams: Omit<
      ModuleActionInitParams<OptionalPackageTransactionModuleActionInitParams>,
      'makeRepository' | 'makeModuleState'
    >
  ): Promise<void> => {
    const { dayjs } = optionalModuleActionInitParams;
    this._dayjs = dayjs;
  };
}
export { PackageTransactionModuleAction };
