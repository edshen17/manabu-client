import { AbstractModuleMutation } from '@/store/abstractions/AbstractModuleMutation';
import { IEntityState } from '@/store/abstractions/IEntityState';
import { AppointmentDoc } from '@server/models/Appointment';
import { MutationTree } from 'vuex';
import { AppointmentEntityStateData } from '../state/appointmentModuleState';

class AppointmentModuleMutation extends AbstractModuleMutation<AppointmentEntityStateData> {
  protected _getModuleMutationsTemplate = (): MutationTree<
    IEntityState<AppointmentEntityStateData>
  > => {
    const self = this;
    const extendedModuleMutations = {
      updateAppointment(
        state: IEntityState<AppointmentEntityStateData>,
        payload: AppointmentDoc
      ): void {
        self.updateAppointment({ state, payload });
      },
    };
    return extendedModuleMutations;
  };

  public updateAppointment = (props: {
    state: IEntityState<AppointmentEntityStateData>;
    payload: AppointmentDoc;
  }): void => {
    const { state, payload } = props;
    const appointments = state.entityStateData;
    appointments[appointments.findIndex((appointment) => appointment._id == payload._id)] = payload;
  };
}

export { AppointmentModuleMutation };
