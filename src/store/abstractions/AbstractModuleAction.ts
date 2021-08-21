// import { IEntityState } from './IEntityState';
// import {
//   IModuleAction,
//   ModuleActionInitParams,
//   ModuleActionStoreDataParams,
// } from './IModuleAction';

// abstract class AbstractModuleAction<OptionalModuleActionInitParams>
//   implements IModuleAction<OptionalModuleActionInitParams>
// {
//   protected _axios!: any;

//   public abstract storeData(props: ModuleActionStoreDataParams<IEntityState<any>>): Promise<void>;

//   public getModuleActions = (): ActionTree<UserEntityState, IRootState> => {};

//   protected _handleEntityStateReturn = (state: IEntityState<any>) => {
//     const isDataLoaded = state.entityStateData;
//     const isPromiseSet = state.entityStatePromise;
//     if (isDataLoaded) {
//       return state.entityStateData;
//     }
//     if (isPromiseSet) {
//       return state.entityStatePromise;
//     }
//   };

//   protected _setEntityStateData = async (
//     props: ModuleActionStoreDataParams<IEntityState<any>>
//   ): Promise<void> => {
//     const { state, commit } = props;
//     const entityStatePromise = await this._axios.get('/api/v1/users/self');
//     const payload = entityStatePromise && entityStatePromise.data;
//     commit(`SET_${state.entityStateName}_PROMISE`, entityStatePromise);
//     if (payload) {
//       commit(`SET_${state.entityStateName}_DATA`, payload);
//     }
//   };

//   public init = async (
//     initParams: ModuleActionInitParams<OptionalModuleActionInitParams>
//   ): Promise<this> => {
//     const { axios, ...optionalModuleActionInitParams } = initParams;
//     this._axios = axios;
//     await this._initTemplate(optionalModuleActionInitParams);
//     return this;
//   };

//   protected _initTemplate = async (
//     optionalModuleActionInitParams: Omit<
//       ModuleActionInitParams<OptionalModuleActionInitParams>,
//       'axios'
//     >
//   ): Promise<void> => {};
// }

// export { AbstractModuleAction };
