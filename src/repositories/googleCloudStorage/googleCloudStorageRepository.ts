import { StringKeyObject } from '@server/types/custom';
import { IS_PRODUCTION } from '../../../../server/constants';
import { IRepository } from '../abstractions/IRepository';

class GoogleCloudStorageRepository implements IRepository {
  private _client!: any;

  public get = async (query: StringKeyObject): Promise<StringKeyObject> => {
    return this._throwNotImplementedError();
  };

  private _throwNotImplementedError = (): Error => {
    throw new Error('Not implemented');
  };

  public getById = async (props: {
    _id: string;
    customResourcePath?: string;
    query: StringKeyObject;
  }): Promise<StringKeyObject> => {
    return this._throwNotImplementedError();
  };

  public getSelf = async (): Promise<StringKeyObject> => {
    return this._throwNotImplementedError();
  };

  public create = async (props: {
    file: File | Blob;
    metaData: { contentType: string };
    cloudFilePath: string;
  }): Promise<StringKeyObject> => {
    const { file, metaData, cloudFilePath } = props;
    const { firebaseStorage, uploadBytes, ref, getDownloadURL } = this._client;
    const finalFilePath = IS_PRODUCTION ? cloudFilePath : `dev-${cloudFilePath}`;
    const storageRef = ref(firebaseStorage, finalFilePath);
    await uploadBytes(storageRef, file, metaData);
    const downloadUrl = await getDownloadURL(storageRef);
    return { downloadUrl };
  };

  public updateById = async (props: {
    _id: string;
    updateParams: StringKeyObject;
  }): Promise<StringKeyObject> => {
    return this._throwNotImplementedError();
  };

  public deleteById = async (_id: string): Promise<StringKeyObject> => {
    return this._throwNotImplementedError();
  };

  public init = (initParams: { makeClient: any }): this => {
    const { makeClient } = initParams;
    this._client = makeClient;
    return this;
  };
}

export { GoogleCloudStorageRepository };
