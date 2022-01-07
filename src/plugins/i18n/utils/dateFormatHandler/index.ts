import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DateFormatHandler } from './dateFormatHandler';

dayjs.extend(customParseFormat);
const makeDateFormatHandler = new DateFormatHandler().init({ dayjs });

export { makeDateFormatHandler };
