import { makeQueryStringHandler } from '../../../../server/components/usecases/utils/queryStringHandler/index';
import axios from '../clients/axios';
import { AvailableTimeRepository } from './availableTimeRepository';

const makeAvailableTimeRepository = new AvailableTimeRepository().init({
  makeClient: axios,
  makeQueryStringHandler,
  resourcePath: '/availableTimes',
});

export { makeAvailableTimeRepository };
