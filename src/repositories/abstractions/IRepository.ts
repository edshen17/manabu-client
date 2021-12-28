import { QueryStringHandler } from '@server/components/usecases/utils/queryStringHandler/queryStringHandler';
import { StringKeyObject } from '@server/types/custom';

enum REPOSITORY_NAME {
  USER = 'user',
  TEACHER = 'teacher',
}

interface IRepository {
  get: (query: StringKeyObject) => Promise<StringKeyObject>;
  getById: (props: any) => Promise<StringKeyObject>;
  getSelf: () => Promise<StringKeyObject>;
  create: (props: any) => Promise<StringKeyObject>;
  updateById: (props: any) => Promise<StringKeyObject>;
  deleteById: (_id: string) => Promise<StringKeyObject>;
  init: (initParams: {
    makeClient: any;
    makeQueryStringHandler: QueryStringHandler;
    resourcePath?: string;
  }) => this;
}

export { IRepository, REPOSITORY_NAME };
