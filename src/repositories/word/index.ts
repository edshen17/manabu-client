import { makeQueryStringHandler } from '../../../../server/components/usecases/utils/queryStringHandler/index';
import axios from '../clients/axios';
import { WordRepository } from './wordRepository';

const makeWordRepository = new WordRepository().init({
  makeClient: axios,
  makeQueryStringHandler,
  resourcePath: '/words',
});

export { makeWordRepository };
