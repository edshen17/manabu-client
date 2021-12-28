import { REPOSITORY_NAME } from '@/repositories/abstractions/IRepository';
import { makeGoogleCloudStorageRepository } from '@/repositories/googleCloudStorage';
import { GoogleCloudStorageRepositoryCreateParams } from '@/repositories/googleCloudStorage/googleCloudStorageRepository';
import { makeTeacherRepository } from '@/repositories/teacher';
import { makeUserRepository } from '@/repositories/user';
import { StringKeyObject } from '@server/types/custom';

const googleCloudStorageRepository = makeGoogleCloudStorageRepository;
const userRepository = makeUserRepository;
const teacherRepository = makeTeacherRepository;

const makeGoogleCloudStorageMixin: any = {
  methods: {
    updateUserAfterUpload: async function (
      props: GoogleCloudStorageRepositoryCreateParams & {
        userId: string;
        updateParamName: string;
        repositoryName: REPOSITORY_NAME.USER | REPOSITORY_NAME.TEACHER;
      }
    ) {
      const self = this as any;
      const { file, metaData, cloudFilePath, userId, updateParamName, repositoryName } = props;
      const { downloadUrl } = await googleCloudStorageRepository.create({
        file,
        metaData,
        cloudFilePath,
        userId,
      });
      const updateParams: StringKeyObject = {};
      updateParams[updateParamName] = downloadUrl;
      const repository =
        repositoryName == REPOSITORY_NAME.USER ? userRepository : teacherRepository;
      const { data } = await repository.updateById({
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
