import { REPOSITORY_NAME } from '@/repositories/abstractions/IRepository';
import { makeGoogleCloudStorageRepository } from '@/repositories/googleCloudStorage';
import { GoogleCloudStorageRepositoryCreateParams } from '@/repositories/googleCloudStorage/googleCloudStorageRepository';
import { StringKeyObject } from '@server/types/custom';
import { makeUpdateUserByIdMixin } from '../updateUserById';

const googleCloudStorageRepository = makeGoogleCloudStorageRepository;
const updateUserByIdMixin = makeUpdateUserByIdMixin;

const makeGoogleCloudStorageMixin = {
  mixins: [updateUserByIdMixin],
  methods: {
    updateUserAfterUpload: async function (
      props: GoogleCloudStorageRepositoryCreateParams & {
        userId: string;
        teacherId?: string;
        updateParamName: string;
        repositoryName: REPOSITORY_NAME.USER | REPOSITORY_NAME.TEACHER;
      }
    ): Promise<void> {
      const self: any = this;
      const { file, metaData, cloudFilePath, userId, updateParamName, repositoryName, teacherId } =
        props;
      const { downloadUrl } = await googleCloudStorageRepository.create({
        file,
        metaData,
        cloudFilePath,
        userId,
      });
      const updateParams: StringKeyObject = {};
      updateParams[updateParamName] = downloadUrl;
      self.updateUserById({
        userId,
        teacherId,
        updateParams,
        repositoryName,
      });
    },
  },
};

export { makeGoogleCloudStorageMixin };
