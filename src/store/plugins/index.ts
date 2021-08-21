import createPersistedState from 'vuex-persistedstate';
import SecureLS from 'secure-ls';
import { secureLsConfig } from '../../config/secureLsConfig';

const ls = new SecureLS(secureLsConfig);

export const plugins = [
  createPersistedState({
    key: 'user',
    storage: {
      getItem: (key) => {
        ls.get(key);
      },
      setItem: (key, value) => ls.set(key, value),
      removeItem: (key) => ls.remove(key),
    },
  }),
];
