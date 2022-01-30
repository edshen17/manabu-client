import { AbstractModuleAction } from '@/store/abstractions/AbstractModuleAction';
import { IEntityState } from '@/store/abstractions/IEntityState';
import { ModuleActionInitParams } from '@/store/abstractions/IModuleAction';
import { IRootState } from '@/store/abstractions/IRootState';
import { StringKeyObject } from '@server/types/custom';
import dayjs from 'dayjs';
import { ActionContext, ActionTree } from 'vuex';
import { AppointmentEntityStateData } from '../state/appointmentModuleState';

type UpdateAppointmentParams = {
  appointmentId: string;
  updateParams: StringKeyObject;
};

type OptionalAppointmentModuleActionInitParams = {
  dayjs: typeof dayjs;
};

class AppointmentModuleAction extends AbstractModuleAction<
  OptionalAppointmentModuleActionInitParams,
  AppointmentEntityStateData
> {
  private _dayjs!: typeof dayjs;

  protected _getSelfParams = (): StringKeyObject => {
    const getSelfParams = {
      query: { startDate: this._dayjs().hour(0).minute(0).second(0).millisecond(0).toString() },
    };
    return getSelfParams;
  };

  protected _getModuleActionsTemplate = (): ActionTree<
    IEntityState<AppointmentEntityStateData>,
    IRootState
  > => {
    const self = this;
    const extendedModuleActions = {
      async updateAppointment(
        props: ActionContext<IEntityState<AppointmentEntityStateData>, IRootState>,
        payload: UpdateAppointmentParams
      ): Promise<void> {
        return await self.updateAppointment(props, payload);
      },
    };
    return extendedModuleActions;
  };

  public updateAppointment = async (
    props: ActionContext<IEntityState<AppointmentEntityStateData>, IRootState>,
    payload: UpdateAppointmentParams
  ): Promise<void> => {
    const { commit } = props;
    const { appointmentId, updateParams } = payload;
    const { data } = await this._repository.updateById({ _id: appointmentId, updateParams });
    const { appointment } = data;
    commit('updateAppointment', appointment);
  };

  protected _initTemplate = async (
    optionalModuleActionInitParams: Omit<
      ModuleActionInitParams<OptionalAppointmentModuleActionInitParams>,
      'makeRepository' | 'makeModuleState'
    >
  ): Promise<void> => {
    const { dayjs } = optionalModuleActionInitParams;
    this._dayjs = dayjs;
  };
}
export { AppointmentModuleAction };
