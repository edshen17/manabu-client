import SecureLS from 'secure-ls';
import createPersistedState from 'vuex-persistedstate';
import { secureLsConfig } from '../../config/secureLsConfig';

const ls = new SecureLS(secureLsConfig);

export const plugins = [
  createPersistedState({
    key: 'vuex',
    storage: {
      getItem: (key) => {
        ls.get(key);
      },
      setItem: (key, value) => ls.set(key, value),
      removeItem: (key) => ls.remove(key),
    },
  }),
];
