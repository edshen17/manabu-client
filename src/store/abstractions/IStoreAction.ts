export interface IModuleAction {
  fetchAPIData: (props: any) => any;
  clearModuleData?: () => any;
  init: (services: any) => this;
}
