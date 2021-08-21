interface IEntityState<EntityStateData> {
  entityStatePromise?: Promise<EntityStateData>;
  entityStateData: EntityStateData;
  entityStateName: string;
}

export { IEntityState };
