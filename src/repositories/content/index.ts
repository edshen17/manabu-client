import { makeQueryStringHandler } from '../../../../server/components/usecases/utils/queryStringHandler/index';
import axios from '../clients/axios';
import { ContentRepository } from './contentRepository';

const makeContentRepository = new ContentRepository().init({
  makeClient: axios,
  makeQueryStringHandler,
  resourcePath: '/contents',
});

export { makeContentRepository };
