import { makeAppointmentRepository } from '@/repositories/appointment';
import { makeAppointmentModuleState } from '../state';
import { AppointmentModuleAction } from './appointmentModuleAction';

const makeAppointmentModuleAction = new AppointmentModuleAction().init({
  makeRepository: makeAppointmentRepository,
  makeModuleState: makeAppointmentModuleState,
});

export { makeAppointmentModuleAction };
