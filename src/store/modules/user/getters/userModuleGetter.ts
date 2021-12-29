import { AbstractModuleGetter } from '@/store/abstractions/AbstractModuleGetter';
import { IEntityState } from '@/store/abstractions/IEntityState';
import { IRootState } from '@/store/abstractions/IRootState';
import { JoinedUserDoc } from '@server/models/User';
import { StringKeyObject } from '@server/types/custom';
import { GetterTree } from 'vuex';
import { TEACHER_ENTITY_TYPE } from '../../../../../../server/components/entities/teacher/teacherEntity';
import { UserEntityStateData } from '../state/userModuleState';

type GetterState = IEntityState<UserEntityStateData>;

class UserModuleGetter extends AbstractModuleGetter<UserEntityStateData> {
  protected _getModuleGettersTemplate = (): GetterTree<GetterState, IRootState> => {
    const extendedModuleGetters = {
      isLoggedIn(state: GetterState): boolean {
        const isLoggedIn = '_id' in state.entityStateData;
        return isLoggedIn;
      },
      isTeacher(state: GetterState): boolean {
        const isTeacher = 'teacherData' in state.entityStateData;
        return isTeacher;
      },
      isProTeacher(state: GetterState): boolean {
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
      teacherPackages(state: GetterState): StringKeyObject[] {
        const isTeacher = 'teacherData' in state.entityStateData;
        if (isTeacher) {
          return (state.entityStateData as JoinedUserDoc).teacherData!.packages;
        } else {
          return [];
        }
      },
      locale(state: GetterState): string {
        const locale = state.entityStateData.settings.locale!;
        return locale;
      },
      currency(state: GetterState): string {
        const currency = state.entityStateData.settings.currency!;
        return currency;
      },
    };
    return extendedModuleGetters;
  };
}

export { UserModuleGetter };
