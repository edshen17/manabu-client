import { AbstractModuleGetter } from '@/store/abstractions/AbstractModuleGetter';
import { IEntityState } from '@/store/abstractions/IEntityState';
import { IRootState } from '@/store/abstractions/IRootState';
import { JoinedUserDoc } from '@server/models/User';
import { GetterTree } from 'vuex';
import { TEACHER_ENTITY_TYPE } from '../../../../../../server/components/entities/teacher/teacherEntity';
import { UserEntityStateData } from '../state/userModuleState';

class UserModuleGetter extends AbstractModuleGetter<UserEntityStateData> {
  protected _getModuleGettersTemplate = (): GetterTree<
    IEntityState<UserEntityStateData>,
    IRootState
  > => {
    const extendedModuleGetters = {
      isLoggedIn(state: IEntityState<UserEntityStateData>): boolean {
        const isLoggedIn = '_id' in state.entityStateData;
        return isLoggedIn;
      },
      isTeacher(state: IEntityState<UserEntityStateData>): boolean {
        const isTeacher = 'teacherData' in state.entityStateData;
        return isTeacher;
      },
      isProTeacher(state: IEntityState<UserEntityStateData>): boolean {
        const isTeacher = 'teacherData' in state.entityStateData; //this.isTeacher throws an error...
        let isProTeacher = false;
        if (isTeacher) {
          isProTeacher =
            isTeacher &&
            (state.entityStateData as JoinedUserDoc).teacherData!.type ==
              TEACHER_ENTITY_TYPE.LICENSED;
        }
        return isProTeacher;
      },
      locale(state: IEntityState<UserEntityStateData>): string {
        const locale = state.entityStateData.settings.locale!;
        return locale;
      },
      currency(state: IEntityState<UserEntityStateData>): string {
        const currency = state.entityStateData.settings.currency!;
        return currency;
      },
    };
    return extendedModuleGetters;
  };
}

export { UserModuleGetter };
