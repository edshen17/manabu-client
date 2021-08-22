import { MutationTree } from 'vuex';
import { UserEntityState } from '../types';
import { UserModuleMutation } from './userModuleMutation';

const userModuleMutation = new UserModuleMutation();

const userModuleMutations: MutationTree<UserEntityState> = userModuleMutation.getModuleMutations();

export { userModuleMutations };
