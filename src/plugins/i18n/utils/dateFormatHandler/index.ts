import dayjs from 'dayjs';
import { DateFormatHandler } from './dateFormatHandler';

const makeDateFormatHandler = new DateFormatHandler().init({ dayjs });

export { makeDateFormatHandler };
