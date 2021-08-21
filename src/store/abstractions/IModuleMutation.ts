interface IModuleMutation<EntityState, DbDoc> {
  SET_ENTITY_DATA: (props: { state: EntityState; payload: DbDoc }) => void;
  SET_ENTITY_PROMISE: (props: { state: EntityState; promise: Promise<DbDoc> }) => void;
}

export { IModuleMutation };
