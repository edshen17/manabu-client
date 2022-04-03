import { AbstractModuleState } from '@/store/abstractions/AbstractModuleState';
import { IEntityState } from '@/store/abstractions/IEntityState';
import { ContentDoc } from '@server/models/Content';

type ContentEntityState = IEntityState<ContentEntityStateData>;
type ContentEntityStateData = ContentDoc[];

type OptionalContentModuleStateInitParams = {};

class ContentModuleState extends AbstractModuleState<
  OptionalContentModuleStateInitParams,
  ContentEntityStateData
> {
  public getDefaultEntityStateData = (): ContentEntityStateData => {
    const defaultEntityStateData: ContentDoc[] = [];
    return defaultEntityStateData;
  };
}

export { ContentModuleState, ContentEntityState, ContentEntityStateData };
