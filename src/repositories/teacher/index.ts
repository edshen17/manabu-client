import { makeQueryStringHandler } from '../../../../server/components/usecases/utils/queryStringHandler/index';
import axios from '../clients/axios';
import { TeacherRepository } from './teacherRepository';

const makeTeacherRepository = new TeacherRepository().init({
  makeClient: axios,
  makeQueryStringHandler,
  resourcePath: '/teachers',
});

export { makeTeacherRepository };
