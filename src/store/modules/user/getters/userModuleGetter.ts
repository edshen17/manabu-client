import { AbstractModuleGetter } from '@/store/abstractions/AbstractModuleGetter';
import { IEntityState } from '@/store/abstractions/IEntityState';
import { IRootState } from '@/store/abstractions/IRootState';
import { JoinedUserDoc } from '@server/models/User';
import { StringKeyObject } from '@server/types/custom';
import { GetterTree } from 'vuex';
import { TEACHER_ENTITY_TYPE } from '../../../../../../server/components/entities/teacher/teacherEntity';
import { UserEntityStateData } from '../state/userModuleState';

type UserGetterState = IEntityState<UserEntityStateData>;

class UserModuleGetter extends AbstractModuleGetter<UserEntityStateData> {
  protected _getModuleGettersTemplate = (): GetterTree<UserGetterState, IRootState> => {
    const extendedModuleGetters = {
      isLoggedIn(state: UserGetterState): boolean {
        const isLoggedIn = '_id' in state.entityStateData;
        return isLoggedIn;
      },
      isTeacher(state: UserGetterState): boolean {
        const isTeacher = 'teacherData' in state.entityStateData;
        return isTeacher;
      },
      isProTeacher(state: UserGetterState): boolean {
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
      isFinishedOnboarding(state: UserGetterState): boolean {
        const userData = state.entityStateData as JoinedUserDoc;
        let isFinishedOnboarding = false;
        const isLoggedIn = '_id' in userData;
        const isTeacher = 'teacherData' in state.entityStateData;
        if (isLoggedIn) {
          const { profileBio, languages, region, timezone, teacherData } = userData;
          const userChecks =
            profileBio!.length > 0 &&
            languages.length > 0 &&
            region!.length > 0 &&
            timezone!.length > 0;
          isFinishedOnboarding = !isTeacher
            ? userChecks
            : userChecks &&
              teacherData!.teachingLanguages.length == 0 &&
              teacherData!.introductionVideoUrl?.length == 0;
        }
        return isFinishedOnboarding;
      },
      teacherPackages(state: UserGetterState): StringKeyObject[] {
        const isTeacher = 'teacherData' in state.entityStateData;
        if (isTeacher) {
          return (state.entityStateData as JoinedUserDoc).teacherData!.packages.sort(
            // sort by isOffering, then by type
            (a, b) => Number(a.isOffering) - Number(b.isOffering) || a.type.localeCompare(b.type)
          );
        } else {
          return [];
        }
      },
      locale(state: UserGetterState): string {
        const locale = state.entityStateData.settings.locale!;
        return locale;
      },
      currency(state: UserGetterState): string {
        const currency = state.entityStateData.settings.currency!;
        return currency;
      },
    };
    return extendedModuleGetters;
  };
}

export { UserModuleGetter };
