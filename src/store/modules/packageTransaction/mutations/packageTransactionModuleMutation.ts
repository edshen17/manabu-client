import { AbstractModuleMutation } from '@/store/abstractions/AbstractModuleMutation';
import { IEntityState } from '@/store/abstractions/IEntityState';
import { PackageTransactionDoc } from '@server/models/PackageTransaction';
import { MutationTree } from 'vuex';
import { PackageTransactionEntityStateData } from '../state/packageTransactionModuleState';

class PackageTransactionModuleMutation extends AbstractModuleMutation<PackageTransactionEntityStateData> {
  protected _getModuleMutationsTemplate = (): MutationTree<
    IEntityState<PackageTransactionEntityStateData>
  > => {
    const self = this;
    const extendedModuleMutations = {
      setPackageTransaction(
        state: IEntityState<PackageTransactionEntityStateData>,
        payload: PackageTransactionDoc
      ): void {
        self.setPackageTransaction({ state, payload });
      },
    };
    return extendedModuleMutations;
  };

  public setPackageTransaction = (props: {
    state: IEntityState<PackageTransactionEntityStateData>;
    payload: PackageTransactionDoc;
  }): void => {
    const { state, payload } = props;
    const packageTransactions = state.entityStateData;
    packageTransactions[
      packageTransactions.findIndex((packageTransaction) => packageTransaction._id == payload._id)
    ] = payload;
  };
}

export { PackageTransactionModuleMutation };
