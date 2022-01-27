import { AbstractModuleFactory } from '@/store/abstractions/AbstractModuleFactory';
import { AppointmentEntityStateData } from './state/appointmentModuleState';

class AppointmentModuleFactory extends AbstractModuleFactory<AppointmentEntityStateData> {}

export { AppointmentModuleFactory };
