import { AbstractModuleAction } from '@/store/abstractions/AbstractModuleAction';
import { IEntityState } from '@/store/abstractions/IEntityState';
import { ModuleActionInitParams } from '@/store/abstractions/IModuleAction';
import { IRootState } from '@/store/abstractions/IRootState';
import { PackageTransactionDoc } from '@server/models/PackageTransaction';
import { StringKeyObject } from '@server/types/custom';
import dayjs from 'dayjs';
import { ActionContext, ActionTree } from 'vuex';
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

  protected _getModuleActionsTemplate = (): ActionTree<
    IEntityState<PackageTransactionEntityStateData>,
    IRootState
  > => {
    const self = this;
    const extendedModuleActions = {
      async setPackageTransaction(
        props: ActionContext<IEntityState<PackageTransactionEntityStateData>, IRootState>,
        payload: PackageTransactionDoc
      ): Promise<void> {
        return self.setPackageTransaction(props, payload);
      },
    };
    return extendedModuleActions;
  };

  public setPackageTransaction = async (
    props: ActionContext<IEntityState<PackageTransactionEntityStateData>, IRootState>,
    payload: PackageTransactionDoc
  ): Promise<void> => {
    const { commit } = props;
    commit('setPackageTransaction', payload);
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
