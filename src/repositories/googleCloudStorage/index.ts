import { firebaseClient } from '../clients/firebase';
import { GoogleCloudStorageRepository } from './googleCloudStorageRepository';

const makeGoogleCloudStorageRepository = new GoogleCloudStorageRepository().init({
  makeClient: firebaseClient,
});

export { makeGoogleCloudStorageRepository };
