import { makeQueryStringHandler } from '../../../../server/components/usecases/utils/queryStringHandler/index';
import axios from '../clients/axios';
import { UserRepository } from './userRepository';

const makeUserRepository = new UserRepository().init({
  makeClient: axios,
  makeQueryStringHandler,
  resourcePath: '/users',
});

export { makeUserRepository };
