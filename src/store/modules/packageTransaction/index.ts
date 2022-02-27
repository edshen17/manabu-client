import { makePackageTransactionModuleAction } from './actions';
import { makePackageTransactionModuleGetter } from './getters';
import { makePackageTransactionModuleMutation } from './mutations';
import { PackageTransactionModuleFactory } from './packageTransactionModuleFactory';
import { makePackageTransactionModuleState } from './state';

const makePackageTransactionModuleFactory = new PackageTransactionModuleFactory().init({
  makeModuleState: makePackageTransactionModuleState,
  makeModuleAction: makePackageTransactionModuleAction,
  makeModuleGetter: makePackageTransactionModuleGetter,
  makeModuleMutation: makePackageTransactionModuleMutation,
});

const makePackageTransactionModule = makePackageTransactionModuleFactory.build();

export { makePackageTransactionModule };
