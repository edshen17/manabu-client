interface IEntityState<EntityStateData> {
  entityStatePromise?: Promise<EntityStateData>;
  entityStateData: EntityStateData;
  entityStateName: string;
  entityStateEndpoint: string;
}

export { IEntityState };
