import { UserModuleGetter } from './userModuleGetter';

const makeUserModuleGetter = new UserModuleGetter();
const userModuleGetters = makeUserModuleGetter.getModuleGetters();

export { userModuleGetters };
