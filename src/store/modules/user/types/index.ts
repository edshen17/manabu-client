import { IEntityState } from '@/store/abstractions/IEntityState';
import { JoinedUserDoc } from '@server/models/User';

interface UserEntityState extends IEntityState<UserEntityStateData> {}

type UserEntityStateData = JoinedUserDoc | LoggedOutUser;

type LoggedOutUser = {
  settings: {
    currency: string;
    locale: string;
  };
};

enum USER_ENTITY_STATE_DISPATCH_PAYLOAD {
  ENDPOINT = 'users/self',
}

export { UserEntityState, UserEntityStateData, USER_ENTITY_STATE_DISPATCH_PAYLOAD };
