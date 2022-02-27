import { makeAppointmentModuleAction } from './actions';
import { AppointmentModuleFactory } from './appointmentModuleFactory';
import { makeAppointmentModuleGetter } from './getters';
import { makeAppointmentModuleMutation } from './mutations';
import { makeAppointmentModuleState } from './state';

const makeAppointmentModuleFactory = new AppointmentModuleFactory().init({
  makeModuleState: makeAppointmentModuleState,
  makeModuleAction: makeAppointmentModuleAction,
  makeModuleGetter: makeAppointmentModuleGetter,
  makeModuleMutation: makeAppointmentModuleMutation,
});

const makeAppointmentModule = makeAppointmentModuleFactory.build();

export { makeAppointmentModule };
