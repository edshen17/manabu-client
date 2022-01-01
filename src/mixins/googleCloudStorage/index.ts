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
        teacherId?: string;
        updateParamName: string;
        repositoryName: REPOSITORY_NAME.USER | REPOSITORY_NAME.TEACHER;
      }
    ) {
      const self = this as any;
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
      const isUserRepository = repositoryName == REPOSITORY_NAME.USER;
      const repository = isUserRepository ? userRepository : teacherRepository;
      const _id = isUserRepository ? userId : teacherId!;
      const { data } = await repository.updateById({
        _id,
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
