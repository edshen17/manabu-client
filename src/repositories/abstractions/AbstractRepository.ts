import { QueryStringHandler } from '@server/components/usecases/utils/queryStringHandler/queryStringHandler';
import { StringKeyObject } from '@server/types/custom';
import { IRepository } from './IRepository';

abstract class AbstractRepository implements IRepository {
  private _client!: any;
  private _queryStringHandler!: QueryStringHandler;
  private _resourcePath!: string;

  public get = async (query: StringKeyObject = {}): Promise<StringKeyObject> => {
    const queryString = this._queryStringHandler.stringifyQueryStringObj(query);
    const apiUrl = `${this._resourcePath}?${queryString}`;
    return await this._client.get(apiUrl);
  };

  public getById = async (_id: string): Promise<StringKeyObject> => {
    return await this._client.get(`${this._resourcePath}/${_id}`);
  };

  public getSelf = async (): Promise<StringKeyObject> => {
    return await this._client.get(`${this._resourcePath}/self`);
  };

  public create = async (): Promise<StringKeyObject> => {
    return await this._client.post(`${this._resourcePath}/create`);
  };

  public updateById = async (props: {
    _id: string;
    updateParams: StringKeyObject;
  }): Promise<StringKeyObject> => {
    const { _id, updateParams } = props;
    return await this._client.patch(`${this._resourcePath}/${_id}`, updateParams);
  };

  public deleteById = async (_id: string): Promise<StringKeyObject> => {
    return await this._client.delete(`${this._resourcePath}/${_id}`);
  };

  public init = (initParams: {
    makeClient: any;
    makeQueryStringHandler: QueryStringHandler;
    resourcePath: string;
  }): this => {
    const { makeClient, makeQueryStringHandler, resourcePath } = initParams;
    this._client = makeClient;
    this._queryStringHandler = makeQueryStringHandler;
    this._resourcePath = resourcePath;
    return this;
  };
}

export { AbstractRepository };
