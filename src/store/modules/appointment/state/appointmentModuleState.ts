import { AbstractModuleState } from '@/store/abstractions/AbstractModuleState';
import { IEntityState } from '@/store/abstractions/IEntityState';
import { AppointmentDoc } from '@server/models/Appointment';

type AppointmentEntityState = IEntityState<AppointmentEntityStateData>;
type AppointmentEntityStateData = AppointmentDoc[];

type OptionalAppointmentModuleStateInitParams = {};

class AppointmentModuleState extends AbstractModuleState<
  OptionalAppointmentModuleStateInitParams,
  AppointmentEntityStateData
> {
  public getDefaultEntityStateData = (): AppointmentEntityStateData => {
    const defaultEntityStateData: AppointmentDoc[] = [];
    return defaultEntityStateData;
  };
}

export { AppointmentModuleState, AppointmentEntityState, AppointmentEntityStateData };
