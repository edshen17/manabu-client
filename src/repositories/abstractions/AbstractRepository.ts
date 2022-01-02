import { QueryStringHandler } from '@server/components/usecases/utils/queryStringHandler/queryStringHandler';
import { StringKeyObject } from '@server/types/custom';
import { IRepository } from './IRepository';

abstract class AbstractRepository implements IRepository {
  protected _client!: any;
  protected _queryStringHandler!: QueryStringHandler;
  protected _resourcePath!: string | undefined;

  public get = async (query: StringKeyObject): Promise<StringKeyObject> => {
    const queryString = this._queryStringHandler.stringifyQueryStringObj(query);
    const apiUrl = this._resourcePath;
    return await this._client.get(`${apiUrl}?${queryString}`);
  };

  public getById = async (props: {
    _id: string;
    customResourcePath?: string;
    query: StringKeyObject;
  }): Promise<StringKeyObject> => {
    const { _id, customResourcePath, query } = props;
    const queryString = this._queryStringHandler.stringifyQueryStringObj(query);
    const apiUrl = customResourcePath || `${this._resourcePath}/${_id}`;
    return await this._client.get(`${apiUrl}?${queryString}`);
  };

  public getSelf = async (): Promise<StringKeyObject> => {
    return await this._client.get(`${this._resourcePath}/self`);
  };

  public create = async (props: {
    customResourcePath?: string;
    query: StringKeyObject;
    payload: StringKeyObject;
  }): Promise<StringKeyObject> => {
    const { customResourcePath, query, payload } = props;
    const queryString = this._queryStringHandler.stringifyQueryStringObj(query);
    const baseApiUrl = customResourcePath || `${this._resourcePath}`;
    const apiUrl = `${baseApiUrl}?${queryString}`;
    return await this._client.post(apiUrl, payload);
  };

  public updateById = async (props: {
    _id: string;
    updateParams: StringKeyObject;
  }): Promise<StringKeyObject> => {
    const { _id, updateParams } = props;
    this._removeId(updateParams);
    return await this._client.patch(`${this._resourcePath}/${_id}`, updateParams);
  };

  private _removeId = (obj: StringKeyObject): void => {
    for (const prop in obj) {
      if (prop === '_id') {
        delete obj[prop];
      } else if (typeof obj[prop] === 'object') {
        this._removeId(obj[prop]);
      }
    }
  };

  public deleteById = async (_id: string): Promise<StringKeyObject> => {
    return await this._client.delete(`${this._resourcePath}/${_id}`);
  };

  public init = (initParams: {
    makeClient: any;
    makeQueryStringHandler: QueryStringHandler;
    resourcePath?: string;
  }): this => {
    const { makeClient, makeQueryStringHandler, resourcePath } = initParams;
    this._client = makeClient;
    this._queryStringHandler = makeQueryStringHandler;
    this._resourcePath = resourcePath;
    return this;
  };
}

export { AbstractRepository };
