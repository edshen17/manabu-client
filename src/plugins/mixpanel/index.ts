import { IS_PRODUCTION } from '@server/constants';
import mixpanel from 'mixpanel-browser';

const MIX_PANEL_TOKEN = IS_PRODUCTION
  ? process.env.VUE_APP_MIX_PANEL_TOKEN!
  : process.env.VUE_APP_MIX_PANEL_TOKEN_DEV!;

mixpanel.init(MIX_PANEL_TOKEN, { ignore_dnt: true });

export { mixpanel };
