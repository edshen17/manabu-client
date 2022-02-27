import { REPOSITORY_NAME } from '@/repositories/abstractions/IRepository';
import { makeTeacherRepository } from '@/repositories/teacher';
import { makeUserRepository } from '@/repositories/user';
import { StringKeyObject } from '@server/types/custom';

const userRepository = makeUserRepository;
const teacherRepository = makeTeacherRepository;

const makeUpdateUserByIdMixin = {
  methods: {
    updateUserById: async function (props: {
      userId: string;
      teacherId?: string;
      updateParams: StringKeyObject;
      repositoryName: REPOSITORY_NAME.USER | REPOSITORY_NAME.TEACHER;
    }): Promise<void> {
      const self = this as any;
      const { userId, teacherId, updateParams, repositoryName } = props;
      const isUserRepository = repositoryName == REPOSITORY_NAME.USER;
      const repository = isUserRepository ? userRepository : teacherRepository;
      const _id = isUserRepository ? userId : teacherId!;
      try {
        const { data } = await repository.updateById({
          _id,
          updateParams,
        });
        const { user } = data;
        self.$store.dispatch('user/setEntityStateData', {
          ...user,
        });
      } catch (err) {
        throw err;
      }
    },
  },
};

export { makeUpdateUserByIdMixin };
