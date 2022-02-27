import { StringKeyObject } from '@server/types/custom';
import { IS_PRODUCTION, JWT_SECRET } from '../../../../server/constants';
import { IRepository } from '../abstractions/IRepository';

type GoogleCloudStorageRepositoryCreateParams = {
  file: File | Blob;
  metaData: { contentType: string };
  cloudFilePath: string;
  userId: string;
};

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

  public create = async (
    props: GoogleCloudStorageRepositoryCreateParams
  ): Promise<StringKeyObject> => {
    const { file, metaData, cloudFilePath, userId } = props;
    const { firebaseStorage, uploadBytes, ref, getDownloadURL } = this._client;
    const filePathArr = cloudFilePath.split('/');
    const hash = this._cyrb53(`${userId}-${JWT_SECRET}`);
    filePathArr[filePathArr.length - 1] = `${hash}-${filePathArr[filePathArr.length - 1]}`;
    const joinedPath = filePathArr.join('/');
    const finalFilePath = IS_PRODUCTION ? joinedPath : `dev-${joinedPath}`;
    const storageRef = ref(firebaseStorage, finalFilePath);
    await uploadBytes(storageRef, file, metaData);
    const downloadUrl = await getDownloadURL(storageRef);
    return { downloadUrl };
  };

  private _cyrb53 = function (str: string, seed = 0) {
    let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
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

export { GoogleCloudStorageRepository, GoogleCloudStorageRepositoryCreateParams };
