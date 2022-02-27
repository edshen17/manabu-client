import { makePackageTransactionRepository } from '@/repositories/packageTransaction';
import dayjs from 'dayjs';
import { makePackageTransactionModuleState } from '../state';
import { PackageTransactionModuleAction } from './packageTransactionModuleAction';

const makePackageTransactionModuleAction = new PackageTransactionModuleAction().init({
  makeRepository: makePackageTransactionRepository,
  makeModuleState: makePackageTransactionModuleState,
  dayjs,
});

export { makePackageTransactionModuleAction };
