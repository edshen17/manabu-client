import { makeQueryStringHandler } from '../../../../server/components/usecases/utils/queryStringHandler/index';
import axios from '../clients/axios';
import { PackageTransactionRepository } from './packageTransactionRepository';

const makePackageTransactionRepository = new PackageTransactionRepository().init({
  makeClient: axios,
  makeQueryStringHandler,
  resourcePath: '/packageTransactions',
});

export { makePackageTransactionRepository };
