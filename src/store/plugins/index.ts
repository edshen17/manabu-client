import SecureLS from 'secure-ls';
import createPersistedState from 'vuex-persistedstate';
import { secureLsConfig } from '../../config/secureLsConfig';

const ls = new SecureLS(secureLsConfig);

const plugins = [
  createPersistedState({
    key: 'vuex',
    storage: {
      getItem: (key) => {
        try {
          ls.get(key);
        } catch (err) {
          ls.removeAll();
        }
      },
      setItem: (key, value) => ls.set(key, value),
      removeItem: (key) => ls.remove(key),
    },
  }),
];

export { ls, plugins };
