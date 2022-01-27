import { AbstractModuleGetter } from '@/store/abstractions/AbstractModuleGetter';
import { AppointmentEntityStateData } from '../state/appointmentModuleState';

class AppointmentModuleGetter extends AbstractModuleGetter<AppointmentEntityStateData> {}

export { AppointmentModuleGetter };
