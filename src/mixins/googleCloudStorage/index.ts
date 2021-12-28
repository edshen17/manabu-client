import { makeGoogleCloudStorageRepository } from '@/repositories/googleCloudStorage';
import { GoogleCloudStorageRepositoryCreateParams } from '@/repositories/googleCloudStorage/googleCloudStorageRepository';
import { makeUserRepository } from '@/repositories/user';
import { StringKeyObject } from '@server/types/custom';

const googleCloudStorageRepository = makeGoogleCloudStorageRepository;
const userRepository = makeUserRepository;

const makeGoogleCloudStorageMixin: any = {
  methods: {
    updateUserAfterUpload: async function (
      props: GoogleCloudStorageRepositoryCreateParams & { userId: string; updateParamName: string }
    ) {
      const self = this as any;
      const { file, metaData, cloudFilePath, userId, updateParamName } = props;
      const { downloadUrl } = await googleCloudStorageRepository.create({
        file,
        metaData,
        cloudFilePath,
      });
      const updateParams: StringKeyObject = {};
      updateParams[updateParamName] = downloadUrl;
      const { data } = await userRepository.updateById({
        _id: userId,
        updateParams,
      });
      const { user } = data;
      self.$store.dispatch('user/setEntityStateData', {
        ...user,
      });
    },
  },
};

export { makeGoogleCloudStorageMixin };
