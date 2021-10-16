import { QueryStringHandler } from '@server/components/usecases/utils/queryStringHandler/queryStringHandler';
import { StringKeyObject } from '@server/types/custom';

interface IRepository {
  get: (query?: StringKeyObject) => Promise<StringKeyObject>;
  getById: (props: { _id: string; customResourcePath?: string }) => Promise<StringKeyObject>;
  getSelf: () => Promise<StringKeyObject>;
  create: (props: {
    customResourcePath?: string;
    query?: StringKeyObject;
    payload: StringKeyObject;
  }) => Promise<StringKeyObject>;
  updateById: (props: { _id: string; updateParams: StringKeyObject }) => Promise<StringKeyObject>;
  deleteById: (_id: string) => Promise<StringKeyObject>;
  init: (initParams: {
    makeClient: any;
    makeQueryStringHandler: QueryStringHandler;
    resourcePath: string;
  }) => this;
}

export { IRepository };
