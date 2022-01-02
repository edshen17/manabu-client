import { makeQueryStringHandler } from '../../../../server/components/usecases/utils/queryStringHandler/index';
import axios from '../clients/axios';
import { PackageRepository } from './packageRepository';

const makePackageRepository = new PackageRepository().init({
  makeClient: axios,
  makeQueryStringHandler,
  resourcePath: '/packages',
});

export { makePackageRepository };
