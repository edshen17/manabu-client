interface IEntityState<EntityStateData> {
  entityStatePromise?: Promise<EntityStateData>;
  entityStateData: EntityStateData;
}

export { IEntityState };
