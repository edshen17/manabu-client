import { StringKeyObject } from '@server/types/custom';
import { makeAvailableTimeRepository } from './availableTime';

const repositories: StringKeyObject = {
  availableTimes: makeAvailableTimeRepository,
};

enum REPOSITORY_NAME {
  AVAILABLE_TIMES = 'availableTimes',
}

export default {
  get: (name: string) => repositories[name],
};

export { REPOSITORY_NAME };
