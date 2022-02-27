import axios from '@/repositories/clients/axios';
import { makeQueryStringHandler } from '@server/components/usecases/utils/queryStringHandler';
import { PackageTransactionCheckoutRepository } from './packageTransactionCheckoutRepository';

const makePackageTransactionCheckoutRepository = new PackageTransactionCheckoutRepository().init({
  makeClient: axios,
  makeQueryStringHandler,
  resourcePath: '/checkout/packageTransactions',
});

export { makePackageTransactionCheckoutRepository };
