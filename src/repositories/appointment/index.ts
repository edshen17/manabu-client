import { makeQueryStringHandler } from '../../../../server/components/usecases/utils/queryStringHandler/index';
import axios from '../clients/axios';
import { AppointmentRepository } from './appointmentRepository';

const makeAppointmentRepository = new AppointmentRepository().init({
  makeClient: axios,
  makeQueryStringHandler,
  resourcePath: '/appointments',
});

export { makeAppointmentRepository };
