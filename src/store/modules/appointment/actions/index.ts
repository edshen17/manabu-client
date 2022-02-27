import { makeAppointmentRepository } from '@/repositories/appointment';
import dayjs from 'dayjs';
import { makeAppointmentModuleState } from '../state';
import { AppointmentModuleAction } from './appointmentModuleAction';

const makeAppointmentModuleAction = new AppointmentModuleAction().init({
  makeRepository: makeAppointmentRepository,
  makeModuleState: makeAppointmentModuleState,
  dayjs,
});

export { makeAppointmentModuleAction };
