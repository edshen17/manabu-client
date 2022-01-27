import { AbstractModuleAction } from '@/store/abstractions/AbstractModuleAction';
import { IEntityState } from '@/store/abstractions/IEntityState';
import { IRootState } from '@/store/abstractions/IRootState';
import { StringKeyObject } from '@server/types/custom';
import { ActionContext, ActionTree } from 'vuex';
import { AppointmentEntityStateData } from '../state/appointmentModuleState';

type UpdateAppointmentParams = {
  appointmentId: string;
  updateParams: StringKeyObject;
};

type OptionalAppointmentModuleActionInitParams = {};

class AppointmentModuleAction extends AbstractModuleAction<
  OptionalAppointmentModuleActionInitParams,
  AppointmentEntityStateData
> {
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
}
export { AppointmentModuleAction };
