import { makeQueryStringHandler } from '../../../../server/components/usecases/utils/queryStringHandler/index';
import axios from '../clients/axios';
import { AdminRepository } from './adminRepository';

const makeAdminRepository = new AdminRepository().init({
  makeClient: axios,
  makeQueryStringHandler,
  resourcePath: '/admin',
});

export { makeAdminRepository };
