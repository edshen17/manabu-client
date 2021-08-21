import { IEntityState } from '@/store/abstractions/IEntityState';
import { JoinedUserDoc } from '@server/models/User';

interface UserEntityState extends IEntityState<UserEntityStateData> {
  entityStateName: 'USER';
}

type UserEntityStateData = JoinedUserDoc | LoggedOutUser;

type LoggedOutUser = {
  settings: {
    currency: string;
    locale: string;
  };
};

export { UserEntityState };
